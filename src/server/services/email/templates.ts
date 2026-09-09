import { TOURNAMENT_CONFIG } from '../../../config/tournamentConfig';
import {
  EmailLayout,
  TeamDetailsCard,
  PaymentDetailsCard,
  PlayerTable,
  ParentChildCard,
  MentorDetailsCard,
  CTAButton,
  PlayerInfo,
  TeamCardData,
  PaymentCardData,
  MentorInfo,
} from './components';

export interface RegistrationEmailTemplateData {
  recipientType: 'ASSOCIATION' | 'MENTOR' | 'PARENT';
  registrationId: string;
  teamCode: string;
  teamName: string;
  category: string;
  associationName: string;
  branch: string;
  mentorName: string;
  mentorMobile?: string;
  mentorSecondMobile?: string;
  mentorEmail?: string;
  mentorDesignation?: string;
  includeBranding: boolean;
  totalAmount: number;
  paymentStatus: string;
  players: PlayerInfo[];
  parentPlayer?: PlayerInfo;
}

export interface PaymentEmailTemplateData {
  registrationId: string;
  teamCode: string;
  teamName: string;
  category: string;
  associationName: string;
  paymentAmount: number;
  paymentMethod: string;
  transactionId: string;
  paymentDate?: string;
  includeBranding: boolean;
}

export interface RulesEmailTemplateData {
  registrationId: string;
  teamCode: string;
  teamName: string;
  category: string;
  associationName: string;
  mentorName: string;
  mentorMobile?: string;
  mentorEmail?: string;
  includeBranding: boolean;
}

/**
 * 1. Registration Confirmation Email Template
 */
export function renderRegistrationConfirmationEmail(data: RegistrationEmailTemplateData): { subject: string; html: string } {
  const isParent = data.recipientType === 'PARENT';
  const isMentor = data.recipientType === 'MENTOR';
  const categoryLabel = data.category === 'class_4_5_6' ? 'Category 1: Class 4–5–6' : 'Category 2: Class 7–8–9';
  const brandingStatus = data.includeBranding ? 'Included' : 'Standard';
  const tournamentDates = TOURNAMENT_CONFIG.TOURNAMENT_DATES;

  const teamData: TeamCardData = {
    teamName: data.teamName,
    category: data.category,
    associationName: data.associationName,
    branch: data.branch,
    registrationId: data.registrationId,
    teamCode: data.teamCode,
    mentorName: data.mentorName,
    squadSize: data.players.length || 8,
    brandingStatus: isParent ? undefined : brandingStatus, // Do not show branding package to parents
    tournamentDates,
    paymentStatus: isParent || isMentor ? undefined : data.paymentStatus, // Do not show billing status to parents or mentors
  };

  const mentorInfo: MentorInfo = {
    name: data.mentorName,
    designation: data.mentorDesignation || 'Head Cricket Coach',
  };

  let contentHtml = '';
  let subject = '';

  if (isParent && data.parentPlayer) {
    // Strict Child-Specific Parent View with Welcome Message and Mentor Details
    subject = `🏏 Welcome to BPL Season 1 | Registration Confirmed — ${data.parentPlayer.playerName}`;
    contentHtml = `
      <h2 style="font-size: 18px; color: #ffffff; margin-top: 0; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        Welcome to BidWar Premier League — Kids Season 1!
      </h2>
      <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">
        Dear Parent, we are delighted to welcome your young champion <strong>${data.parentPlayer.playerName}</strong> to <strong>BidWar Premier League (Kids Season 1)</strong>! Your child has been officially registered in squad <strong>${data.teamName}</strong> representing <strong>${data.associationName} (${data.branch})</strong>.
      </p>

      ${ParentChildCard(data.parentPlayer)}

      ${MentorDetailsCard(mentorInfo)}

      ${TeamDetailsCard(teamData)}

      <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <h4 style="font-size: 12px; font-weight: 800; color: #FFB800; text-transform: uppercase; margin: 0 0 6px 0; font-family: monospace;">
          Important Instructions for Match Days
        </h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #cbd5e1; line-height: 1.7;">
          <li>Matches will be played on <strong>${tournamentDates}</strong> in Varanasi.</li>
          <li>Please ensure your child brings a valid <strong>School Photo ID or Bonafide certificate</strong> for age & class verification.</li>
          <li>For team reporting time and coordination, please contact your designated Mentor: <strong style="color: #ffffff;">${mentorInfo.name}</strong>.</li>
        </ul>
      </div>

      ${CTAButton('Join Official Tournament WhatsApp Community', TOURNAMENT_CONFIG.WHATSAPP_LINK)}
    `;
  } else if (isMentor) {
    // Mentor Welcome & Team Roster View (No billing info)
    subject = `🏏 Welcome Mentor! Team Registration Confirmed — ${data.teamName} | BPL Season 1`;
    contentHtml = `
      <h2 style="font-size: 18px; color: #ffffff; margin-top: 0; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        Welcome Mentor! Team Registration Confirmed
      </h2>
      <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">
        Dear <strong>${data.mentorName}</strong>, welcome to <strong>BidWar Premier League — Kids Version (Season 1)</strong>! Your team <strong>${data.teamName}</strong> (${data.associationName}) has been successfully registered under your leadership.
      </p>

      ${TeamDetailsCard(teamData)}

      ${PlayerTable(data.players)}

      <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <h4 style="font-size: 12px; font-weight: 800; color: #38BDF8; text-transform: uppercase; margin: 0 0 6px 0; font-family: monospace;">
          Mentor Responsibilities & Briefing
        </h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #cbd5e1; line-height: 1.7;">
          <li>As Mentor In-Charge, you are the official liaison between the tournament committee and player parents.</li>
          <li>Your Team Code is <strong style="color: #FFB800; font-family: monospace;">${data.teamCode}</strong> (used for official toss and digital desk entries).</li>
          <li>Match fixtures, toss timings, and ground reporting rules will be notified to you before match days.</li>
        </ul>
      </div>

      ${CTAButton('Join Official Tournament WhatsApp Community', TOURNAMENT_CONFIG.WHATSAPP_LINK)}
    `;
  } else {
    // Association Official View
    subject = `🏏 Team Registration Received | ${data.teamName} — BidWar Premier League`;
    contentHtml = `
      <h2 style="font-size: 18px; color: #ffffff; margin-top: 0; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        Team Registration Received
      </h2>
      <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">
        Your team <strong>${data.teamName}</strong> (${data.associationName}) has been successfully submitted for the <strong>BidWar Premier League — Kids Version (Season 1)</strong>.
      </p>

      ${TeamDetailsCard(teamData)}

      ${PlayerTable(data.players)}

      <p style="font-size: 12px; color: #94a3b8; line-height: 1.6; margin-top: 16px;">
        Our tournament committee is reviewing your submission and verifying student class eligibility. Once payment is verified, your authoritative tournament confirmation and credentials will be issued.
      </p>

      ${CTAButton('Join Official Tournament WhatsApp Community', TOURNAMENT_CONFIG.WHATSAPP_LINK)}
    `;
  }

  const html = EmailLayout(contentHtml, 'Official Tournament Registration');
  return { subject, html };
}

