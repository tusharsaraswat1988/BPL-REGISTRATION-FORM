import { TOURNAMENT_CONFIG } from '../../../config/tournamentConfig';

export interface PlayerInfo {
  playerIndex?: number;
  playerName: string;
  studentClass: number;
  jerseyNumber: number;
  jerseySize: string;
  cricketRole: string;
  battingStyle?: string;
  bowlingStyle?: string;
}

export interface TeamCardData {
  teamName: string;
  category: string;
  associationName: string;
  branch: string;
  registrationId: string;
  teamCode: string;
  mentorName: string;
  squadSize: number;
  brandingStatus?: string;
  tournamentDates: string;
  paymentStatus?: string;
}

export interface PaymentCardData {
  paymentStatus: string;
  registrationId: string;
  teamCode: string;
  teamName: string;
  category: string;
  associationName: string;
  paymentAmount: number;
  paymentMethod: string;
  transactionId: string;
  paymentDate?: string;
  brandingStatus: string;
  tournamentDates: string;
}

export interface MentorInfo {
  name: string;
  designation?: string;
  mobile?: string;
  secondMobile?: string;
  email?: string;
}

export function StatusBadge(status: string): string {
  const norm = (status || '').toUpperCase().trim();
  let bg = '#1E293B';
  let color = '#94A3B8';
  let border = '#334155';
  let label = status;

  if (norm === 'VERIFIED' || norm === 'PAID' || norm.includes('VERIFIED')) {
    bg = 'rgba(16, 185, 129, 0.15)';
    color = '#10B981';
    border = 'rgba(16, 185, 129, 0.4)';
    label = 'PAID & VERIFIED';
  } else if (norm === 'PENDING_VERIFICATION' || norm === 'SUBMITTED') {
    bg = 'rgba(56, 189, 248, 0.15)';
    color = '#38BDF8';
    border = 'rgba(56, 189, 248, 0.4)';
    label = 'PENDING COMMITTEE VERIFICATION';
  } else if (norm === 'CONFIRMED') {
    bg = 'rgba(255, 184, 0, 0.15)';
    color = '#FFB800';
    border = 'rgba(255, 184, 0, 0.4)';
    label = 'REGISTRATION CONFIRMED';
  } else if (norm === 'REJECTED' || norm === 'PAYMENT_REJECTED') {
    bg = 'rgba(239, 68, 68, 0.15)';
    color = '#EF4444';
    border = 'rgba(239, 68, 68, 0.4)';
    label = 'REJECTED';
  }

  return `
    <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; background-color: ${bg}; color: ${color}; border: 1px solid ${border}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      ${label}
    </span>
  `;
}

export function EmailHeader(badgeText: string = 'Official Tournament Registration'): string {
  const logoUrl = 'https://bpl.bidwar.in/bpl-logo.jpg';

  return `
    <div style="background-color: #0A1230; padding: 28px 24px; text-align: center; border-bottom: 2px solid #FFB800;">
      <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr>
          <td align="center" style="padding-bottom: 12px;">
            <!-- Official BPL Tournament Logo Asset -->
            <img src="${logoUrl}" alt="BidWar Premier League" width="80" height="80" style="display: block; width: 80px; height: 80px; margin: 0 auto; border-radius: 12px; border: 1px solid #1A2C68; background-color: #070D24; object-fit: contain;" />
          </td>
        </tr>
      </table>
      <span style="font-size: 10px; font-weight: 800; color: #FFB800; text-transform: uppercase; letter-spacing: 2px; font-family: monospace;">${badgeText}</span>
      <h1 style="font-size: 22px; font-weight: 900; margin: 6px 0 2px 0; color: #ffffff; letter-spacing: 1px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">BIDWAR PREMIER LEAGUE</h1>
      <p style="font-size: 12px; color: #94a3b8; margin: 0; font-weight: 600;">Kids Version — Season 1 • ${TOURNAMENT_CONFIG.TOURNAMENT_DATES}</p>
    </div>
  `;
}

export function MentorDetailsCard(mentor: MentorInfo): string {
  return InfoCard('Designated Team Mentor & Coach', `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Mentor / Coach Name:</td>
        <td style="color: #ffffff; font-weight: 700; font-size: 14px; text-align: right; padding: 6px 0;">${mentor.name}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Designation / Role:</td>
        <td style="color: #38bdf8; font-weight: 600; text-align: right; padding: 6px 0;">${mentor.designation || 'Head Cricket Coach'}</td>
      </tr>
    </table>
  `);
}

