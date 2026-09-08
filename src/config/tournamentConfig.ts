import { CategoryId } from '../types';

export interface SponsorConfig {
  id: string;
  type: string; // e.g. "OFFICIAL SPONSOR", "TITLE SPONSOR", "ASSOCIATE SPONSOR", "POWERED BY"
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface TournamentCategoryConfig {
  id: CategoryId;
  name: string;
  classes: string;
  allowedClasses: number[];
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
  ORGANISER_NAME: "Bidwar.in & KV TechMedia",
  BIDWAR_URL: "https://bidwar.in",
  // Official KV TechMedia URL as mandated
  KV_TECHMEDIA_URL: (typeof process !== 'undefined' && process.env?.KV_TECHMEDIA_URL) || 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_KV_TECHMEDIA_URL) || 
    "https://kvtmedia.com/",

  // Centralized Social Media Configurations
  BIDWAR_INSTAGRAM_URL: (typeof process !== 'undefined' && process.env?.BIDWAR_INSTAGRAM_URL) || 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BIDWAR_INSTAGRAM_URL) || 
    "https://instagram.com/bidwar.in",
  BIDWAR_FACEBOOK_URL: (typeof process !== 'undefined' && process.env?.BIDWAR_FACEBOOK_URL) || 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BIDWAR_FACEBOOK_URL) || 
    "https://facebook.com/bidwar.in",

  // Tournament Categories
  CATEGORY_1: {
    id: 'class_4_5_6' as CategoryId,
    name: 'Class 4–5–6 Division',
    classes: 'Class 4, 5, 6',
    allowedClasses: [4, 5, 6],
    description: 'Official box cricket championship for students currently enrolled in classes 4th, 5th, and 6th.',
    exactSquadSize: 8,
    baseEntryFee: 8000,
    brandingPackageFee: 5000,
    slotsRemaining: 6,
    totalSlots: 16
  } as TournamentCategoryConfig,

  CATEGORY_2: {
    id: 'class_7_8_9' as CategoryId,
    name: 'Class 7–8–9 Division',
    classes: 'Class 7, 8, 9',
    allowedClasses: [7, 8, 9],
    description: 'Competitive youth box cricket division for students currently enrolled in classes 7th, 8th, and 9th.',
    exactSquadSize: 8,
    baseEntryFee: 8000,
    brandingPackageFee: 5000,
    slotsRemaining: 4,
    totalSlots: 16
  } as TournamentCategoryConfig,

  // Roster Constraints
  PLAYERS_PER_TEAM: 8,
  MENTORS_PER_TEAM: 1,

  // Financial Fees (Authoritative)
  REGISTRATION_FEE: 8000,
  BRANDING_FEE: 5000,
  TOTAL_WITHOUT_BRANDING: 8000,
  TOTAL_WITH_BRANDING: 13000,

  // Registration Window
  REGISTRATION_START: "2026-09-08T00:00:00+05:30",
  REGISTRATION_END: "2026-10-15T23:59:59+05:30",

  // Sponsors Architecture (Multiple sponsors supported; defaults to empty array to render reserved placeholder)
  SPONSORS: [] as SponsorConfig[],

  // Community & Communications
  WHATSAPP_LINK: "https://chat.whatsapp.com/bidwar-kids-bpl2026",
  WHATSAPP_COMMUNITY_URL: "https://chat.whatsapp.com/bidwar-kids-bpl2026",

  // Team Pass Feature Flag
  TEAM_PASS_ENABLED: false,
  TEAM_PASS_LABEL: "Team Pass — Coming Soon",

  // Payment Banking & UPI Configuration
  PAYMENT_CONFIG: {
    upiId: "bidwarsports@hdfcbank",
    upiQrImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    paymentLink: "https://pages.razorpay.com/bpl-kids-s1",
    bankAccountName: "BIDWAR SPORTS TECH SOLUTIONS PVT LTD",
    bankName: "HDFC Bank Ltd",
    accountNumber: "50200084918231",
    ifscCode: "HDFC0000281"
  }
};
