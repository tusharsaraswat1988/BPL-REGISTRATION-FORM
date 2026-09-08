import { PoolClient } from 'pg';
import crypto from 'crypto';
import { query, withTransaction, getPool } from './index';
import { config } from '../config/env';

export interface PublicTeamDTO {
  teamName: string;
  associationName: string;
  associationLogo: string;
  category: string;
}

export interface PlayerInput {
  playerName: string;
  studentClass: number;
  dateOfBirth: string;
  parentMobile: string;
  parentEmail: string;
  playerPhoto: string;
  jerseyNumber: number;
  jerseySize: string;
  cricketRole: string;
  battingStyle?: string;
  bowlingStyle?: string;
}

export interface AssociationInput {
  associationName: string;
  branch: string;
  email: string;
  mobile: string;
  associationLogo: string;
  associationType?: string;
  city?: string;
}

export interface MentorInput {
  name: string;
  mobile: string;
  secondMobile?: string;
  email: string;
  photo: string;
  designation?: string;
}

export interface PaymentInput {
  utrTransactionId?: string;
  paymentScreenshot?: string;
  method?: string;
  gateway?: 'CASHFREE' | 'MANUAL';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewayRawResponse?: any;
  paymentStatus?: string;
}

export interface RegistrationSubmissionInput {
  category: 'class_4_5_6' | 'class_7_8_9';
  teamName: string;
  includeBranding: boolean;
  teamTagline?: string;
  teamShortCode?: string;
  association: AssociationInput;
  mentor: MentorInput;
  players: PlayerInput[];
  payment: PaymentInput;
  notes?: string;
  idempotencyKey?: string;
  draftToken?: string;
  authUserId?: string;
}

export interface RegistrationFullRecord {
  id: string;
  teamCode: string;
  createdAt: string;
  status: string;
  category: string;
  teamName: string;
  includeBranding: boolean;
  branding: {
    teamName: string;
    includeBranding: boolean;
    teamTagline?: string;
    teamShortCode?: string;
  };
  association: AssociationInput;
  mentor: MentorInput;
  players: PlayerInput[];
  payment: {
    utrTransactionId: string;
    paymentScreenshot: string;
    method: string;
    gateway?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    baseAmount: number;
    brandingAmount: number;
    totalAmount: number;
    paymentStatus: string;
    paidAt: string;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
  };
}

/**
 * Check authoritative server registration window
 */
export function isRegistrationWindowOpen(): { open: boolean; reason?: string } {
  const { start, end, enabled } = config.registrationWindow;
  if (!enabled) {
    return { open: false, reason: 'Registration is currently disabled by tournament administration.' };
  }

  const now = new Date();
  const startTime = new Date(start);
  const endTime = new Date(end);

  if (now < startTime) {
    return { open: false, reason: `Registration opens on 8 September 2026 at 00:00 IST.` };
  }

  if (now > endTime) {
    return { open: false, reason: `Registration closed on 15 October 2026 at 23:59:59 IST.` };
  }

  return { open: true };
}

/**
 * Concurrency-safe Registration ID generator backed by PostgreSQL
 */
export async function generateNextRegistrationId(client: PoolClient): Promise<string> {
  const currentYear = 2026;
  const res = await client.query(
    `UPDATE registration_sequence
     SET last_number = last_number + 1
     WHERE year = $1
     RETURNING last_number`,
    [currentYear]
  );

  let nextNum = 1;
  if (res.rows.length > 0) {
    nextNum = res.rows[0].last_number;
  } else {
    await client.query(
      `INSERT INTO registration_sequence (year, last_number) VALUES ($1, 1)`,
      [currentYear]
    );
    nextNum = 1;
  }

  const padded = String(nextNum).padStart(4, '0');
  return `BPL-${currentYear}-${padded}`;
}

/**
 * Concurrency-safe, cryptographically random 4-digit Team Code generator (1000-9999)
 */
