import dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  nodeEnv: string;
  port: number;
  databaseUrl?: string;
  
  // Cloudinary
  cloudinary: {
    cloudName?: string;
    apiKey?: string;
    apiSecret?: string;
    uploadPreset?: string;
  };

  // Admin Security
  adminApiKey?: string;

  // Tournament Rules & Window (Authoritative Server Time)
  registrationWindow: {
    start: string;
    end: string;
    enabled: boolean;
  };

  // Fees (Authoritative Backend Source)
  fees: {
    baseRegistrationFee: number;
    brandingAddonFee: number;
    withoutBrandingTotal: number;
    withBrandingTotal: number;
  };

  // Fast2SMS OTP Integration (BidWar Standard)
  otp: {
    bulkSmsKey?: string;
    bulkSmsTemplateId?: string;
  };

  // Cashfree Payment Gateway Integration
  cashfree: {
    appId?: string;
    secretKey?: string;
    environment: 'SANDBOX' | 'PRODUCTION';
    apiVersion: string;
  };

  // Resend Email Integration (BidWar Standard)
  email: {
    resendApiKey?: string;
    mailFrom?: string;
    emailEnabled: boolean;
    adminNotificationEmail?: string;
  };

  // Session & Auth Security
  sessionSecret: string;

  // Dev Mock Auth strictly gated
  devMockAuthEnabled: boolean;
}

export const config: ServerConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL,

  cloudinary: (() => {
    const clean = (val?: string) => {
      if (!val) return undefined;
      const trimmed = val.trim().replace(/^['"]|['"]$/g, '');
      return trimmed.length > 0 ? trimmed : undefined;
    };

    const rawUrl = clean(process.env.CLOUDINARY_URL);
    let urlCloudName: string | undefined;
    let urlApiKey: string | undefined;
    let urlApiSecret: string | undefined;

    if (rawUrl && rawUrl.startsWith('cloudinary://')) {
      try {
        const urlObj = new URL(rawUrl);
        urlApiKey = clean(decodeURIComponent(urlObj.username));
        urlApiSecret = clean(decodeURIComponent(urlObj.password));
        urlCloudName = clean(urlObj.hostname);
      } catch {
        const match = rawUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
        if (match) {
          urlApiKey = clean(match[1]);
          urlApiSecret = clean(match[2]);
          urlCloudName = clean(match[3]);
        }
      }
    }

    return {
      cloudName: clean(process.env.CLOUDINARY_CLOUD_NAME) || urlCloudName || 'dja0upxxe',
      apiKey: clean(process.env.CLOUDINARY_API_KEY) || urlApiKey,
      apiSecret: clean(process.env.CLOUDINARY_API_SECRET) || urlApiSecret,
      uploadPreset: clean(process.env.CLOUDINARY_UPLOAD_PRESET) || 'bpl_kids_public',
    };
  })(),

  adminApiKey: process.env.ADMIN_API_KEY || (process.env.NODE_ENV === 'production' ? undefined : 'bpl-admin-2026'),

  registrationWindow: {
    start: process.env.REGISTRATION_START_TIME || '2026-09-08T00:00:00+05:30',
    end: process.env.REGISTRATION_END_TIME || '2026-09-15T23:59:59+05:30',
    enabled: process.env.REGISTRATION_ENABLED !== 'false',
  },

  fees: {
    baseRegistrationFee: 8000,
    brandingAddonFee: 5000,
    withoutBrandingTotal: 8000,
    withBrandingTotal: 13000,
  },

  otp: {
    bulkSmsKey: process.env.BULKSMS_KEY,
    bulkSmsTemplateId: process.env.BULKSMS_TEMPLATE_ID,
  },

  cashfree: {
    appId: process.env.CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID,
    secretKey: process.env.CASHFREE_SECRET_KEY || process.env.CASHFREE_CLIENT_SECRET,
    environment: (process.env.CASHFREE_ENV?.toUpperCase() === 'PRODUCTION' || process.env.CASHFREE_ENVIRONMENT?.toUpperCase() === 'PRODUCTION') ? 'PRODUCTION' : 'SANDBOX',
    apiVersion: process.env.CASHFREE_API_VERSION || '2023-08-01',
  },

  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    mailFrom: process.env.MAIL_FROM || 'BidWar Premier League <bpl@mail.bidwar.in>',
    emailEnabled: process.env.EMAIL_ENABLED !== 'false',
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
  },

  sessionSecret: process.env.SESSION_SECRET || 'bpl-insecure-dev-session-secret-min-32-chars',
  devMockAuthEnabled: process.env.NODE_ENV === 'development' && process.env.DEV_MOCK_AUTH === 'true',
};

