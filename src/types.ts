export type CricketRole = 'Batsman' | 'Bowler' | 'All Rounder' | 'Wicket Keeper';

export type BattingStyle = 'Right Hand' | 'Left Hand';

export type BowlingStyle =
  | 'Right Arm Fast'
  | 'Right Arm Medium'
  | 'Right Arm Spin'
  | 'Left Arm Fast'
  | 'Left Arm Medium'
  | 'Left Arm Spin';

export type JerseySize = '28' | '30' | '32' | '34' | '36' | '38' | '40' | 'S' | 'M' | 'L';

export type CategoryId = 'class_4_5_6' | 'class_7_8_9';

export type PaymentMethod =
  | 'UPI'
  | 'Bank Transfer (NEFT/RTGS/IMPS)'
  | 'Cheque/Demand Draft'
  | 'QR_UPI'
  | 'PAYMENT_LINK'
  | 'BANK_TRANSFER';

export interface TournamentCategory {
  id: CategoryId;
  name: string;
  classes?: string;
  allowedClasses?: number[];
  description: string;
  exactSquadSize?: number;
  squadSize?: number;
  baseEntryFee?: number;
  baseFee?: number;
  brandingPackageFee?: number;
  brandingFee?: number;
  slotsRemaining?: number;
  totalSlots?: number;
}

export interface AssociationDetails {
  associationName: string; // Required *
  branch: string; // Required *
  email: string; // Required *
  mobile: string; // Required *
  associationLogo: string; // Required *
  associationType?: 'School' | 'Academy' | 'Club' | 'Sports Association';
  city?: string;
}

export interface MentorDetails {
  name: string; // Required *
  mobile: string; // Required *
  secondMobile?: string; // Optional
  email: string; // Required *
  photo: string; // Required *
  designation?: string;
}

export interface PlayerDetails {
  id?: string;
  playerName: string; // Required *
  studentClass: number; // Required * (4, 5, 6 for class_4_5_6, or 7, 8, 9 for class_7_8_9)
  dateOfBirth: string; // Required *
  parentMobile: string; // Required *
  parentEmail: string; // Required *
  playerPhoto: string; // Required *
  jerseyNumber: number; // Required * (unique within team, 1-99)
  jerseySize: JerseySize; // Required *
  cricketRole: CricketRole; // Required *
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
}

export interface PaymentInfo {
  method: PaymentMethod;
  transactionReference: string;
  paymentDate?: string;
  paymentProofUrl: string;
  includeBranding?: boolean;
  baseAmount?: number; // ₹8,000
  brandingAmount?: number; // ₹0 or ₹5,000
  totalAmount?: number; // Authoritative from backend: ₹8,000 or ₹13,000
  paymentStatus?: 'VERIFIED' | 'PENDING_VERIFICATION' | 'PAYMENT_REJECTED';
  paidAt?: string;
  utrTransactionId?: string;
  paymentScreenshot?: string;
}

export interface SponsorConfig {
  id: string;
  type: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export type RegistrationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CONFIRMED' | 'REJECTED';

export interface DraftRecord {
  draftToken: string;
  currentStep: number;
  category: CategoryId;
  association: AssociationDetails;
  mentor: MentorDetails;
  teamName: string;
  includeBranding: boolean;
  teamTagline: string;
  players: PlayerDetails[];
  payment: PaymentInfo;
  status: 'DRAFT' | 'SUBMITTED';
  updatedAt: string;
  createdAt?: string;
}

export interface TeamBrandingDetails {
  teamName: string;
  includeBranding: boolean;
  teamTagline?: string;
  teamShortCode?: string;
}

export interface RegistrationRecord {
  id: string; // Format: BPL-2026-XXXX (e.g. BPL-2026-0001)
  teamCode: string; // Format: exactly 4 numeric digits (e.g. "1027")
  createdAt: string;
  status: 'SUBMITTED' | 'Confirmed' | 'Verification Pending' | RegistrationStatus;
  category: CategoryId;
  association: AssociationDetails;
  mentor: MentorDetails;
  teamName: string;
  includeBranding: boolean;
  branding: TeamBrandingDetails;
  players: PlayerDetails[]; // Strictly 8 players
  payment: {
    method: PaymentMethod;
    transactionReference?: string;
    paymentDate?: string;
    paymentProofUrl?: string;
    baseAmount: number;
    brandingAmount: number;
    totalAmount: number;
    paymentStatus: 'VERIFIED' | 'PENDING_VERIFICATION' | 'PAYMENT_REJECTED';
    paidAt?: string;
    utrTransactionId?: string;
    paymentScreenshot?: string;
  };
  whatsappCommunityUrl?: string;
  notes?: string;
}

export interface RegistrationConfirmationDTO {
  registrationId: string;
  teamCode: string;
  teamName: string;
  category: CategoryId | string;
  paymentStatus: string;
}

// Strict Public Registered Teams DTO (ONLY 4 FIELDS)
export interface PublicTeamDTO {
  teamName: string;
  associationName: string;
  associationLogo: string;
  category: string;
}
