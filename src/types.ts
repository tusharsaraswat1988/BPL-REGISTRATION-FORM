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
  id: string;
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
  paymentStatus?: 'VERIFIED' | 'PENDING_VERIFICATION';
  paidAt?: string;
  utrTransactionId?: string;
  paymentScreenshot?: string;
}

export interface TeamBrandingDetails {
  teamName: string;
  includeBranding: boolean;
  teamTagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  teamShortCode?: string;
}

export interface RegistrationRecord {
  id: string; // Format: BPL-2026-XXXX (e.g. BPL-2026-0001)
  teamCode: string; // Format: exactly 4 numeric digits (e.g. "1027")
  createdAt: string;
  status: 'Confirmed' | 'Verification Pending';
  category: CategoryId;
  association: AssociationDetails;
  mentor: MentorDetails;
  teamName: string;
  includeBranding: boolean;
  branding: TeamBrandingDetails;
  players: PlayerDetails[]; // Strictly 8 players
  payment: {
    method: PaymentMethod;
    transactionReference: string;
    paymentDate?: string;
    paymentProofUrl: string;
    baseAmount: number;
    brandingAmount: number;
    totalAmount: number;
    paymentStatus: 'VERIFIED' | 'PENDING_VERIFICATION';
  };
  whatsappCommunityUrl?: string;
  notes?: string;
}

export interface TournamentConfig {
  tournamentName: string;
  secondaryLabel: string;
  dates: string;
  organizers: string[];
  format: string;
  registrationWindow: {
    start: string; // "2026-09-08T00:00:00+05:30"
    end: string;   // "2026-10-15T23:59:59+05:30"
    enabled: boolean;
  };
  fees: {
    baseRegistrationFee: 8000;
    brandingAddonFee: 5000;
    withoutBrandingTotal: 8000;
    withBrandingTotal: 13000;
  };
  whatsappCommunityUrl: string;
  paymentConfig: {
    upiId: string;
    upiQrImage: string;
    paymentLink: string;
    bankAccountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
}
