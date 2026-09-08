import crypto from 'crypto';
import { AuthProvider, AuthIdentity, OtpRequestResult, OtpVerifyResult } from './authProvider';
import { config } from '../../config/env';
import { query } from '../../db/index';

const F2S_BASE = 'https://www.fast2sms.com/dev';

function normaliseMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.slice(-10);
}

type F2SResponse = {
  return?: boolean | string | number;
  status_code?: number;
  message?: string | string[];
  request_id?: string;
};

function f2sError(data: F2SResponse): string {
  if (!data.message) return 'Unknown OTP provider error';
  return Array.isArray(data.message) ? data.message.join(', ') : data.message;
}

function f2sSuccess(res: Response, data: F2SResponse): boolean {
  if (data.return === true || data.return === 'true' || data.return === 1) return true;
  if (data.status_code === 200) return true;
  const msg = f2sError(data).toLowerCase();
  if (res.ok && (msg.includes('otp sent') || msg.includes('success'))) return true;
  return res.ok && !!data.return;
}

async function f2sPost(path: string, body: Record<string, unknown>): Promise<{ ok: boolean; data: F2SResponse }> {
  const key = config.otp.bulkSmsKey;
  if (!key) {
    return { ok: false, data: { message: 'Fast2SMS BULKSMS_KEY is not configured on this server.' } };
  }

  try {
    const res = await fetch(`${F2S_BASE}${path}`, {
      method: 'POST',
      headers: {
        authorization: key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });

    const rawText = await res.text().catch(() => '');
    let data: F2SResponse = {};
    try {
      data = JSON.parse(rawText) as F2SResponse;
    } catch {
      /* non-JSON response */
    }

    const ok = f2sSuccess(res, data);
    return { ok, data };
  } catch (err) {
    return { ok: false, data: { message: 'OTP service connection error. Please try again.' } };
  }
}

/**
 * BidWar Core Fast2SMS OTP Authentication Provider Adapter
 */
export class BidWarOtpAuthProvider implements AuthProvider {
  readonly name = 'BidWarOtpAuthProvider';

  get isConfigured(): boolean {
    return Boolean(config.otp.bulkSmsKey && config.otp.bulkSmsTemplateId);
  }

  async requestOtp(mobile: string, purpose = 'bpl_registration'): Promise<OtpRequestResult> {
    const mobile10 = normaliseMobile(mobile);
    if (!mobile10 || mobile10.length !== 10) {
      return { success: false, message: 'Please provide a valid 10-digit Indian mobile number.' };
    }

    if (!this.isConfigured) {
      return {
        success: false,
        message: 'BidWar Fast2SMS OTP credentials (BULKSMS_KEY / BULKSMS_TEMPLATE_ID) are pending configuration.',
      };
    }

    const templateId = config.otp.bulkSmsTemplateId;
    const { ok, data } = await f2sPost('/otp/send', {
      mobile: mobile10,
      otp_id: templateId,
      otp_expiry: 15,
      otp_length: 6,
    });

    if (!ok) {
      return { success: false, message: f2sError(data) };
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    try {
      await query(
        `INSERT INTO otp_sessions (mobile, purpose, expires_at) VALUES ($1, $2, $3)`,
        [`91${mobile10}`, purpose, expiresAt]
      );
    } catch (err: any) {
      console.warn('[OTP DB Log]', err.message);
    }

    return {
      success: true,
      message: 'OTP sent successfully to your mobile number.',
      expiresInSeconds: 900,
    };
  }

  async verifyOtp(mobile: string, otp: string, purpose = 'bpl_registration'): Promise<OtpVerifyResult> {
    const mobile10 = normaliseMobile(mobile);
    if (!mobile10 || mobile10.length !== 10) {
      return { success: false, message: 'Please provide a valid 10-digit mobile number.' };
    }

    if (!otp || otp.trim().length !== 6) {
      return { success: false, message: 'Please enter a valid 6-digit OTP.' };
    }

    if (!this.isConfigured) {
      return {
        success: false,
        message: 'BidWar Fast2SMS OTP credentials are not configured on this server.',
      };
    }

    const { ok, data } = await f2sPost('/otp/verify', {
      mobile: mobile10,
      otp: otp.trim(),
    });

    if (!ok) {
      return { success: false, message: f2sError(data) || 'Invalid or expired OTP.' };
    }

    // Mark active session as used in DB
    try {
      await query(
        `UPDATE otp_sessions
         SET used = true
         WHERE id = (
           SELECT id FROM otp_sessions
           WHERE mobile = $1 AND used = false AND expires_at > NOW()
           ORDER BY created_at DESC
           LIMIT 1
         )`,
        [`91${mobile10}`]
      );
    } catch (err: any) {
      console.warn('[OTP DB Verify Log]', err.message);
    }

    const userId = `bidwar_user_${crypto.createHash('sha256').update(`91${mobile10}`).digest('hex').substring(0, 16)}`;
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + 7 * 24 * 60 * 60; // 7 days matching BidWar standard

    const payload = {
      userId,
      mobile: `+91${mobile10}`,
      provider: 'bidwar_otp' as const,
      iat: nowSec,
      exp: expSec,
    };

    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', config.sessionSecret).update(payloadB64).digest('base64url');
    const sessionToken = `bpl_jwt_${payloadB64}.${signature}`;

    const identity: AuthIdentity = {
      userId,
      mobile: `+91${mobile10}`,
      provider: 'bidwar_otp',
      sessionToken,
      authenticatedAt: new Date(nowSec * 1000).toISOString(),
    };

    return {
      success: true,
      message: 'OTP verified successfully.',
      identity,
      token: sessionToken,
    };
  }

  async verifySessionToken(token: string): Promise<AuthIdentity | null> {
    if (!token || !token.startsWith('bpl_jwt_')) {
      return null;
    }

    try {
      const raw = token.slice('bpl_jwt_'.length);
      const dotIndex = raw.indexOf('.');
      if (dotIndex === -1) return null;

      const payloadB64 = raw.substring(0, dotIndex);
      const signature = raw.substring(dotIndex + 1);

      const expectedSig = crypto.createHmac('sha256', config.sessionSecret).update(payloadB64).digest('base64url');

      if (signature.length !== expectedSig.length) return null;
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expectedSig);
      if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      const nowSec = Math.floor(Date.now() / 1000);

      if (!payload.exp || payload.exp < nowSec) {
        return null;
      }

      return {
        userId: payload.userId,
        mobile: payload.mobile,
        provider: 'bidwar_otp',
        sessionToken: token,
        authenticatedAt: new Date((payload.iat || nowSec) * 1000).toISOString(),
      };
    } catch {
      return null;
    }
  }

  async logout(_token: string): Promise<boolean> {
    return true;
  }
}
