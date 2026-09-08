import { Router } from 'express';
import crypto from 'crypto';
import { cashfreeService } from '../services/cashfreeService';
import { config } from '../config/env';
import { publicApiLimiter, registrationSubmissionLimiter } from '../middleware/rateLimiter';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';
import { isRegistrationWindowOpen, getRegistrationById } from '../db/registrations';
import { triggerPaymentVerifiedEmails } from '../services/emailService';
import { query } from '../db/index';

export const paymentRoutes = Router();

/**
 * 1. Cashfree Client Public Config
 */
paymentRoutes.get('/cashfree/config', publicApiLimiter, (_req, res) => {
  res.json({
    success: true,
    environment: config.cashfree.environment === 'PRODUCTION' ? 'production' : 'sandbox',
    configured: Boolean(config.cashfree.appId && config.cashfree.secretKey),
    apiVersion: config.cashfree.apiVersion,
  });
});

/**
 * 2. Create Cashfree Payment Order (Bound to Internal Payment Intent)
 */
paymentRoutes.post(
  '/cashfree/create-order',
  registrationSubmissionLimiter,
  optionalAuth,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      // Check registration window
      const windowCheck = isRegistrationWindowOpen();
      if (!windowCheck.open) {
        res.status(403).json({
          success: false,
          error: 'RegistrationClosed',
          message: windowCheck.reason || 'Tournament registration is currently closed.',
        });
        return;
      }

      const { category, includeBranding, teamName, mentor, association } = req.body;
      const draftToken = (req.headers['x-draft-token'] as string) || req.body.draftToken || `draft_${crypto.randomBytes(16).toString('hex')}`;

      // Authoritative backend fee calculation
      const baseFee = config.fees.baseRegistrationFee; // ₹8,000
      const brandingFee = includeBranding ? config.fees.brandingAddonFee : 0; // ₹5,000 or ₹0
      const totalAmount = baseFee + brandingFee;

      // Clean customer details
      const customerId = req.authIdentity?.userId || `cust_${crypto.randomBytes(6).toString('hex')}`;
      const customerName = mentor?.name?.trim() || teamName?.trim() || 'BPL Kids Team';
      const customerEmail = mentor?.email?.trim() || association?.email?.trim() || 'bpl@bidwar.in';
      const customerPhone = mentor?.mobile?.trim() || association?.mobile?.trim() || '9876543210';

      // Generate unique order ID
      const timestamp = Date.now();
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const orderId = `BPL_${timestamp}_${randomSuffix}`;

      const orderNote = `BPL Kids Season 1 — ${teamName || 'Team Entry'} (${category === 'class_4_5_6' ? 'Class 4-6' : 'Class 7-9'})`;

      const appUrl = process.env.APP_URL || `http://localhost:${config.port}`;
      const returnUrl = `${appUrl}/api/payments/cashfree/return?order_id={order_id}`;
      const notifyUrl = `${appUrl}/api/payments/cashfree/webhook`;

      // 1. Call Cashfree PG Order API
      const order = await cashfreeService.createOrder({
        orderId,
        orderAmount: totalAmount,
        customerDetails: {
          customerId,
          customerName,
          customerEmail,
          customerPhone,
        },
        orderNote,
        returnUrl,
        notifyUrl,
      });

      // 2. Persist immutable internal payment intent bound to draft/order
      await query(
        `INSERT INTO payment_intents (
          order_id, draft_token, amount, currency, status, category, include_branding, team_name, auth_user_id
        ) VALUES ($1, $2, $3, 'INR', 'CREATED', $4, $5, $6, $7)
        ON CONFLICT (order_id) DO NOTHING`,
        [
          order.orderId,
          draftToken,
          totalAmount,
          category || 'class_4_5_6',
          Boolean(includeBranding),
          teamName?.trim() || null,
          req.authIdentity?.userId || null,
        ]
      );

      res.json({
        success: true,
        orderId: order.orderId,
        paymentSessionId: order.paymentSessionId,
        orderAmount: order.orderAmount,
        orderCurrency: order.orderCurrency,
        environment: order.environment,
        draftToken,
        isMock: order.isMock,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * 3. Verify Cashfree Payment Order (Strict Authoritative Server Check)
 */
paymentRoutes.post(
  '/cashfree/verify-order',
  publicApiLimiter,
  optionalAuth,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { orderId, draftToken } = req.body;
      if (!orderId || typeof orderId !== 'string') {
        res.status(400).json({ success: false, error: 'orderId is required.' });
        return;
      }

      // 1. Look up internally bound payment intent
      const intentRes = await query(
        `SELECT * FROM payment_intents WHERE order_id = $1 LIMIT 1`,
        [orderId.trim()]
      );

      if (intentRes.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'PaymentIntentNotFound',
          message: 'No internal payment record matching this Cashfree order was found.',
        });
        return;
      }

      const intent = intentRes.rows[0];

      // 2. Enforce draft ownership boundary if draftToken is provided
      const reqDraftToken = (req.headers['x-draft-token'] as string) || draftToken;
      if (reqDraftToken && intent.draft_token !== reqDraftToken) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'This payment order belongs to a different registration session.',
        });
        return;
      }

      // 3. Authoritatively verify with Cashfree passing expected amount
      const result = await cashfreeService.verifyOrder(orderId.trim(), intent.amount);

      if (!result.verified) {
        res.status(400).json({
          success: false,
          verified: false,
          orderId: result.orderId,
          orderStatus: result.orderStatus,
          error: result.error || 'Payment was not marked as successful by Cashfree.',
        });
        return;
      }

      // 4. Update internal payment intent to PAID
      const payId = result.payment?.paymentId || `cf_${orderId}`;
      const bankRef = result.payment?.bankReference || payId;
      const payMethod = result.payment?.paymentMethod || 'UPI';

      await query(
        `UPDATE payment_intents
         SET status = 'PAID',
             cf_payment_id = $1,
             bank_reference = $2,
             payment_method = $3,
             raw_response = $4,
             updated_at = NOW()
         WHERE order_id = $5`,
        [
          payId,
          bankRef,
          payMethod,
          result.payment?.rawResponse ? JSON.stringify(result.payment.rawResponse) : null,
          orderId.trim(),
        ]
      );

      res.json({
        success: true,
        verified: true,
        orderId: intent.order_id,
        orderStatus: 'PAID',
        payment: {
          paymentId: payId,
          orderId: intent.order_id,
          paymentAmount: intent.amount,
          bankReference: bankRef,
          paymentMethod: payMethod,
        },
      });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * 4. Cashfree Webhook Handler (Raw Body HMAC-SHA256 & Exact-Once Delivery)
 */
