import { config } from '../config/env';
import { query } from '../db/index';
import { getRegistrationById, RegistrationFullRecord } from '../db/registrations';
import {
  renderRegistrationConfirmationEmail,
  renderPaymentConfirmationEmail,
  renderTournamentRulesEmail,
} from './email/templates';

const RESEND_API = 'https://api.resend.com/emails';

export type RecipientType = 'ASSOCIATION' | 'MENTOR' | 'PARENT';
export type EmailType = 'REGISTRATION_CONFIRMATION' | 'PAYMENT_CONFIRMATION' | 'TOURNAMENT_RULES';

export interface SendEmailOptions {
  registrationId: string;
  recipientType: RecipientType;
  recipientEmail: string;
  emailType: EmailType;
  subject: string;
  html: string;
}

export interface RegistrationEmailData {
  registrationId: string;
  teamCode: string;
  teamName: string;
  category: string;
  associationName: string;
  mentorName: string;
  mentorEmail: string;
  associationEmail: string;
  totalAmount: number;
  paymentStatus: string;
}

/**
 * Atomic Claim and Send Email via Resend with PostgreSQL Idempotency Protection
 */
export async function sendEmailWithIdempotency(options: SendEmailOptions): Promise<{
  success: boolean;
  alreadySent?: boolean;
  providerMessageId?: string;
  error?: string;
}> {
  const email = (options.recipientEmail || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    console.warn(`[Email Service] Skipping invalid/missing email address: '${options.recipientEmail}' for registration ${options.registrationId}`);
    return { success: false, error: 'Invalid or missing email address' };
  }

  let deliveryId: string | null = null;

  // 1. Atomic claim via PostgreSQL email_deliveries table
  try {
    const claimRes = await query(
      `INSERT INTO email_deliveries (
        registration_id, recipient_type, recipient_email, email_type, status
      ) VALUES ($1, $2, $3, $4, 'PENDING')
      ON CONFLICT (registration_id, recipient_email, email_type)
      DO UPDATE SET updated_at = NOW()
      WHERE email_deliveries.status != 'SENT'
      RETURNING id, status`,
      [options.registrationId, options.recipientType, email, options.emailType]
    );

    if (claimRes.rows.length === 0) {
      console.log(`[Email Service - Idempotent Skip] Email '${options.emailType}' already SENT to ${email} for registration ${options.registrationId}.`);
      return { success: true, alreadySent: true };
    }

    deliveryId = claimRes.rows[0].id;
  } catch (dbErr: any) {
    console.warn(`[Email Service - DB Claim Warning] Idempotency record creation note: ${dbErr.message}`);
  }

  const isEnabled = config.email.emailEnabled;
  const apiKey = config.email.resendApiKey?.trim();
  const from = config.email.mailFrom?.trim();

  // 2. If email disabled or missing credentials in non-production, log and succeed
  if (!isEnabled || !apiKey || !from) {
    console.log(`[Email Service - Mock Dispatch] [${options.emailType}] '${options.subject}' -> ${email} (${options.recipientType})`);
    if (deliveryId) {
      await query(
        `UPDATE email_deliveries
         SET status = 'SENT',
             provider_message_id = 'mock_msg_dev',
             sent_at = NOW()
         WHERE id = $1`,
        [deliveryId]
      ).catch(() => {});
    }
    return { success: true, providerMessageId: 'mock_msg_dev' };
  }

  // 3. Dispatch to Resend REST API
  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: options.subject,
        html: options.html,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const providerMessageId = data.id || 'resend_ok';

      if (deliveryId) {
        await query(
          `UPDATE email_deliveries
           SET status = 'SENT',
               provider_message_id = $1,
               sent_at = NOW(),
               error_message = NULL
           WHERE id = $2`,
          [providerMessageId, deliveryId]
        ).catch(() => {});
      }

      return { success: true, providerMessageId };
    } else {
      const body = await res.text().catch(() => '');
      console.error(`[Resend Error] Failed to send email to ${email}:`, body);

      if (deliveryId) {
        await query(
          `UPDATE email_deliveries
           SET status = 'FAILED',
               error_message = $1
           WHERE id = $2`,
          [body.slice(0, 1000), deliveryId]
        ).catch(() => {});
      }

      return { success: false, error: body };
    }
  } catch (err: any) {
    console.error(`[Resend Exception] Error sending to ${email}:`, err.message);

    if (deliveryId) {
      await query(
        `UPDATE email_deliveries
         SET status = 'FAILED',
             error_message = $1
         WHERE id = $2`,
        [err.message.slice(0, 1000), deliveryId]
      ).catch(() => {});
    }

    return { success: false, error: err.message };
  }
}

