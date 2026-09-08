import crypto from 'crypto';
import { config } from '../config/env';

export interface CashfreeCustomerDetails {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface CreateOrderParams {
  orderId: string;
  orderAmount: number;
  customerDetails: CashfreeCustomerDetails;
  orderNote?: string;
  returnUrl?: string;
  notifyUrl?: string;
}

export interface CashfreeOrderResponse {
  orderId: string;
  paymentSessionId: string;
  orderStatus: string;
  orderAmount: number;
  orderCurrency: string;
  environment: 'sandbox' | 'production';
  isMock?: boolean;
}

export interface CashfreePaymentRecord {
  paymentId: string;
  orderId: string;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED' | 'CANCELLED';
  paymentAmount: number;
  paymentCurrency: string;
  paymentTime?: string;
  paymentMethod?: string;
  bankReference?: string;
  rawResponse?: any;
}

export interface CashfreeVerificationResult {
  verified: boolean;
  orderId: string;
  orderStatus: string;
  payment?: CashfreePaymentRecord;
  error?: string;
}

export class CashfreeService {
  private getBaseUrl(): string {
    return config.cashfree.environment === 'PRODUCTION'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';
  }

  private isConfigured(): boolean {
    return Boolean(config.cashfree.appId?.trim() && config.cashfree.secretKey?.trim());
  }

  /**
   * Create an authoritative Cashfree PG Order
   */
  async createOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
    const { orderId, orderAmount, customerDetails, orderNote, returnUrl, notifyUrl } = params;

    // Fail-closed in production
    if (!this.isConfigured()) {
      if (config.nodeEnv === 'production' || config.cashfree.environment === 'PRODUCTION') {
        throw new Error('[FATAL] Cashfree credentials (CASHFREE_APP_ID / CASHFREE_SECRET_KEY) are missing in production.');
      }
      console.warn('[Cashfree Service] API keys not set in development. Generating sandbox simulation order.');
      const mockSessionId = `session_mock_${crypto.randomBytes(16).toString('hex')}`;
      return {
        orderId,
        paymentSessionId: mockSessionId,
        orderStatus: 'ACTIVE',
        orderAmount,
        orderCurrency: 'INR',
        environment: 'sandbox',
        isMock: true,
      };
    }

