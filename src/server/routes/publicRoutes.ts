import { Router } from 'express';
import { isRegistrationWindowOpen, getPublicRegisteredTeams } from '../db/registrations';
import { isDatabaseInitialized, getSafeDatabaseMetadata } from '../db/index';
import { publicApiLimiter } from '../middleware/rateLimiter';
import { config } from '../config/env';

export const publicRoutes = Router();

// Canonical Public Tournament Configuration (Single Source of Truth)
export const PUBLIC_TOURNAMENT_CONFIG = {
  tournamentName: 'BIDWAR PREMIER LEAGUE',
  secondaryLabel: 'KIDS VERSION — SEASON 1',
  dates: '3rd & 4th October 2026',
  organizers: ['Bidwar.in', 'KV TechMedia'],
  format: 'Box Cricket Tournament',
  officialWebsites: {
    bidwar: 'https://bidwar.in',
    kvTechmedia: 'https://kvtmedia.com/',
  },
  registrationWindow: config.registrationWindow,
  fees: config.fees,
  categories: [
    {
      id: 'class_4_5_6',
      name: 'Category 1: Class 4–5–6',
      classes: 'Classes 4, 5 & 6',
      allowedClasses: [4, 5, 6],
      ageEligibility: '8 Years to 11 Years 11 Months 29 Days',
      description: 'Official box-cricket championship for players currently studying in Class 4, 5, or 6.',
      squadSize: 8,
      baseFee: 8000,
      brandingFee: 5000,
      slotsRemaining: 8,
      totalSlots: 8,
    },
    {
      id: 'class_7_8_9',
      name: 'Category 2: Class 7–8–9',
      classes: 'Classes 7, 8 & 9',
      allowedClasses: [7, 8, 9],
      ageEligibility: '12 Years to 14 Years 11 Months 29 Days',
      description: 'Competitive youth box-cricket division for players currently studying in Class 7, 8, or 9.',
      squadSize: 8,
      baseFee: 8000,
      brandingFee: 5000,
      slotsRemaining: 8,
      totalSlots: 8,
    },
  ],
  whatsappCommunityUrl: 'https://chat.whatsapp.com/bidwar-kids-bpl2026',
  paymentConfig: {
    gateway: 'CASHFREE',
    cashfreeMode: config.cashfree.environment === 'PRODUCTION' ? 'production' : 'sandbox',
    upiId: 'carwashparlour@ybl',
    upiPayeeName: 'Tushar Saraswat',
    upiQrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3Dcarwashparlour%40ybl%26pn%3DTushar%2520Saraswat%26cu%3DINR',
    bankAccountName: 'TUSHAR SARASWAT',
    bankName: 'SBI, Bhelupura',
    accountNumber: '20057482976',
    ifscCode: 'SBIN0001773',
  },
};

// 1. Health Check
publicRoutes.get('/health', publicApiLimiter, (_req, res) => {
  const dbMeta = getSafeDatabaseMetadata();
  const dbReady = isDatabaseInitialized();

  res.json({
    status: 'ok',
    app: 'BidWar Premier League Kids Season 1',
    serverTime: new Date().toISOString(),
    registrationStatus: isRegistrationWindowOpen(),
    database: {
      configured: dbMeta.configured,
      host: dbMeta.host,
      database: dbMeta.database,
      initialized: dbReady,
    },
    databaseTarget: 'Neon PostgreSQL',
    fileStorageTarget: 'Cloudinary',
    authProvider: 'BidWar OTP Provider (Pending)',
  });
});

// 2. Canonical Tournament Info
publicRoutes.get('/tournament-info', publicApiLimiter, (_req, res) => {
  res.json(PUBLIC_TOURNAMENT_CONFIG);
});

// 3. Public Registered Teams (STRICT PRIVACY: ONLY 4 FIELDS)
publicRoutes.get('/public/teams', publicApiLimiter, async (_req, res, next) => {
  try {
    const teams = await getPublicRegisteredTeams();
    res.json({
      success: true,
      total: teams.length,
      teams,
    });
  } catch (err) {
    // If DB is offline during local preview, return clean empty list
    console.warn('[Public Teams] DB offline or query error:', (err as any)?.message);
    res.json({
      success: true,
      total: 0,
      teams: [],
    });
  }
});

// Alias for compatibility
publicRoutes.get('/teams', publicApiLimiter, async (_req, res, next) => {
  try {
    const teams = await getPublicRegisteredTeams();
    res.json({
      success: true,
      total: teams.length,
      teams,
    });
  } catch (err) {
    res.json({ success: true, total: 0, teams: [] });
  }
});