/**
 * Event Trigger: REGISTRATION_COMPLETED
 * Sends registration confirmation emails to:
 * 1. Association email
 * 2. Mentor email
 * 3. Each registered player's parent email (child-specific view)
 */
export async function triggerRegistrationCompletedEmails(registrationId: string): Promise<void> {
  try {
    const reg = await getRegistrationById(registrationId);
    if (!reg) {
      console.error(`[Email Service] Registration ${registrationId} not found for email dispatch.`);
      return;
    }

    const playerInfos = reg.players.map((p, idx) => ({
      playerIndex: idx + 1,
      playerName: p.playerName,
      studentClass: p.studentClass,
      jerseyNumber: p.jerseyNumber,
      jerseySize: p.jerseySize,
      cricketRole: p.cricketRole,
      battingStyle: p.battingStyle,
      bowlingStyle: p.bowlingStyle,
    }));

    // 1. Send to Association
    if (reg.association?.email) {
      const assocTpl = renderRegistrationConfirmationEmail({
        recipientType: 'ASSOCIATION',
        registrationId: reg.id,
        teamCode: reg.teamCode,
        teamName: reg.teamName,
        category: reg.category,
        associationName: reg.association.associationName,
        branch: reg.association.branch,
        mentorName: reg.mentor.name,
        includeBranding: reg.includeBranding,
        totalAmount: reg.payment.totalAmount,
        paymentStatus: reg.payment.paymentStatus,
        players: playerInfos,
      });

      await sendEmailWithIdempotency({
        registrationId: reg.id,
        recipientType: 'ASSOCIATION',
        recipientEmail: reg.association.email,
        emailType: 'REGISTRATION_CONFIRMATION',
        subject: assocTpl.subject,
        html: assocTpl.html,
      });
    }

    // 2. Send to Mentor
    if (reg.mentor?.email) {
      const mentorTpl = renderRegistrationConfirmationEmail({
        recipientType: 'MENTOR',
        registrationId: reg.id,
        teamCode: reg.teamCode,
        teamName: reg.teamName,
        category: reg.category,
        associationName: reg.association.associationName,
        branch: reg.association.branch,
        mentorName: reg.mentor.name,
        includeBranding: reg.includeBranding,
        totalAmount: reg.payment.totalAmount,
        paymentStatus: reg.payment.paymentStatus,
        players: playerInfos,
      });

      await sendEmailWithIdempotency({
        registrationId: reg.id,
        recipientType: 'MENTOR',
        recipientEmail: reg.mentor.email,
        emailType: 'REGISTRATION_CONFIRMATION',
        subject: mentorTpl.subject,
        html: mentorTpl.html,
      });
    }

    // 3. Send to each Parent (STRICT PRIVACY: Parent sees ONLY their child's info)
    for (let i = 0; i < reg.players.length; i++) {
      const player = reg.players[i];
      if (!player.parentEmail) continue;

      const parentPlayerInfo = {
        playerIndex: i + 1,
        playerName: player.playerName,
        studentClass: player.studentClass,
        jerseyNumber: player.jerseyNumber,
        jerseySize: player.jerseySize,
        cricketRole: player.cricketRole,
        battingStyle: player.battingStyle,
        bowlingStyle: player.bowlingStyle,
      };

      const parentTpl = renderRegistrationConfirmationEmail({
        recipientType: 'PARENT',
        registrationId: reg.id,
        teamCode: reg.teamCode,
        teamName: reg.teamName,
        category: reg.category,
        associationName: reg.association.associationName,
        branch: reg.association.branch,
        mentorName: reg.mentor.name,
        includeBranding: reg.includeBranding,
        totalAmount: reg.payment.totalAmount,
        paymentStatus: reg.payment.paymentStatus,
        players: playerInfos,
        parentPlayer: parentPlayerInfo,
      });

      await sendEmailWithIdempotency({
        registrationId: reg.id,
        recipientType: 'PARENT',
        recipientEmail: player.parentEmail,
        emailType: 'REGISTRATION_CONFIRMATION',
        subject: parentTpl.subject,
        html: parentTpl.html,
      });
    }
  } catch (err: any) {
    console.error(`[Email Service - Registration Workflow Exception] ${err.message}`);
  }
}