/**
 * 2. Payment Confirmation Email Template
 * Subject: "✅ Payment Confirmed | {{teamName}} | BidWar Premier League"
 */
export function renderPaymentConfirmationEmail(data: PaymentEmailTemplateData): { subject: string; html: string } {
  const brandingStatus = data.includeBranding ? 'Included' : 'Standard';
  const tournamentDates = TOURNAMENT_CONFIG.TOURNAMENT_DATES;

  const paymentData: PaymentCardData = {
    paymentStatus: 'PAID & VERIFIED',
    registrationId: data.registrationId,
    teamCode: data.teamCode,
    teamName: data.teamName,
    category: data.category,
    associationName: data.associationName,
    paymentAmount: data.paymentAmount,
    paymentMethod: data.paymentMethod,
    transactionId: data.transactionId,
    paymentDate: data.paymentDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    brandingStatus,
    tournamentDates,
  };

  const contentHtml = `
    <h2 style="font-size: 18px; color: #ffffff; margin-top: 0; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      Payment Confirmed & Verified!
    </h2>
    <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">
      The entry fee for team <strong>${data.teamName}</strong> (${data.associationName}) has been authoritatively verified and confirmed for the <strong>BidWar Premier League — Kids Version (Season 1)</strong>.
    </p>

    ${PaymentDetailsCard(paymentData)}

    <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 16px; margin: 18px 0;">
      <h4 style="font-size: 12px; font-weight: 800; color: #10B981; text-transform: uppercase; margin: 0 0 6px 0; font-family: monospace;">
        Slot Authoritatively Secured
      </h4>
      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
        Your team registration is fully confirmed. Official tournament fixtures, team toss schedules, and digital passes will be communicated through your registered mentor and our official channels.
      </p>
    </div>

    ${CTAButton('Join Official Tournament WhatsApp Community', TOURNAMENT_CONFIG.WHATSAPP_LINK)}
  `;

  const subject = `✅ Payment Confirmed | ${data.teamName} | BidWar Premier League`;
  const html = EmailLayout(contentHtml, 'Payment Confirmation');

  return { subject, html };
}

