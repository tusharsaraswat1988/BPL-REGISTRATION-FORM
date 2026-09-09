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
export async function sendEmailWithIdempotency(options: SendEmailOptions, forceResend: boolean = false): Promise<{
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
    const claimRes = forceResend
      ? await query(
          `INSERT INTO email_deliveries (
            registration_id, recipient_type, recipient_email, email_type, status
          ) VALUES ($1, $2, $3, $4, 'PENDING')
          ON CONFLICT (registration_id, recipient_email, email_type)
          DO UPDATE SET status = 'PENDING', updated_at = NOW(), error_message = NULL
          RETURNING id, status`,
          [options.registrationId, options.recipientType, email, options.emailType]
        )
      : await query(
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
 * Event Trigger: REGISTRATION_COMPLETED (Initial Submission before Payment Approval)
 * Sends registration submission receipt ONLY to Association official email.
 * Mentor & Parents will be notified once payment is approved/verified.
 */
export async function triggerRegistrationCompletedEmails(registrationId: string, forceResend: boolean = false): Promise<void> {
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

    // Send Registration Summary ONLY to Association
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
        mentorMobile: reg.mentor.mobile,
        mentorSecondMobile: reg.mentor.secondMobile,
        mentorEmail: reg.mentor.email,
        mentorDesignation: reg.mentor.designation,
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
      }, forceResend);
    }
  } catch (err: any) {
    console.error(`[Email Service - Registration Workflow Exception] ${err.message}`);
  }
}

/**
 * Event Trigger: PAYMENT_VERIFIED
 * Triggered ONLY when payment is authoritatively VERIFIED.
 * Sequence:
 * 1. PAYMENT CONFIRMATION RECEIPT (Sent to Association / School Official)
 * 2. MENTOR WELCOME & SQUAD ROSTER (Sent to Mentor)
 * 3. PARENT WELCOME & CHILD CARD + MENTOR DETAILS (Sent to each Player's Parent)
 * 4. TOURNAMENT RULES EMAIL (Sent to Association, Mentor, and all Parents)
 */
export async function triggerPaymentVerifiedEmails(registrationId: string, forceResend: boolean = false): Promise<void> {
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

    // Determine authoritative transaction identifier
    const transactionId = reg.payment.gatewayPaymentId || reg.payment.utrTransactionId || reg.payment.gatewayOrderId || 'VERIFIED';
    const paymentMethod = reg.payment.gateway === 'CASHFREE' ? 'Cashfree Gateway Verified' : (reg.payment.method || 'UPI');
    const paymentDate = reg.payment.verifiedAt
      ? new Date(reg.payment.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // --- STEP 1: PAYMENT RECEIPT EMAIL (Sent to Association Official Email) ---
    if (reg.association?.email) {
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

      await sendEmailWithIdempotency({
        registrationId: reg.id,
        recipientType: 'ASSOCIATION',
        recipientEmail: reg.association.email,
        emailType: 'PAYMENT_CONFIRMATION',
        subject: paymentTpl.subject,
        html: paymentTpl.html,
      }, forceResend);
    }

    // --- STEP 2: MENTOR WELCOME & TEAM ROSTER (Sent to Mentor) ---
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
        mentorMobile: reg.mentor.mobile,
        mentorSecondMobile: reg.mentor.secondMobile,
        mentorEmail: reg.mentor.email,
        mentorDesignation: reg.mentor.designation,
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
      }, forceResend);
    }

    // --- STEP 3: PARENTS WELCOME + CHILD & MENTOR CONTACT DETAILS (Sent to each Parent) ---
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
        mentorMobile: reg.mentor.mobile,
        mentorSecondMobile: reg.mentor.secondMobile,
        mentorEmail: reg.mentor.email,
        mentorDesignation: reg.mentor.designation,
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
      }, forceResend);
    }

    // --- STEP 4: TOURNAMENT RULES & IMPORTANT INFORMATION (Association & Mentor ONLY) ---
    // Parents will NOT receive rules email — parents receive strictly one welcome confirmation email.
    const rulesRecipients: { email: string; type: RecipientType }[] = [];

    if (reg.association?.email) {
      rulesRecipients.push({ email: reg.association.email, type: 'ASSOCIATION' });
    }
    if (reg.mentor?.email) {
      rulesRecipients.push({ email: reg.mentor.email, type: 'MENTOR' });
    }

    const rulesTpl = renderTournamentRulesEmail({
      registrationId: reg.id,
      teamCode: reg.teamCode,
      teamName: reg.teamName,
      category: reg.category,
      associationName: reg.association.associationName,
      mentorName: reg.mentor.name,
      mentorMobile: reg.mentor.mobile,
      mentorEmail: reg.mentor.email,
      includeBranding: reg.includeBranding,
    });

    for (const r of rulesRecipients) {
      await sendEmailWithIdempotency({
        registrationId: reg.id,
        recipientType: r.type,
        recipientEmail: r.email,
        emailType: 'TOURNAMENT_RULES',
        subject: rulesTpl.subject,
        html: rulesTpl.html,
      }, forceResend);
    }
  } catch (err: any) {
    console.error(`[Email Service - Payment Verified Workflow Exception] ${err.message}`);
  }
}