paymentRoutes.post('/cashfree/webhook', async (req, res) => {
  try {
    const signature = (req.headers['x-webhook-signature'] as string) || '';
    const timestamp = (req.headers['x-webhook-timestamp'] as string) || '';
    const rawBody: Buffer | string = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));

    const isValid = cashfreeService.verifyWebhookSignature(rawBody, signature, timestamp);
    if (!isValid) {
      if (config.nodeEnv === 'production' || config.cashfree.environment === 'PRODUCTION') {
        console.warn('[Cashfree Webhook] Invalid signature rejected in production.');
        res.status(401).json({ status: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed.' });
        return;
      }
    }

    const { type, data } = req.body || {};
    const orderId = data?.order?.order_id;
    const paymentId = data?.payment?.cf_payment_id || data?.payment?.payment_id;

    console.log(`[Cashfree Webhook] Event: ${type}, Order: ${orderId}`);

    if (type === 'PAYMENT_SUCCESS_WEBHOOK' || type === 'ORDER_PAID') {
      if (orderId) {
        // 1. Look up payment intent
        const intentRes = await query(
          `SELECT * FROM payment_intents WHERE order_id = $1 LIMIT 1`,
          [orderId]
        );

        if (intentRes.rows.length > 0) {
          const intent = intentRes.rows[0];
          // Authoritatively verify with Cashfree server
          const verifyResult = await cashfreeService.verifyOrder(orderId, intent.amount);
          if (verifyResult.verified) {
            await query(
              `UPDATE payment_intents
               SET status = 'PAID',
                   cf_payment_id = COALESCE($1, cf_payment_id),
                   raw_response = $2,
                   updated_at = NOW()
               WHERE order_id = $3`,
              [paymentId ? String(paymentId) : null, JSON.stringify(data), orderId]
            );
          }
        }

        // 2. Update existing payment record if registration was already submitted
        const updateRes = await query(
          `UPDATE payments
           SET payment_status = 'VERIFIED',
               verified_at = COALESCE(verified_at, NOW()),
               verified_by = 'CASHFREE_WEBHOOK',
               gateway_payment_id = COALESCE($1, gateway_payment_id),
               gateway_raw_response = $2,
               confirmation_email_sent_at = COALESCE(confirmation_email_sent_at, NOW())
           WHERE gateway_order_id = $3
           RETURNING registration_id, confirmation_email_sent_at`,
          [paymentId ? String(paymentId) : null, JSON.stringify(data), orderId]
        );

        // 3. Exactly-once payment confirmation and rules email dispatch
        if (updateRes.rows.length > 0) {
          const paymentRow = updateRes.rows[0];
          triggerPaymentVerifiedEmails(paymentRow.registration_id)
            .catch((err) => console.error('[Webhook Email Error]', err.message));
        }
      }
    }

    res.status(200).json({ status: 'OK' });
  } catch (err: any) {
    console.error('[Cashfree Webhook Error]', err.message);
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});
