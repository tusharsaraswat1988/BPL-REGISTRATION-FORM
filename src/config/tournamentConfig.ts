import { CategoryId } from '../types';

export interface SponsorConfig {
  id: string;
  name: string;
  type: string; // e.g. "TITLE SPONSOR", "OFFICIAL SPONSOR", "BROADCAST PARTNER", "POWERED BY"
  logoUrl?: string;
  websiteUrl?: string;
  tagline?: string;
  order?: number;
  active?: boolean;
}

export interface TournamentCategoryConfig {
  id: CategoryId;
  name: string;
  classes: string;
  allowedClasses: number[];
  ageEligibility?: string;
  description: string;
  exactSquadSize: number;
  baseEntryFee: number;
  brandingPackageFee: number;
  slotsRemaining: number;
  totalSlots: number;
}

export const TOURNAMENT_CONFIG = {
  // Official Tournament Identity
  TOURNAMENT_NAME: "BIDWAR PREMIER LEAGUE",
  TOURNAMENT_EDITION: "KIDS VERSION — SEASON 1",
  TOURNAMENT_DATES: "3rd & 4th October 2026",
  ORGANISER_NAME: "Bidwar.in",
  EVENT_PARTNER: "bidwar.in",
  OPERATIONS_ADDRESS: "Varanasi, Uttar Pradesh, India",
  HELPLINE_PHONE: "8707488250",
  HELPLINE_DISPLAY: "+91 87074 88250",
  OFFICIAL_EMAIL: "bpl@bidwar.in",
  BIDWAR_URL: "https://bidwar.in",
  // Official KV TechMedia URL as mandated
  KV_TECHMEDIA_URL: (typeof process !== 'undefined' && process.env?.KV_TECHMEDIA_URL) || 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_KV_TECHMEDIA_URL) || 
    "https://kvtmedia.com/",

  // Centralized Social Media Configurations
  BIDWAR_INSTAGRAM_URL: (typeof process !== 'undefined' && process.env?.BIDWAR_INSTAGRAM_URL) || 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BIDWAR_INSTAGRAM_URL) || 
    "https://www.instagram.com/bidwar.in",
  BIDWAR_FACEBOOK_URL: (typeof process !== 'undefined' && process.env?.BIDWAR_FACEBOOK_URL) || 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BIDWAR_FACEBOOK_URL) || 
    "https://www.facebook.com/bidwar.in",
  BIDWAR_YOUTUBE_URL: (typeof process !== 'undefined' && process.env?.BIDWAR_YOUTUBE_URL) || 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BIDWAR_YOUTUBE_URL) || 
    "https://www.youtube.com/@bidwarofficial",

  // Tournament Categories
  CATEGORY_1: {
    id: 'class_4_5_6' as CategoryId,
    name: 'Class 4–5–6 Division',
    classes: 'Class 4, 5, 6',
    allowedClasses: [4, 5, 6],
    ageEligibility: '8 Years to 11 Years 11 Months 29 Days',
    description: 'Competitive youth box cricket championship for students currently enrolled in classes 4th, 5th, and 6th.',
    exactSquadSize: 8,
    baseEntryFee: 8000,
    brandingPackageFee: 5000,
    slotsRemaining: 8,
    totalSlots: 8
  } as TournamentCategoryConfig,

  CATEGORY_2: {
    id: 'class_7_8_9' as CategoryId,
    name: 'Class 7–8–9 Division',
    classes: 'Class 7, 8, 9',
    allowedClasses: [7, 8, 9],
    ageEligibility: '12 Years to 14 Years 11 Months 29 Days',
    description: 'Competitive youth box cricket championship for students currently enrolled in classes 7th, 8th, and 9th.',
    exactSquadSize: 8,
    baseEntryFee: 8000,
    brandingPackageFee: 5000,
    slotsRemaining: 8,
    totalSlots: 8
  } as TournamentCategoryConfig,

  // Tournament Structure Parameters
  TEAMS_PER_CATEGORY: 8,
  GROUPS_PER_CATEGORY: 2,
  TEAMS_PER_GROUP: 4,
  LEAGUE_MATCHES_PER_TEAM: 3,
  LEAGUE_MATCHES_PER_GROUP: 6,
  LEAGUE_MATCHES_PER_CATEGORY: 12,
  SEMI_FINALISTS_PER_CATEGORY: 4,

  // Roster Constraints
  PLAYERS_PER_TEAM: 8,
  MENTORS_PER_TEAM: 1,

  // Financial Fees (Authoritative)
  PER_PLAYER_FEE: 1000,
  REGISTRATION_FEE: 8000,
  BRANDING_FEE: 5000,
  TOTAL_WITHOUT_BRANDING: 8000,
  TOTAL_WITH_BRANDING: 13000,

  // Registration Window & Deadline
  REGISTRATION_START: "2026-09-08T00:00:00+05:30",
  REGISTRATION_END: "2026-09-15T23:59:59+05:30",
  REGISTRATION_DEADLINE_DISPLAY: "15 September 2026",

  // Sponsors Architecture (Multiple sponsors supported; defaults to empty array to render reserved placeholder)
  SPONSORS: [] as SponsorConfig[],

  // Community & Communications
  WHATSAPP_LINK: "https://chat.whatsapp.com/bidwar-kids-bpl2026",
  WHATSAPP_COMMUNITY_URL: "https://chat.whatsapp.com/bidwar-kids-bpl2026",

  // Team Pass Feature Flag
  TEAM_PASS_ENABLED: false,
  TEAM_PASS_LABEL: "Team Pass — Coming Soon",

  // Payment Banking & Cashfree Gateway Configuration
  PAYMENT_CONFIG: {
    gateway: 'CASHFREE',
    cashfreeMode: (typeof process !== 'undefined' && process.env?.CASHFREE_ENV === 'PRODUCTION') ? 'production' : 'sandbox',
    upiId: "8707488250@ybl",
    upiPayeeName: "Tushar Saraswat",
    upiQrImage: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3D8707488250%40ybl%26pn%3DTushar%2520Saraswat%26cu%3DINR",
    bankAccountName: "TUSHAR SARASWAT",
    bankName: "SBI, Bhelupura",
    accountNumber: "20057482976",
    ifscCode: "SBIN0001773"
  }
};