export async function generateUnique4DigitTeamCode(client: PoolClient): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt++) {
    // Generate random integer between 1000 and 9999 using crypto
    const num = crypto.randomInt(1000, 10000);
    const code = String(num);

    const check = await client.query(
      `SELECT 1 FROM registrations WHERE team_code = $1 LIMIT 1`,
      [code]
    );

    if (check.rows.length === 0) {
      return code;
    }
  }

  throw new Error('Could not generate unique 4-digit Team Code. Collision pool exhausted.');
}

/**
 * Normalize UTR / Transaction ID
 */
export function normalizeUtr(utr: string): string {
  return utr.trim().toUpperCase().replace(/\s+/g, '');
}

/**
 * Validate full registration submission payload according to tournament rules
 */
export function validateRegistrationPayload(input: RegistrationSubmissionInput): { valid: boolean; error?: string } {
  // Category check
  if (input.category !== 'class_4_5_6' && input.category !== 'class_7_8_9') {
    return { valid: false, error: 'Category must be strictly class_4_5_6 or class_7_8_9.' };
  }

  const allowedClasses = input.category === 'class_4_5_6' ? [4, 5, 6] : [7, 8, 9];

  // Association check
  if (!input.association) {
    return { valid: false, error: 'Association details are required.' };
  }
  const { associationName, branch, email: assocEmail, mobile: assocMobile, associationLogo } = input.association;
  if (!associationName?.trim() || !branch?.trim() || !assocEmail?.trim() || !assocMobile?.trim() || !associationLogo?.trim()) {
    return { valid: false, error: 'Association Name, Branch, Email, Mobile, and Logo are all required.' };
  }

  // Mentor check
  if (!input.mentor) {
    return { valid: false, error: 'Mentor details are required.' };
  }
  const { name: mentorName, mobile: mentorMobile, email: mentorEmail, photo: mentorPhoto } = input.mentor;
  if (!mentorName?.trim() || !mentorMobile?.trim() || !mentorEmail?.trim() || !mentorPhoto?.trim()) {
    return { valid: false, error: 'Mentor Name, Mobile, Email, and Photo are all required.' };
  }

  // Team name check
  if (!input.teamName?.trim()) {
    return { valid: false, error: 'Team Name is required.' };
  }

  // Exact 8 players check
  if (!Array.isArray(input.players) || input.players.length !== 8) {
    return {
      valid: false,
      error: `Squad must contain EXACTLY 8 players with no substitutes. Received: ${Array.isArray(input.players) ? input.players.length : 0} players.`
    };
  }

  const usedJerseyNumbers = new Set<number>();
  const validRoles = ['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper'];
  const validBattingStyles = ['Right Hand', 'Left Hand'];
  const validBowlingStyles = [
    'Right Arm Fast',
    'Right Arm Medium',
    'Right Arm Spin',
    'Left Arm Fast',
    'Left Arm Medium',
    'Left Arm Spin'
  ];

  for (let i = 0; i < input.players.length; i++) {
    const p = input.players[i];
    const playerNum = i + 1;

    if (!p.playerName?.trim()) {
      return { valid: false, error: `Player #${playerNum}: Player Name is required.` };
    }

    const studentClass = Number(p.studentClass);
    if (!allowedClasses.includes(studentClass)) {
      return {
        valid: false,
        error: `Player #${playerNum} (${p.playerName}): Class must be in ${allowedClasses.join(', ')} for category ${input.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9'}.`
      };
    }

    if (!p.dateOfBirth?.trim()) {
      return { valid: false, error: `Player #${playerNum}: Date of Birth is required.` };
    }
    if (!p.parentMobile?.trim()) {
      return { valid: false, error: `Player #${playerNum}: Parent Mobile is required.` };
    }
    if (!p.parentEmail?.trim()) {
      return { valid: false, error: `Player #${playerNum}: Parent Email is required.` };
    }
    if (!p.playerPhoto?.trim()) {
      return { valid: false, error: `Player #${playerNum}: Player Photo is required.` };
    }

    const jNum = Number(p.jerseyNumber);
    if (!jNum || jNum < 1 || jNum > 99) {
      return { valid: false, error: `Player #${playerNum}: Jersey number must be between 1 and 99.` };
    }

    if (usedJerseyNumbers.has(jNum)) {
      return { valid: false, error: `Jersey Number #${jNum} is assigned to multiple players on this team. Jersey numbers must be unique.` };
    }
    usedJerseyNumbers.add(jNum);

    if (!p.jerseySize?.trim()) {
      return { valid: false, error: `Player #${playerNum}: Jersey size is required.` };
    }

    if (!validRoles.includes(p.cricketRole)) {
      return { valid: false, error: `Player #${playerNum}: Invalid cricket role '${p.cricketRole}'.` };
    }

    if ((p.cricketRole === 'Batsman' || p.cricketRole === 'All Rounder' || p.cricketRole === 'Wicket Keeper') && !p.battingStyle) {
      return { valid: false, error: `Player #${playerNum}: Batting style is required for ${p.cricketRole}.` };
    }

    if ((p.cricketRole === 'Bowler' || p.cricketRole === 'All Rounder') && !p.bowlingStyle) {
      return { valid: false, error: `Player #${playerNum}: Bowling style is required for ${p.cricketRole}.` };
    }
  }

  // Payment check
  if (!input.payment) {
    return { valid: false, error: 'Payment details are required.' };
  }

  const isCashfree = input.payment.gateway === 'CASHFREE' || input.payment.method === 'CASHFREE';
  const rawRef = input.payment.gatewayPaymentId || input.payment.utrTransactionId || input.payment.gatewayOrderId || '';
  const utr = normalizeUtr(rawRef);

  if (!utr) {
    return { valid: false, error: isCashfree ? 'Cashfree payment reference is required.' : 'Payment UTR / Transaction Reference number is required.' };
  }

  if (!isCashfree && !input.payment.paymentScreenshot?.trim()) {
    return { valid: false, error: 'Payment screenshot proof is required.' };
  }

  return { valid: true };
}

