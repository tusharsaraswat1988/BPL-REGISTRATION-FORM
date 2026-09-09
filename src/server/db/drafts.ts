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
  createdAt: string;
  updatedAt: string;
}

export function generateSecureDraftToken(): string {
  return `bpl_draft_${crypto.randomBytes(24).toString('hex')}`;
}

export async function saveDraft(
  draftToken: string | undefined,
  currentStep: number,
  data: DraftPayload,
  authUserId?: string
): Promise<{ draftToken: string; updatedAt: string }> {
  const token = draftToken && draftToken.startsWith('bpl_draft_')
    ? draftToken
    : generateSecureDraftToken();

  const now = new Date().toISOString();

  await query(
    `INSERT INTO drafts (draft_token, current_step, data, auth_user_id, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (draft_token) DO UPDATE
     SET current_step = $2,
         data = $3,
         auth_user_id = COALESCE($4, drafts.auth_user_id),
         updated_at = NOW()`,
    [token, currentStep, JSON.stringify(data), authUserId || null]
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
    `SELECT draft_token AS "draftToken", current_step AS "currentStep", data, auth_user_id AS "authUserId",
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
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getLatestDraftByAuthUserId(
  authUserId: string
): Promise<DraftRecord | null> {
  if (!authUserId || !authUserId.trim()) return null;

  const res = await query(
    `SELECT draft_token AS "draftToken", current_step AS "currentStep", data, auth_user_id AS "authUserId",
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
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function deleteDraft(draftToken: string): Promise<boolean> {
  if (!draftToken) return false;
  const res = await query(`DELETE FROM drafts WHERE draft_token = $1`, [draftToken]);
  return (res.rowCount ?? 0) > 0;
}