/**
 * Force resend all transactional emails for a registration
 */
export async function resendAllRegistrationEmails(registrationId: string): Promise<boolean> {
  try {
    const reg = await getRegistrationById(registrationId);
    if (!reg) return false;

    await triggerRegistrationCompletedEmails(registrationId, true);
    if (reg.payment.paymentStatus === 'VERIFIED') {
      await triggerPaymentVerifiedEmails(registrationId, true);
    }
    return true;
  } catch (err: any) {
    console.error('[Email Resend Exception]', err.message);
    return false;
  }
}

/**
 * Resend transactional emails specifically for a single registered player to their parent
 */
export async function resendSinglePlayerEmail(
  registrationId: string,
  playerIndex: number
): Promise<{ success: boolean; playerName?: string; parentEmail?: string; error?: string }> {
  try {
    const reg = await getRegistrationById(registrationId);
    if (!reg) {
      return { success: false, error: 'Registration not found' };
    }

    if (playerIndex < 0 || playerIndex >= reg.players.length) {
      return { success: false, error: `Invalid player index: ${playerIndex}` };
    }

    const player = reg.players[playerIndex];
    const parentEmail = (player.parentEmail || '').trim();
    if (!parentEmail || !parentEmail.includes('@')) {
      return {
        success: false,
        error: `Parent email is not provided or invalid for player ${player.playerName}.`,
      };
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

    const parentPlayerInfo = {
      playerIndex: playerIndex + 1,
      playerName: player.playerName,
      studentClass: player.studentClass,
      jerseyNumber: player.jerseyNumber,
      jerseySize: player.jerseySize,
      cricketRole: player.cricketRole,
      battingStyle: player.battingStyle,
      bowlingStyle: player.bowlingStyle,
    };

    // 1. Registration Confirmation (Player View with Child details & Mentor Contact)
    const parentTpl = renderRegistrationConfirmationEmail({
      recipientType: 'PARENT',
      registrationId: reg.id,
      teamCode: reg.teamCode,
      teamName: reg.teamName,
      category: reg.category,
      associationName: reg.association.associationName,
      branch: reg.association.branch,
      mentorName: reg.mentor.name,
      mentorMobile: reg.mentor.mobile,
      mentorSecondMobile: reg.mentor.secondMobile,
      mentorEmail: reg.mentor.email,
      mentorDesignation: reg.mentor.designation,
      includeBranding: reg.includeBranding,
      totalAmount: reg.payment.totalAmount,
      paymentStatus: reg.payment.paymentStatus,
      players: playerInfos,
      parentPlayer: parentPlayerInfo,
    });

    await sendEmailWithIdempotency(
      {
        registrationId: reg.id,
        recipientType: 'PARENT',
        recipientEmail: parentEmail,
        emailType: 'REGISTRATION_CONFIRMATION',
        subject: parentTpl.subject,
        html: parentTpl.html,
      },
      true
    );

    // 2. If Payment is Verified, send Official Tournament Rules
    if (reg.payment.paymentStatus === 'VERIFIED') {
      const rulesTpl = renderTournamentRulesEmail({
        registrationId: reg.id,
        teamCode: reg.teamCode,
        teamName: reg.teamName,
        category: reg.category,
        associationName: reg.association.associationName,
        mentorName: reg.mentor.name,
        mentorMobile: reg.mentor.mobile,
        mentorEmail: reg.mentor.email,
        includeBranding: reg.includeBranding,
      });

      await sendEmailWithIdempotency(
        {
          registrationId: reg.id,
          recipientType: 'PARENT',
          recipientEmail: parentEmail,
          emailType: 'TOURNAMENT_RULES',
          subject: rulesTpl.subject,
          html: rulesTpl.html,
        },
        true
      );
    }

    return {
      success: true,
      playerName: player.playerName,
      parentEmail,
    };
  } catch (err: any) {
    console.error(`[Single Player Email Dispatch Exception] ${err.message}`);
    return { success: false, error: err.message };
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