export function EmailFooter(): string {
  const bidwarUrl = TOURNAMENT_CONFIG.BIDWAR_URL;
  const kvUrl = TOURNAMENT_CONFIG.KV_TECHMEDIA_URL;
  const instagramUrl = TOURNAMENT_CONFIG.BIDWAR_INSTAGRAM_URL;
  const facebookUrl = TOURNAMENT_CONFIG.BIDWAR_FACEBOOK_URL;
  const youtubeUrl = TOURNAMENT_CONFIG.BIDWAR_YOUTUBE_URL;

  return `
    <div style="background-color: #050A1C; padding: 24px 20px; text-align: center; border-top: 1px solid #132252; font-size: 11px; color: #94a3b8; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <p style="margin: 0 0 6px 0; font-size: 12px; color: #cbd5e1;">
        Organised by <strong style="color: #FFB800;">Bidwar.in</strong> & <strong style="color: #38BDF8;">KV TechMedia</strong>
      </p>
      <div style="margin: 12px 0 8px 0;">
        <a href="${bidwarUrl}" style="color: #38bdf8; text-decoration: none; margin: 0 8px; font-weight: 600;">Website</a> •
        <a href="${kvUrl}" style="color: #38bdf8; text-decoration: none; margin: 0 8px; font-weight: 600;">KV TechMedia</a> •
        <a href="${instagramUrl}" style="color: #38bdf8; text-decoration: none; margin: 0 8px; font-weight: 600;">Instagram</a> •
        <a href="${facebookUrl}" style="color: #38bdf8; text-decoration: none; margin: 0 8px; font-weight: 600;">Facebook</a> •
        <a href="${youtubeUrl}" style="color: #38bdf8; text-decoration: none; margin: 0 8px; font-weight: 600;">YouTube</a>
      </div>
      <p style="margin: 8px 0 0 0; font-size: 10px; color: #64748b;">
        © 2026 BidWar Premier League. All rights reserved. Registered participants communication.
      </p>
    </div>
  `;
}

export function InfoCard(title: string, contentHtml: string): string {
  return `
    <div style="background-color: #0A1230; border: 1px solid #1A2C68; border-radius: 12px; padding: 18px; margin: 18px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);">
      ${title ? `<h3 style="font-size: 13px; font-weight: 800; color: #FFB800; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 14px 0; border-bottom: 1px solid #1A2C68; padding-bottom: 8px; font-family: monospace;">${title}</h3>` : ''}
      ${contentHtml}
    </div>
  `;
}

