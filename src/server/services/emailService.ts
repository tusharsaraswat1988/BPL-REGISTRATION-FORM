import { config } from '../config/env';

const RESEND_API = 'https://api.resend.com/emails';

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
 * Send transactional registration confirmation email via Resend REST API (BidWar standard)
 */
export async function sendRegistrationConfirmationEmail(data: RegistrationEmailData): Promise<boolean> {
  const isEnabled = config.email.emailEnabled;
  const apiKey = config.email.resendApiKey?.trim();
  const from = config.email.mailFrom?.trim();

  const recipients = Array.from(new Set([data.mentorEmail, data.associationEmail].filter(Boolean)));
  if (recipients.length === 0) return true;

  if (!isEnabled || !apiKey || !from) {
    console.log(`[Email Service - Notification Log] Confirmation logged for ${data.registrationId} (${data.teamName}). Recipients: ${recipients.join(', ')}. Status: Submitted (Payment Pending Verification).`);
    return true;
  }

  const categoryLabel = data.category === 'class_4_5_6' ? 'Category 1: Class 4–5–6' : 'Category 2: Class 7–8–9';
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #070D24; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1A2C68;">
      <div style="background-color: #0A1230; padding: 24px; text-align: center; border-bottom: 2px solid #FFB800;">
        <span style="font-size: 11px; font-weight: 800; color: #FFB800; text-transform: uppercase; letter-spacing: 2px;">Official Tournament Registration</span>
        <h1 style="font-size: 22px; font-weight: 900; margin: 6px 0 2px 0; color: #ffffff;">BIDWAR PREMIER LEAGUE</h1>
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">Kids Version — Season 1 • 3rd & 4th October 2026</p>
      </div>

      <div style="padding: 28px 24px;">
        <h2 style="font-size: 18px; color: #ffffff; margin-top: 0;">Registration Submitted Successfully!</h2>
        <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
          Your team <strong>${data.teamName}</strong> (${data.associationName}) has been successfully submitted for BidWar Premier League Kids Season 1.
        </p>

        <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Official Team Code:</td>
              <td style="color: #FFB800; font-weight: 900; font-family: monospace; font-size: 16px; text-align: right;">${data.teamCode}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Registration ID:</td>
              <td style="color: #ffffff; font-weight: bold; font-family: monospace; text-align: right;">${data.registrationId}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Division:</td>
              <td style="color: #ffffff; font-weight: bold; text-align: right;">${categoryLabel}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Mentor In-Charge:</td>
              <td style="color: #ffffff; font-weight: bold; text-align: right;">${data.mentorName}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Total Entry Fee:</td>
              <td style="color: #FFB800; font-weight: bold; font-family: monospace; text-align: right;">₹${data.totalAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Payment Status:</td>
              <td style="color: #38bdf8; font-weight: bold; text-align: right;">Pending Committee Verification</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
          Our tournament committee will verify your payment UTR and school class eligibility. You will receive updates via WhatsApp and email once credentials and tournament passes are issued.
        </p>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://chat.whatsapp.com/bidwar-kids-bpl2026" style="display: inline-block; background-color: #10b981; color: #022c22; font-weight: bold; font-size: 12px; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Join Official WhatsApp Community
          </a>
        </div>
      </div>

      <div style="background-color: #050A1C; padding: 16px 24px; text-align: center; border-top: 1px solid #132252; font-size: 11px; color: #64748b;">
        Organised by <strong style="color: #cbd5e1;">Bidwar.in</strong> & <strong style="color: #cbd5e1;">KV TechMedia</strong><br>
        Tournament Helpdesk: support@bidwar.in • https://bidwar.in
      </div>
    </div>
  `;

  try {
    for (const to of recipients) {
      const res = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `Registration Submitted: ${data.teamName} (${data.registrationId}) — BidWar Premier League Kids`,
          html: htmlContent,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error(`[Resend Error] Failed to send email to ${to}:`, body);
      }
    }
    return true;
  } catch (err: any) {
    console.error('[Resend Email Exception]', err.message);
    return false;
  }
}