export interface EnvValidationResult {
  valid: boolean;
  missingRequired: string[];
  warnings: string[];
}

export function validateEnv(isProduction: boolean = config.nodeEnv === 'production'): EnvValidationResult {
  const missingRequired: string[] = [];
  const warnings: string[] = [];

  // Required production variables
  if (!config.databaseUrl || config.databaseUrl.trim() === '') {
    if (isProduction) missingRequired.push('DATABASE_URL');
    else warnings.push('DATABASE_URL is not set; running in memory/mock storage mode.');
  }

  if (!config.cloudinary.cloudName || config.cloudinary.cloudName.trim() === '') {
    if (isProduction) missingRequired.push('CLOUDINARY_CLOUD_NAME');
    else warnings.push('CLOUDINARY_CLOUD_NAME is not set.');
  }
  if (!config.cloudinary.uploadPreset && (!config.cloudinary.apiKey || !config.cloudinary.apiSecret)) {
    if (isProduction) missingRequired.push('CLOUDINARY_UPLOAD_PRESET or (CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET)');
    else warnings.push('Cloudinary upload configuration (CLOUDINARY_UPLOAD_PRESET or CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET) is not set.');
  }

  if (!config.otp.bulkSmsKey || config.otp.bulkSmsKey.trim() === '') {
    if (isProduction) missingRequired.push('BULKSMS_KEY');
    else warnings.push('BULKSMS_KEY is not set; Fast2SMS OTP will be inactive.');
  }
  if (!config.otp.bulkSmsTemplateId || config.otp.bulkSmsTemplateId.trim() === '') {
    if (isProduction) missingRequired.push('BULKSMS_TEMPLATE_ID');
    else warnings.push('BULKSMS_TEMPLATE_ID is not set; Fast2SMS OTP will be inactive.');
  }

  // Cashfree Payment Gateway Checks
  if (!config.cashfree.appId || config.cashfree.appId.trim() === '') {
    if (isProduction) missingRequired.push('CASHFREE_APP_ID (required in production for payment processing)');
    else warnings.push('CASHFREE_APP_ID is not set; Cashfree payments will run in sandbox/mock simulation.');
  }
  if (!config.cashfree.secretKey || config.cashfree.secretKey.trim() === '') {
    if (isProduction) missingRequired.push('CASHFREE_SECRET_KEY (required in production for payment processing)');
    else warnings.push('CASHFREE_SECRET_KEY is not set; Cashfree payments will run in sandbox/mock simulation.');
  }

  if (isProduction) {
    if (
      !process.env.SESSION_SECRET ||
      process.env.SESSION_SECRET === 'bpl-insecure-dev-session-secret-min-32-chars' ||
      process.env.SESSION_SECRET.trim().length < 32
    ) {
      missingRequired.push('SESSION_SECRET (must be configured in production with at least 32 characters)');
    }

    if (!config.adminApiKey || config.adminApiKey.trim() === '') {
      missingRequired.push('ADMIN_API_KEY');
    }

    // Production Resend Email Requirement
    if (config.email.emailEnabled) {
      if (!config.email.resendApiKey || config.email.resendApiKey.trim() === '') {
        missingRequired.push('RESEND_API_KEY (required in production for confirmation email delivery)');
      }
      if (!config.email.mailFrom || config.email.mailFrom.trim() === '') {
        missingRequired.push('MAIL_FROM (required in production for confirmation email delivery)');
      }
    } else {
      warnings.push('WARNING: Transactional confirmation email is intentionally disabled via EMAIL_ENABLED=false.');
    }
  } else {
    // Development mode warnings
    if (config.email.emailEnabled && (!config.email.resendApiKey || config.email.resendApiKey.trim() === '')) {
      warnings.push('RESEND_API_KEY is not configured in development; confirmation emails will be logged to server console.');
    }
  }

  return {
    valid: missingRequired.length === 0,
    missingRequired,
    warnings,
  };
}