/**
 * 3. Tournament Rules & Important Information Template
 * Subject: "📋 Important Tournament Information | BidWar Premier League — Kids Season 1"
 */
export function renderTournamentRulesEmail(data: RulesEmailTemplateData): { subject: string; html: string } {
  const categoryLabel = data.category === 'class_4_5_6' ? 'Category 1: Class 4–5–6 Division' : 'Category 2: Class 7–8–9 Division';
  const brandingStatus = data.includeBranding ? 'Included' : 'Standard';
  const tournamentDates = TOURNAMENT_CONFIG.TOURNAMENT_DATES;

  const contentHtml = `
    <h2 style="font-size: 18px; color: #ffffff; margin-top: 0; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      Tournament Rules & Important Information
    </h2>
    <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">
      Dear Participants, Mentors, and Parents, please review the official tournament handbook and operational rules for <strong>${data.teamName}</strong> in <strong>BidWar Premier League — Kids Version — Season 1</strong>.
    </p>

    <!-- Team Quick Reference Card -->
    <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr>
          <td style="color: #94a3b8; padding: 4px 0;">Team Name:</td>
          <td style="color: #ffffff; font-weight: bold; text-align: right;">${data.teamName}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 4px 0;">Registration ID:</td>
          <td style="color: #ffffff; font-family: monospace; font-weight: bold; text-align: right;">${data.registrationId}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 4px 0;">Official Team Code:</td>
          <td style="color: #FFB800; font-family: monospace; font-weight: 900; text-align: right;">${data.teamCode}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 4px 0;">Division:</td>
          <td style="color: #38bdf8; font-weight: bold; text-align: right;">${categoryLabel}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 4px 0;">Association:</td>
          <td style="color: #ffffff; text-align: right;">${data.associationName}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 4px 0;">Mentor In-Charge:</td>
          <td style="color: #ffffff; text-align: right;">${data.mentorName}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 4px 0;">Tournament Dates:</td>
          <td style="color: #ffffff; font-weight: bold; text-align: right;">${tournamentDates}</td>
        </tr>
      </table>
    </div>

    <!-- Official Tournament Guidelines (Strictly canonical rules from TOURNAMENT_CONFIG & handbook) -->
    <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <h3 style="font-size: 13px; font-weight: 800; color: #FFB800; text-transform: uppercase; margin: 0 0 12px 0; font-family: monospace;">
        1. Squad & Roster Structure
      </h3>
      <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #cbd5e1; line-height: 1.8;">
        <li>Every squad consists of <strong>EXACTLY 8 PLAYERS</strong>.</li>
        <li><strong>No substitutes</strong> or reserve players are permitted.</li>
        <li>Every team must have <strong>EXACTLY 1 designated Mentor</strong>.</li>
        <li>All players must wear jerseys with unique assigned numbers (1–99).</li>
      </ul>
    </div>

    <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <h3 style="font-size: 13px; font-weight: 800; color: #38BDF8; text-transform: uppercase; margin: 0 0 12px 0; font-family: monospace;">
        2. Official Age & Class Eligibility
      </h3>
      <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #cbd5e1; line-height: 1.8;">
        <li><strong>Category 1 (Class 4–5–6 Division):</strong> Open strictly to students studying in Classes 4th, 5th, and 6th.</li>
        <li><strong>Category 2 (Class 7–8–9 Division):</strong> Open strictly to students studying in Classes 7th, 8th, and 9th.</li>
        <li>All players must carry valid school photo ID or Bonafide certificate for eligibility verification.</li>
      </ul>
    </div>

    <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <h3 style="font-size: 13px; font-weight: 800; color: #10B981; text-transform: uppercase; margin: 0 0 12px 0; font-family: monospace;">
        3. Match Protocol & Tournament Digital Desk
      </h3>
      <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #cbd5e1; line-height: 1.8;">
        <li>The 4-digit Team Code (<strong>${data.teamCode}</strong>) is your team's digital identification key for match tosses and digital scoring.</li>
        <li>Live ball-by-ball tournament scoreboards are hosted on <a href="https://bidwar.in" style="color: #38bdf8; text-decoration: none; font-weight: bold;">Bidwar.in</a>.</li>
        <li>For team reporting time and match coordination, please contact your designated Team Mentor: <strong style="color: #FFB800;">${data.mentorName}</strong>.</li>
      </ul>
    </div>

    ${CTAButton('Join Official Tournament WhatsApp Community', TOURNAMENT_CONFIG.WHATSAPP_LINK)}
  `;

  const subject = `📋 Important Tournament Information | BidWar Premier League — Kids Season 1`;
  const html = EmailLayout(contentHtml, 'Tournament Information & Rules');

  return { subject, html };
}
