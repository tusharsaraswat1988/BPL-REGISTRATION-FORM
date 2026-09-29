import crypto from 'crypto';
import { query } from './index';

export interface DraftPayload {
  currentStep?: number;
  category?: string;
  association?: any;
  mentor?: any;
  teamName?: string;
  includeBranding?: boolean;
  teamTagline?: string;
  players?: any[];
  payment?: any;
}

export interface DraftRecord {
  draftToken: string;
  currentStep: number;
  data: DraftPayload;
  authUserId?: string;
  authUserMobile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnfinishedRegistrationItem {
  id: string;
  draftToken: string;
  authUserId?: string;
  authUserMobile?: string;
  contactMobile: string;
  contactEmail: string;
  currentStep: number;
  stepName: string;
  category: string;
  teamName: string;
  teamTagline: string;
  includeBranding: boolean;
  association: {
    associationName: string;
    branch: string;
    city?: string;
    email: string;
    mobile: string;
    associationLogo?: string;
    associationType?: string;
  };
  mentor: {
    name: string;
    mobile: string;
    secondMobile?: string;
    email?: string;
    photo?: string;
    designation?: string;
  };
  players: any[];
  playersFilledCount: number;
  payment: {
    method?: string;
    gateway?: string;
    transactionReference?: string;
    utrTransactionId?: string;
    paymentProofUrl?: string;
    paymentScreenshot?: string;
  };
  hasEnteredData: boolean;
  createdAt: string;
  updatedAt: string;
}

export function generateSecureDraftToken(): string {
  return `bpl_draft_${crypto.randomBytes(24).toString('hex')}`;
}

export function getStepName(step: number): string {
  switch (step) {
    case 0:
      return 'Step 1: Category & Association';
    case 1:
      return 'Step 2: Mentor Details';
    case 2:
      return 'Step 3: Team Identity & Branding';
    case 3:
      return 'Step 4: Squad (Players)';
    case 4:
      return 'Step 5: Review & Payment';
    default:
      return `Step ${step + 1}`;
  }
}

export async function saveDraft(
  draftToken: string | undefined,
  currentStep: number,
  data: DraftPayload,
  authUserId?: string,
  authUserMobile?: string
): Promise<{ draftToken: string; updatedAt: string }> {
  const token = draftToken && draftToken.startsWith('bpl_draft_')
    ? draftToken
    : generateSecureDraftToken();

  const now = new Date().toISOString();
  const mobileToSave = authUserMobile || data?.association?.mobile || data?.mentor?.mobile || null;

  await query(
    `INSERT INTO drafts (draft_token, current_step, data, auth_user_id, auth_user_mobile, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (draft_token) DO UPDATE
     SET current_step = $2,
         data = $3,
         auth_user_id = COALESCE($4, drafts.auth_user_id),
         auth_user_mobile = COALESCE($5, drafts.auth_user_mobile),
         updated_at = NOW()`,
    [token, currentStep, JSON.stringify(data), authUserId || null, mobileToSave]
  );

  return {
    draftToken: token,
    updatedAt: now,
  };
}

export async function getDraft(
  draftToken: string,
  _authUserId?: string
): Promise<DraftRecord | null> {
  if (!draftToken || !draftToken.trim()) return null;

  const res = await query(
    `SELECT draft_token AS "draftToken", current_step AS "currentStep", data, 
            auth_user_id AS "authUserId", auth_user_mobile AS "authUserMobile",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM drafts
     WHERE draft_token = $1
     LIMIT 1`,
    [draftToken.trim()]
  );

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  return {
    draftToken: row.draftToken,
    currentStep: row.currentStep,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
    authUserId: row.authUserId,
    authUserMobile: row.authUserMobile,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getLatestDraftByAuthUserId(
  authUserId: string
): Promise<DraftRecord | null> {
  if (!authUserId || !authUserId.trim()) return null;

  const res = await query(
    `SELECT draft_token AS "draftToken", current_step AS "currentStep", data, 
            auth_user_id AS "authUserId", auth_user_mobile AS "authUserMobile",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM drafts
     WHERE auth_user_id = $1
     ORDER BY updated_at DESC
     LIMIT 1`,
    [authUserId.trim()]
  );

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  return {
    draftToken: row.draftToken,
    currentStep: row.currentStep,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
    authUserId: row.authUserId,
    authUserMobile: row.authUserMobile,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getAllUnfinishedRegistrations(): Promise<UnfinishedRegistrationItem[]> {
  const res = await query(
    `SELECT d.draft_token AS "draftToken",
            d.current_step AS "currentStep",
            d.data,
            d.auth_user_id AS "authUserId",
            d.auth_user_mobile AS "authUserMobile",
            d.created_at AS "createdAt",
            d.updated_at AS "updatedAt"
     FROM drafts d
     WHERE NOT EXISTS (
       SELECT 1 FROM registrations r
       WHERE d.auth_user_id IS NOT NULL AND r.auth_user_id = d.auth_user_id
     )
     ORDER BY d.updated_at DESC`
  );

  return res.rows.map((row) => {
    const rawData = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
    const assoc = rawData.association || {};
    const mentor = rawData.mentor || {};
    const players = Array.isArray(rawData.players) ? rawData.players : [];
    const payment = rawData.payment || {};

    const playersFilledCount = players.filter(
      (p: any) => p && typeof p.playerName === 'string' && p.playerName.trim().length > 0
    ).length;

    const contactMobile = row.authUserMobile || assoc.mobile || mentor.mobile || (players[0]?.parentMobile) || '';
    const contactEmail = assoc.email || mentor.email || (players[0]?.parentEmail) || '';

    const hasData = Boolean(
      rawData.category ||
      (rawData.teamName && rawData.teamName.trim()) ||
      (assoc.associationName && assoc.associationName.trim()) ||
      (assoc.email && assoc.email.trim()) ||
      (mentor.name && mentor.name.trim()) ||
      (mentor.mobile && mentor.mobile.trim()) ||
      playersFilledCount > 0 ||
      (payment.transactionReference && payment.transactionReference.trim()) ||
      (payment.utrTransactionId && payment.utrTransactionId.trim())
    );

    return {
      id: row.draftToken,
      draftToken: row.draftToken,
      authUserId: row.authUserId || undefined,
      authUserMobile: row.authUserMobile || undefined,
      contactMobile,
      contactEmail,
      currentStep: typeof row.currentStep === 'number' ? row.currentStep : 0,
      stepName: getStepName(typeof row.currentStep === 'number' ? row.currentStep : 0),
      category: rawData.category || '',
      teamName: rawData.teamName || '',
      teamTagline: rawData.teamTagline || '',
      includeBranding: rawData.includeBranding !== false,
      association: {
        associationName: assoc.associationName || '',
        branch: assoc.branch || '',
        city: assoc.city || '',
        email: assoc.email || '',
        mobile: assoc.mobile || '',
        associationLogo: assoc.associationLogo || '',
        associationType: assoc.associationType || 'School',
      },
      mentor: {
        name: mentor.name || '',
        mobile: mentor.mobile || '',
        secondMobile: mentor.secondMobile || '',
        email: mentor.email || '',
        photo: mentor.photo || '',
        designation: mentor.designation || '',
      },
      players,
      playersFilledCount,
      payment: {
        method: payment.method || 'UPI',
        gateway: payment.gateway || 'MANUAL',
        transactionReference: payment.transactionReference || payment.utrTransactionId || '',
        utrTransactionId: payment.utrTransactionId || payment.transactionReference || '',
        paymentProofUrl: payment.paymentProofUrl || payment.paymentScreenshot || '',
        paymentScreenshot: payment.paymentScreenshot || payment.paymentProofUrl || '',
      },
      hasEnteredData: hasData,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });
}

export async function deleteDraft(draftToken: string): Promise<boolean> {
  if (!draftToken) return false;
  const res = await query(`DELETE FROM drafts WHERE draft_token = $1`, [draftToken]);
  return (res.rowCount ?? 0) > 0;
}