export function TeamDetailsCard(data: TeamCardData): string {
  const categoryLabel = data.category === 'class_4_5_6' ? 'Category 1: Class 4–5–6' : 'Category 2: Class 7–8–9';

  return InfoCard('Official Team Details', `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Team Name:</td>
        <td style="color: #ffffff; font-weight: 700; text-align: right; padding: 6px 0;">${data.teamName}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Official Team Code:</td>
        <td style="color: #FFB800; font-weight: 900; font-family: monospace; font-size: 15px; text-align: right; padding: 6px 0;">${data.teamCode}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Registration ID:</td>
        <td style="color: #ffffff; font-weight: 700; font-family: monospace; text-align: right; padding: 6px 0;">${data.registrationId}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Tournament Division:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${categoryLabel}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Association / School:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${data.associationName} (${data.branch})</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Mentor In-Charge:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${data.mentorName}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Squad Size:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${data.squadSize} Players (No Substitutes)</td>
      </tr>
      ${data.brandingStatus ? `
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Custom Branding Package:</td>
        <td style="color: ${data.brandingStatus === 'Included' ? '#FFB800' : '#94a3b8'}; font-weight: 700; text-align: right; padding: 6px 0;">${data.brandingStatus}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Tournament Dates:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${data.tournamentDates}</td>
      </tr>
      ${data.paymentStatus ? `
      <tr>
        <td style="color: #94a3b8; padding: 8px 0 2px 0; border-top: 1px dashed #1A2C68;">Payment Status:</td>
        <td style="text-align: right; padding: 8px 0 2px 0; border-top: 1px dashed #1A2C68;">${StatusBadge(data.paymentStatus)}</td>
      </tr>
      ` : ''}
    </table>
  `);
}

export function PaymentDetailsCard(data: PaymentCardData): string {
  const categoryLabel = data.category === 'class_4_5_6' ? 'Category 1: Class 4–5–6' : 'Category 2: Class 7–8–9';

  return InfoCard('Authoritative Payment Confirmation', `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Payment Status:</td>
        <td style="text-align: right; padding: 6px 0;">${StatusBadge('PAID & VERIFIED')}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Registration ID:</td>
        <td style="color: #ffffff; font-weight: 700; font-family: monospace; text-align: right; padding: 6px 0;">${data.registrationId}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Official Team Code:</td>
        <td style="color: #FFB800; font-weight: 900; font-family: monospace; font-size: 15px; text-align: right; padding: 6px 0;">${data.teamCode}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Team Name:</td>
        <td style="color: #ffffff; font-weight: 700; text-align: right; padding: 6px 0;">${data.teamName}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Category:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${categoryLabel}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Association:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${data.associationName}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Payment Amount:</td>
        <td style="color: #FFB800; font-weight: 900; font-family: monospace; font-size: 16px; text-align: right; padding: 6px 0;">₹${data.paymentAmount.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Payment Method:</td>
        <td style="color: #38bdf8; font-weight: 700; text-align: right; padding: 6px 0;">${data.paymentMethod}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Transaction / Payment ID:</td>
        <td style="color: #ffffff; font-weight: 700; font-family: monospace; text-align: right; padding: 6px 0;">${data.transactionId}</td>
      </tr>
      ${data.paymentDate ? `
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Payment Date:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${data.paymentDate}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Branding Status:</td>
        <td style="color: ${data.brandingStatus === 'Included' ? '#FFB800' : '#94a3b8'}; font-weight: 700; text-align: right; padding: 6px 0;">${data.brandingStatus}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Tournament Dates:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${data.tournamentDates}</td>
      </tr>
    </table>
  `);
}

export function PlayerTable(players: PlayerInfo[]): string {
  const rowsHtml = players.map((p, index) => {
    const idx = p.playerIndex ?? (index + 1);
    return `
      <tr style="border-bottom: 1px solid #1A2C68; background-color: ${index % 2 === 0 ? '#0A1230' : '#070D24'};">
        <td style="padding: 10px 8px; color: #FFB800; font-weight: 800; font-family: monospace; font-size: 12px; text-align: center;">#${idx}</td>
        <td style="padding: 10px 8px; color: #ffffff; font-weight: 700; font-size: 13px;">${p.playerName}</td>
        <td style="padding: 10px 8px; color: #cbd5e1; font-size: 12px; text-align: center;">Class ${p.studentClass}</td>
        <td style="padding: 10px 8px; color: #38bdf8; font-weight: 800; font-family: monospace; font-size: 13px; text-align: center;">${p.jerseyNumber ? `#${p.jerseyNumber}` : '-'}</td>
        <td style="padding: 10px 8px; color: #cbd5e1; font-size: 12px; text-align: center;">${p.jerseySize || '-'}</td>
        <td style="padding: 10px 8px; color: #94a3b8; font-size: 12px;">${p.cricketRole}</td>
      </tr>
    `;
  }).join('');

  return InfoCard('Official 8-Player Registered Squad', `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <thead>
          <tr style="background-color: #070D24; border-bottom: 2px solid #FFB800; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
            <th style="padding: 8px 6px; text-align: center;">#</th>
            <th style="padding: 8px 6px;">Player Name</th>
            <th style="padding: 8px 6px; text-align: center;">Class</th>
            <th style="padding: 8px 6px; text-align: center;">Jersey #</th>
            <th style="padding: 8px 6px; text-align: center;">Size</th>
            <th style="padding: 8px 6px;">Role</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `);
}

export function ParentChildCard(player: PlayerInfo): string {
  return InfoCard('Your Child’s Registered Player Profile', `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Player Name:</td>
        <td style="color: #ffffff; font-weight: 700; font-size: 15px; text-align: right; padding: 6px 0;">${player.playerName}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Enrolled Class:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">Class ${player.studentClass}</td>
      </tr>
      ${player.jerseyNumber ? `
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Official Jersey Number:</td>
        <td style="color: #FFB800; font-weight: 900; font-family: monospace; font-size: 16px; text-align: right; padding: 6px 0;">#${player.jerseyNumber}</td>
      </tr>
      ` : ''}
      ${player.jerseySize ? `
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Jersey Size:</td>
        <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 6px 0;">${player.jerseySize}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Cricket Role:</td>
        <td style="color: #38bdf8; font-weight: 700; text-align: right; padding: 6px 0;">${player.cricketRole}</td>
      </tr>
      ${player.battingStyle ? `
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Batting Style:</td>
        <td style="color: #cbd5e1; font-weight: 500; text-align: right; padding: 6px 0;">${player.battingStyle}</td>
      </tr>
      ` : ''}
      ${player.bowlingStyle ? `
      <tr>
        <td style="color: #94a3b8; padding: 6px 0;">Bowling Style:</td>
        <td style="color: #cbd5e1; font-weight: 500; text-align: right; padding: 6px 0;">${player.bowlingStyle}</td>
      </tr>
      ` : ''}
    </table>
  `);
}

export function CTAButton(label: string, url: string, bgColor: string = '#10B981', textColor: string = '#022C22'): string {
  return `
    <div style="margin: 24px 0; text-align: center;">
      <a href="${url}" style="display: inline-block; background-color: ${bgColor}; color: ${textColor}; font-weight: 800; font-size: 13px; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: 0.5px;">
        ${label}
      </a>
    </div>
  `;
}

export function EmailLayout(contentHtml: string, badgeText: string = 'Official Tournament Communication'): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BidWar Premier League — Kids Version</title>
  <style>
    body { margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .content-padding { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #030712; color: #f8fafc; -webkit-font-smoothing: antialiased;">
  <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #070D24; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1A2C68; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
    ${EmailHeader(badgeText)}
    <div class="content-padding" style="padding: 28px 24px;">
      ${contentHtml}
    </div>
    ${EmailFooter()}
  </div>
</body>
</html>
  `;
}