/**
 * Submit Final Registration Atomically via PostgreSQL Transaction
 */
export async function createRegistrationTransaction(
  input: RegistrationSubmissionInput
): Promise<RegistrationFullRecord> {
  // 1. Check window
  const windowCheck = isRegistrationWindowOpen();
  if (!windowCheck.open) {
    throw new Error(windowCheck.reason || 'Registration window is closed.');
  }

  // 2. Validate payload
  const validation = validateRegistrationPayload(input);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid registration payload.');
  }

  const isCashfree = input.payment.gateway === 'CASHFREE' || input.payment.method === 'CASHFREE';

  // 3. Execute atomic transaction
  return withTransaction(async (client) => {
    // A. Check idempotency if provided
    if (input.idempotencyKey) {
      const existingIdempotent = await client.query(
        `SELECT id FROM registrations WHERE idempotency_key = $1 LIMIT 1`,
        [input.idempotencyKey]
      );
      if (existingIdempotent.rows.length > 0) {
        const full = await getRegistrationById(existingIdempotent.rows[0].id, client);
        if (full) return full;
      }
    }

    // B. Calculate authoritative fee
    const hasBranding = Boolean(input.includeBranding);
    const baseAmount = config.fees.baseRegistrationFee; // ₹8,000
    const brandingAmount = hasBranding ? config.fees.brandingAddonFee : 0; // ₹5,000 or ₹0
    const totalAmount = baseAmount + brandingAmount; // ₹13,000 or ₹8,000

    let normalizedUtr = '';
    let gatewayOrderId: string | null = null;
    let gatewayPaymentId: string | null = null;
    let paymentStatus = 'PENDING_VERIFICATION';
    let verifiedBy: string | null = null;
    let paymentScreenshot = '';
    let gateway = 'MANUAL';
    let rawResponse: string | null = null;

    if (isCashfree) {
      const orderIdToLookup = input.payment.gatewayOrderId || input.payment.utrTransactionId;
      if (!orderIdToLookup) {
        throw new Error('Cashfree registration requires a valid Cashfree order ID.');
      }

      // 1. Authoritative DB Lookup against internal payment_intents table
      const intentRes = await client.query(
        `SELECT * FROM payment_intents WHERE order_id = $1 LIMIT 1`,
        [orderIdToLookup.trim()]
      );

      if (intentRes.rows.length === 0) {
        throw new Error('Invalid or unrecognized Cashfree order ID. Payment intent does not exist.');
      }

      const intent = intentRes.rows[0];

      // 2. Authoritatively verify payment intent is PAID
      if (intent.status !== 'PAID') {
        throw new Error('Cashfree payment is not verified. Please complete payment before submitting.');
      }

      // 3. Verify exact amount match
      if (intent.amount !== totalAmount) {
        throw new Error(`Payment amount mismatch: expected ₹${totalAmount}, but paid ₹${intent.amount}.`);
      }

      // 4. Verify session/draft binding if draftToken supplied
      if (input.draftToken && intent.draft_token && intent.draft_token !== input.draftToken) {
        throw new Error('This Cashfree payment belongs to a different registration session.');
      }

      // 5. Check duplicate gateway_order_id usage
      const usedOrderCheck = await client.query(
        `SELECT 1 FROM payments WHERE gateway_order_id = $1 LIMIT 1`,
        [intent.order_id]
      );
      if (usedOrderCheck.rows.length > 0) {
        throw new Error(`This Cashfree order '${intent.order_id}' has already been used for another registration.`);
      }

      gatewayOrderId = intent.order_id;
      gatewayPaymentId = intent.cf_payment_id || intent.bank_reference || intent.order_id;
      normalizedUtr = normalizeUtr(gatewayPaymentId);
      paymentStatus = 'VERIFIED';
      verifiedBy = 'CASHFREE_GATEWAY';
      gateway = 'CASHFREE';
      paymentScreenshot = 'CASHFREE_GATEWAY_VERIFIED';
      rawResponse = intent.raw_response ? JSON.stringify(intent.raw_response) : null;
    } else {
      // Manual payment path (UPI QR / Bank Transfer / Cheque)
      const rawRef = input.payment.utrTransactionId || '';
      normalizedUtr = normalizeUtr(rawRef);
      if (!normalizedUtr) {
        throw new Error('Payment UTR / Transaction Reference number is required.');
      }
      if (!input.payment.paymentScreenshot?.trim()) {
        throw new Error('Payment screenshot proof is required for manual payment verification.');
      }
      paymentScreenshot = input.payment.paymentScreenshot.trim();
      paymentStatus = 'PENDING_VERIFICATION';
      verifiedBy = null;
      gateway = 'MANUAL';
    }

    // Check UTR / Payment Reference Uniqueness
    const utrCheck = await client.query(
      `SELECT 1 FROM payments WHERE utr_transaction_id = $1 LIMIT 1`,
      [normalizedUtr]
    );
    if (utrCheck.rows.length > 0) {
      throw new Error(`This payment transaction reference '${normalizedUtr}' has already been submitted for another registration.`);
    }

    // D. Generate server-side identifiers
    const registrationId = await generateNextRegistrationId(client);
    const teamCode = await generateUnique4DigitTeamCode(client);

    // E. Insert Master Registration Record
    await client.query(
      `INSERT INTO registrations (
        id, team_code, category, team_name, include_branding, team_tagline, team_short_code,
        status, auth_user_id, idempotency_key, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'SUBMITTED', $8, $9, $10)`,
      [
        registrationId,
        teamCode,
        input.category,
        input.teamName.trim(),
        hasBranding,
        input.teamTagline?.trim() || null,
        input.teamShortCode?.trim() || 'BPL',
        input.authUserId || null,
        input.idempotencyKey || null,
        input.notes?.trim() || null,
      ]
    );

    // F. Insert Association Record
    await client.query(
      `INSERT INTO associations (
        registration_id, association_name, branch, email, mobile, association_logo, association_type, city
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        registrationId,
        input.association.associationName.trim(),
        input.association.branch.trim(),
        input.association.email.trim().toLowerCase(),
        input.association.mobile.trim(),
        input.association.associationLogo.trim(),
        input.association.associationType || 'School',
        input.association.city?.trim() || null,
      ]
    );

    // G. Insert Mentor Record
    await client.query(
      `INSERT INTO mentors (
        registration_id, name, mobile, second_mobile, email, photo, designation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        registrationId,
        input.mentor.name.trim(),
        input.mentor.mobile.trim(),
        input.mentor.secondMobile?.trim() || null,
        input.mentor.email.trim().toLowerCase(),
        input.mentor.photo.trim(),
        input.mentor.designation?.trim() || 'Head Coach',
      ]
    );

    // H. Insert 8 Players
    for (let i = 0; i < input.players.length; i++) {
      const p = input.players[i];
      await client.query(
        `INSERT INTO players (
          registration_id, player_index, player_name, student_class, date_of_birth,
          parent_mobile, parent_email, player_photo, jersey_number, jersey_size,
          cricket_role, batting_style, bowling_style
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          registrationId,
          i + 1,
          p.playerName.trim(),
          Number(p.studentClass),
          p.dateOfBirth.trim(),
          p.parentMobile.trim(),
          p.parentEmail.trim().toLowerCase(),
          p.playerPhoto.trim(),
          Number(p.jerseyNumber),
          p.jerseySize.trim(),
          p.cricketRole.trim(),
          p.battingStyle || null,
          p.bowlingStyle || null,
        ]
      );
    }

    // I. Insert Payment Record
    await client.query(
      `INSERT INTO payments (
        registration_id, utr_transaction_id, payment_screenshot, method, gateway,
        gateway_order_id, gateway_payment_id, gateway_raw_response,
        base_amount, branding_amount, total_amount, payment_status, verified_at, verified_by, confirmation_email_sent_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CASE WHEN $12 = 'VERIFIED' THEN NOW() ELSE NULL END, $13, CASE WHEN $12 = 'VERIFIED' THEN NOW() ELSE NULL END)`,
      [
        registrationId,
        normalizedUtr,
        paymentScreenshot,
        input.payment.method || (isCashfree ? 'CASHFREE' : 'UPI'),
        gateway,
        gatewayOrderId,
        gatewayPaymentId,
        rawResponse,
        baseAmount,
        brandingAmount,
        totalAmount,
        paymentStatus,
        verifiedBy,
      ]
    );

    // J. If there was an associated draft, remove it now that submission succeeded
    if (input.draftToken) {
      await client.query(`DELETE FROM drafts WHERE draft_token = $1`, [input.draftToken]);
    }

    const fullRecord = await getRegistrationById(registrationId, client);
    if (!fullRecord) {
      throw new Error('Registration created but failed to load from database.');
    }

    return fullRecord;
  });
}

/**
 * Public Registered Teams View - STRICT PRIVACY
 * Returns ONLY 4 fields: teamName, associationName, associationLogo, category
 */
export async function getPublicRegisteredTeams(): Promise<PublicTeamDTO[]> {
  const sql = `
    SELECT 
      r.team_name AS "teamName",
      a.association_name AS "associationName",
      a.association_logo AS "associationLogo",
      CASE 
        WHEN r.category = 'class_4_5_6' THEN 'Class 4–5–6'
        ELSE 'Class 7–8–9'
      END AS "category"
    FROM registrations r
    JOIN associations a ON r.id = a.registration_id
    ORDER BY r.created_at ASC
  `;

  const result = await query<PublicTeamDTO>(sql);
  return result.rows;
}

/**
 * Retrieve Full Registration Record (Internal / Authenticated)
 */
export async function getRegistrationById(
  registrationId: string,
  client?: PoolClient | null
): Promise<RegistrationFullRecord | null> {
  const queryFn = (text: string, params?: any[]) => {
    return client ? client.query(text, params) : query(text, params);
  };

  const regRes = await queryFn(
    `SELECT * FROM registrations WHERE id = $1 LIMIT 1`,
    [registrationId]
  );
  if (regRes.rows.length === 0) return null;
  const reg = regRes.rows[0];

  const assocRes = await queryFn(
    `SELECT * FROM associations WHERE registration_id = $1 LIMIT 1`,
    [registrationId]
  );
  const assoc = assocRes.rows[0] || {};

  const mentorRes = await queryFn(
    `SELECT * FROM mentors WHERE registration_id = $1 LIMIT 1`,
    [registrationId]
  );
  const mentor = mentorRes.rows[0] || {};

  const playersRes = await queryFn(
    `SELECT * FROM players WHERE registration_id = $1 ORDER BY player_index ASC`,
    [registrationId]
  );

  const paymentRes = await queryFn(
    `SELECT * FROM payments WHERE registration_id = $1 LIMIT 1`,
    [registrationId]
  );
  const payment = paymentRes.rows[0] || {};

  return {
    id: reg.id,
    teamCode: reg.team_code,
    createdAt: reg.created_at,
    status: reg.status,
    category: reg.category,
    teamName: reg.team_name,
    includeBranding: reg.include_branding,
    branding: {
      teamName: reg.team_name,
      includeBranding: reg.include_branding,
      teamTagline: reg.team_tagline || '',
      teamShortCode: reg.team_short_code || 'BPL',
    },
    association: {
      associationName: assoc.association_name,
      branch: assoc.branch,
      email: assoc.email,
      mobile: assoc.mobile,
      associationLogo: assoc.association_logo,
      associationType: assoc.association_type,
      city: assoc.city,
    },
    mentor: {
      name: mentor.name,
      mobile: mentor.mobile,
      secondMobile: mentor.second_mobile,
      email: mentor.email,
      photo: mentor.photo,
      designation: mentor.designation,
    },
    players: playersRes.rows.map((p: any) => ({
      playerName: p.player_name,
      studentClass: p.student_class,
      dateOfBirth: p.date_of_birth instanceof Date ? p.date_of_birth.toISOString().split('T')[0] : p.date_of_birth,
      parentMobile: p.parent_mobile,
      parentEmail: p.parent_email,
      playerPhoto: p.player_photo,
      jerseyNumber: p.jersey_number,
      jerseySize: p.jersey_size,
      cricketRole: p.cricket_role,
      battingStyle: p.batting_style,
      bowlingStyle: p.bowling_style,
    })),
    payment: {
      utrTransactionId: payment.utr_transaction_id,
      paymentScreenshot: payment.payment_screenshot,
      method: payment.method,
      gateway: payment.gateway,
      gatewayOrderId: payment.gateway_order_id,
      gatewayPaymentId: payment.gateway_payment_id,
      baseAmount: payment.base_amount,
      brandingAmount: payment.branding_amount,
      totalAmount: payment.total_amount,
      paymentStatus: payment.payment_status,
      paidAt: payment.paid_at,
      verifiedBy: payment.verified_by,
      verifiedAt: payment.verified_at,
    },
  };
}

/**
 * Admin Payment Verification Operation
 */
export async function verifyPaymentByAdmin(
  registrationId: string,
  verifiedBy: string
): Promise<boolean> {
  const res = await query(
    `UPDATE payments
     SET payment_status = 'VERIFIED',
         verified_at = NOW(),
         verified_by = $1
     WHERE registration_id = $2
     RETURNING 1`,
    [verifiedBy, registrationId]
  );

  return res.rows.length > 0;
}