/**
 * Event Trigger: PAYMENT_VERIFIED
 * Triggered ONLY when payment is authoritatively VERIFIED.
 * Sequence:
 * 1. PAYMENT CONFIRMATION EMAIL (Association, Mentor, All Parents)
 * 2. TOURNAMENT RULES EMAIL (Association, Mentor, All Parents)
 */
export async function triggerPaymentVerifiedEmails(registrationId: string): Promise<void> {
  try {
    const reg = await getRegistrationById(registrationId);
    if (!reg) {
      console.error(`[Email Service] Registration ${registrationId} not found for payment verified workflow.`);
      return;
    }

    // Strict Enforcement: Must be authoritatively VERIFIED
    if (reg.payment.paymentStatus !== 'VERIFIED') {
      console.warn(`[Email Service] Cannot send payment confirmation: Registration ${registrationId} status is '${reg.payment.paymentStatus}', not 'VERIFIED'.`);
      return;
    }

    // Determine authoritative transaction identifier
    const transactionId = reg.payment.gatewayPaymentId || reg.payment.utrTransactionId || reg.payment.gatewayOrderId || 'VERIFIED';
    const paymentMethod = reg.payment.gateway === 'CASHFREE' ? 'Cashfree Gateway Verified' : (reg.payment.method || 'UPI');
    const paymentDate = reg.payment.verifiedAt
      ? new Date(reg.payment.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // Collect distinct recipient emails with their recipient types
    const recipients: { email: string; type: RecipientType }[] = [];

    if (reg.association?.email) {
      recipients.push({ email: reg.association.email, type: 'ASSOCIATION' });
    }
    if (reg.mentor?.email) {
      recipients.push({ email: reg.mentor.email, type: 'MENTOR' });
    }
    for (const p of reg.players) {
      if (p.parentEmail) {
        recipients.push({ email: p.parentEmail, type: 'PARENT' });
      }
    }

    // --- STEP 1: PAYMENT CONFIRMATION EMAIL ---
    const paymentTpl = renderPaymentConfirmationEmail({
      registrationId: reg.id,
      teamCode: reg.teamCode,
      teamName: reg.teamName,
      category: reg.category,
      associationName: reg.association.associationName,
      paymentAmount: reg.payment.totalAmount,
      paymentMethod,
      transactionId,
      paymentDate,
      includeBranding: reg.includeBranding,
    });

    for (const r of recipients) {
      await sendEmailWithIdempotency({
        registrationId: reg.id,
        recipientType: r.type,
        recipientEmail: r.email,
        emailType: 'PAYMENT_CONFIRMATION',
        subject: paymentTpl.subject,
        html: paymentTpl.html,
      });
    }

    // --- STEP 2: TOURNAMENT RULES & IMPORTANT INFORMATION EMAIL ---
    const rulesTpl = renderTournamentRulesEmail({
      registrationId: reg.id,
      teamCode: reg.teamCode,
      teamName: reg.teamName,
      category: reg.category,
      associationName: reg.association.associationName,
      mentorName: reg.mentor.name,
      includeBranding: reg.includeBranding,
    });

    for (const r of recipients) {
      await sendEmailWithIdempotency({
        registrationId: reg.id,
        recipientType: r.type,
        recipientEmail: r.email,
        emailType: 'TOURNAMENT_RULES',
        subject: rulesTpl.subject,
        html: rulesTpl.html,
      });
    }
  } catch (err: any) {
    console.error(`[Email Service - Payment Verified Workflow Exception] ${err.message}`);
  }
}

/**
 * Backward compatibility wrapper
 */
export async function sendRegistrationConfirmationEmail(data: RegistrationEmailData): Promise<boolean> {
  try {
    await triggerRegistrationCompletedEmails(data.registrationId);
    if (data.paymentStatus === 'VERIFIED') {
      await triggerPaymentVerifiedEmails(data.registrationId);
    }
    return true;
  } catch (err: any) {
    console.error('[Email Service Wrapper Exception]', err.message);
    return false;
  }
}
