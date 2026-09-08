export interface AuthIdentity {
  userId: string;
  mobile: string;
  name?: string;
  email?: string;
  provider: 'bidwar_otp' | 'dev_mock';
  sessionToken?: string;
  authenticatedAt: string;
}

export interface OtpRequestResult {
  success: boolean;
  message: string;
  requestId?: string;
  expiresInSeconds?: number;
}

export interface OtpVerifyResult {
  success: boolean;
  message: string;
  identity?: AuthIdentity;
  token?: string;
}

export interface AuthProvider {
  readonly name: string;
  readonly isConfigured: boolean;

  requestOtp(mobile: string, purpose?: string): Promise<OtpRequestResult>;
  verifyOtp(mobile: string, otp: string, requestIdOrPurpose?: string): Promise<OtpVerifyResult>;
  verifySessionToken(token: string): Promise<AuthIdentity | null>;
  logout(token: string): Promise<boolean>;
}
