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
      description: 'Official box-cricket championship for players currently studying in Class 4, 5, or 6.',
      squadSize: 8,
      baseFee: 8000,
      brandingFee: 5000,
      slotsRemaining: 6,
      totalSlots: 16,
    },
    {
      id: 'class_7_8_9',
      name: 'Category 2: Class 7–8–9',
      classes: 'Classes 7, 8 & 9',
      allowedClasses: [7, 8, 9],
      description: 'Competitive youth box-cricket division for players currently studying in Class 7, 8, or 9.',
      squadSize: 8,
      baseFee: 8000,
      brandingFee: 5000,
      slotsRemaining: 4,
      totalSlots: 16,
    },
  ],
  whatsappCommunityUrl: 'https://chat.whatsapp.com/bidwar-kids-bpl2026',
  paymentConfig: {
    upiId: 'bidwarsports@hdfcbank',
    upiQrImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    paymentLink: 'https://pages.razorpay.com/bpl-kids-s1',
    bankAccountName: 'BIDWAR SPORTS TECH SOLUTIONS PVT LTD',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50200084918231',
    ifscCode: 'HDFC0000281',
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
