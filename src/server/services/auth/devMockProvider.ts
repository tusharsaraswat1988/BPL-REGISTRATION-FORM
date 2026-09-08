import { AuthProvider, AuthIdentity, OtpRequestResult, OtpVerifyResult } from './authProvider';
import { config } from '../../config/env';

/**
 * Isolated Development Mock Auth Provider
 *
 * STRICT SECURITY REQUIREMENT:
 * - This mock NEVER activates in production.
 * - Requires NODE_ENV === 'development' AND DEV_MOCK_AUTH === 'true'.
 */
export class DevMockAuthProvider implements AuthProvider {
  readonly name = 'DevMockAuthProvider';

  get isConfigured(): boolean {
    return config.devMockAuthEnabled;
  }

  private assertDevMode(): void {
    if (config.nodeEnv === 'production' || !config.devMockAuthEnabled) {
      throw new Error('DevMockAuthProvider is strictly disabled in production or when DEV_MOCK_AUTH is false.');
    }
  }

  async requestOtp(mobile: string, _purpose?: string): Promise<OtpRequestResult> {
    this.assertDevMode();
    const cleanMobile = mobile.replace(/[^0-9+]/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      return { success: false, message: 'Please provide a valid 10-digit mobile number.' };
    }

    return {
      success: true,
      message: '[DEV MOCK ONLY] Test OTP 123456 generated for local testing.',
      requestId: `dev-req-${Date.now()}`,
      expiresInSeconds: 300,
    };
  }

  async verifyOtp(mobile: string, otp: string, _requestIdOrPurpose?: string): Promise<OtpVerifyResult> {
    this.assertDevMode();
    if (otp !== '123456') {
      return { success: false, message: 'Invalid OTP. For dev mock, use 123456.' };
    }

    const cleanMobile = mobile.replace(/[^0-9+]/g, '');
    const identity: AuthIdentity = {
      userId: `dev-user-${Buffer.from(cleanMobile).toString('hex').substring(0, 12)}`,
      mobile: cleanMobile,
      provider: 'dev_mock',
      sessionToken: `dev-mock-token-${Date.now()}-${cleanMobile}`,
      authenticatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Dev Mock authenticated successfully',
      identity,
      token: identity.sessionToken,
    };
  }

  async verifySessionToken(token: string): Promise<AuthIdentity | null> {
    if (!this.isConfigured || !token.startsWith('dev-mock-token-')) {
      return null;
    }

    const parts = token.split('-');
    const mobile = parts[parts.length - 1] || '+919999999999';

    return {
      userId: `dev-user-${Buffer.from(mobile).toString('hex').substring(0, 12)}`,
      mobile,
      provider: 'dev_mock',
      sessionToken: token,
      authenticatedAt: new Date().toISOString(),
    };
  }

  async logout(_token: string): Promise<boolean> {
    return true;
  }
}