    const url = `${this.getBaseUrl()}/orders`;
    const payload = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerDetails.customerId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50),
        customer_name: customerDetails.customerName.slice(0, 100),
        customer_email: customerDetails.customerEmail.slice(0, 100),
        customer_phone: customerDetails.customerPhone.replace(/[^0-9]/g, '').slice(-10),
      },
      order_meta: {
        return_url: returnUrl || undefined,
        notify_url: notifyUrl || undefined,
      },
      order_note: orderNote || 'BidWar Premier League — Registration Fee',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-client-id': config.cashfree.appId!,
        'x-client-secret': config.cashfree.secretKey!,
        'x-api-version': config.cashfree.apiVersion,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Cashfree Create Order Error]', data);
      throw new Error(data.message || `Cashfree Order creation failed with status ${response.status}`);
    }

    return {
      orderId: data.order_id || orderId,
      paymentSessionId: data.payment_session_id,
      orderStatus: data.order_status,
      orderAmount: Number(data.order_amount),
      orderCurrency: data.order_currency || 'INR',
      environment: config.cashfree.environment === 'PRODUCTION' ? 'production' : 'sandbox',
      isMock: false,
    };
  }

  /**
   * Verify Order and Fetch Payment Transactions from Cashfree with Amount Validation
   */
  async verifyOrder(orderId: string, expectedAmount?: number): Promise<CashfreeVerificationResult> {
    if (!this.isConfigured()) {
      if (config.nodeEnv === 'production' || config.cashfree.environment === 'PRODUCTION') {
        throw new Error('[FATAL] Cashfree credentials are missing in production. Cannot verify payment.');
      }
      // In local dev simulation mode, simulate verified payment with requested/expected amount
      const simAmount = expectedAmount ?? config.fees.baseRegistrationFee;
      return {
        verified: true,
        orderId,
        orderStatus: 'PAID',
        payment: {
          paymentId: `cf_mock_pay_${crypto.randomBytes(8).toString('hex')}`,
          orderId,
          paymentStatus: 'SUCCESS',
          paymentAmount: simAmount,
          paymentCurrency: 'INR',
          paymentTime: new Date().toISOString(),
          paymentMethod: 'UPI',
          bankReference: `UPI-MOCK-${crypto.randomInt(100000000000, 999999999999)}`,
          rawResponse: { simulation: true },
        },
      };
    }

    const orderUrl = `${this.getBaseUrl()}/orders/${encodeURIComponent(orderId)}`;
    const paymentsUrl = `${this.getBaseUrl()}/orders/${encodeURIComponent(orderId)}/payments`;

    const headers = {
      'x-client-id': config.cashfree.appId!,
      'x-client-secret': config.cashfree.secretKey!,
      'x-api-version': config.cashfree.apiVersion,
    };

    // 1. Fetch Order Details
    const orderRes = await fetch(orderUrl, { method: 'GET', headers });
    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      return {
        verified: false,
        orderId,
        orderStatus: 'UNKNOWN',
        error: orderData.message || 'Failed to retrieve order from Cashfree.',
      };
    }

    // 2. Validate Order Amount if expectedAmount supplied
    if (expectedAmount !== undefined && Number(orderData.order_amount) !== expectedAmount) {
      return {
        verified: false,
        orderId,
        orderStatus: orderData.order_status,
        error: `Order amount mismatch: expected ₹${expectedAmount}, but Cashfree order has ₹${orderData.order_amount}`,
      };
    }

    // 3. Fetch Payments for this Order
    const payRes = await fetch(paymentsUrl, { method: 'GET', headers });
    const payData = await payRes.json();

    let successfulPayment: CashfreePaymentRecord | undefined;

    if (Array.isArray(payData)) {
      const success = payData.find(
        (p: any) => p.payment_status === 'SUCCESS' || p.payment_status === 'PAID'
      );
      if (success) {
        successfulPayment = {
          paymentId: String(success.cf_payment_id || success.payment_id),
          orderId,
          paymentStatus: 'SUCCESS',
          paymentAmount: Number(success.payment_amount),
          paymentCurrency: success.payment_currency || 'INR',
          paymentTime: success.payment_time,
          paymentMethod: success.payment_group || success.payment_method?.type || 'UPI',
          bankReference: success.bank_reference || success.payment_id,
          rawResponse: success,
        };
      }
    }

    // 4. Validate Payment Amount if successful payment found
    if (successfulPayment && expectedAmount !== undefined && successfulPayment.paymentAmount !== expectedAmount) {
      return {
        verified: false,
        orderId,
        orderStatus: orderData.order_status,
        error: `Payment amount mismatch: expected ₹${expectedAmount}, but received ₹${successfulPayment.paymentAmount}`,
      };
    }

    const isPaid = (orderData.order_status === 'PAID' || Boolean(successfulPayment)) &&
      (successfulPayment ? successfulPayment.paymentStatus === 'SUCCESS' : orderData.order_status === 'PAID');

    return {
      verified: isPaid,
      orderId,
      orderStatus: orderData.order_status,
      payment: successfulPayment,
    };
  }

  /**
   * Verify Cashfree Webhook Signature (HMAC-SHA256) on raw buffer or string
   */
  verifyWebhookSignature(rawBody: string | Buffer, signature: string, timestamp: string): boolean {
    if (!config.cashfree.secretKey) return false;
    if (!signature || !timestamp) return false;
    try {
      const bodyBuffer = typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : rawBody;
      const timestampBuffer = Buffer.from(timestamp, 'utf8');
      const dataToSign = Buffer.concat([timestampBuffer, bodyBuffer]);

      const expectedSignature = crypto
        .createHmac('sha256', config.cashfree.secretKey)
        .update(dataToSign)
        .digest('base64');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
      );
    } catch {
      return false;
    }
  }
}

export const cashfreeService = new CashfreeService();
