-- ==============================================================================
-- BIDWAR PREMIER LEAGUE (KIDS VERSION — SEASON 1) POSTGRESQL SCHEMA
-- Target Database: Standalone Neon PostgreSQL
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Concurrency-safe Registration ID Sequence Table
CREATE TABLE IF NOT EXISTS registration_sequence (
  year INTEGER PRIMARY KEY,
  last_number INTEGER NOT NULL DEFAULT 0
);

-- Seed initial sequence row for tournament year 2026
INSERT INTO registration_sequence (year, last_number)
VALUES (2026, 0)
ON CONFLICT (year) DO NOTHING;

-- 2. Master Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(32) PRIMARY KEY, -- Format: BPL-2026-0001
  team_code VARCHAR(4) UNIQUE NOT NULL, -- Exactly 4 numeric digits e.g. "4821"
  category VARCHAR(32) NOT NULL CHECK (category IN ('class_4_5_6', 'class_7_8_9')),
  team_name VARCHAR(255) NOT NULL,
  include_branding BOOLEAN NOT NULL DEFAULT FALSE,
  team_tagline VARCHAR(255),
  team_short_code VARCHAR(32),
  status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'CONFIRMED', 'UNDER_REVIEW', 'REJECTED')),
  auth_user_id VARCHAR(255), -- Associated authenticated BidWar user identity
  idempotency_key VARCHAR(128) UNIQUE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Association / Entity Details Table
CREATE TABLE IF NOT EXISTS associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id VARCHAR(32) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  association_name VARCHAR(255) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  association_logo TEXT NOT NULL,
  association_type VARCHAR(50) DEFAULT 'School',
  city VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Mentor In-Charge Table (Strictly 1 mentor per registration)
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id VARCHAR(32) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  second_mobile VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  photo TEXT NOT NULL,
  designation VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Players Roster Table (Strictly 8 players per registration)
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id VARCHAR(32) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  player_index INTEGER NOT NULL CHECK (player_index >= 1 AND player_index <= 8),
  player_name VARCHAR(255) NOT NULL,
  student_class INTEGER NOT NULL,
  date_of_birth DATE NOT NULL,
  parent_mobile VARCHAR(50) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  player_photo TEXT NOT NULL,
  jersey_number INTEGER NOT NULL CHECK (jersey_number >= 1 AND jersey_number <= 99),
  jersey_size VARCHAR(10) NOT NULL,
  cricket_role VARCHAR(50) NOT NULL,
  batting_style VARCHAR(50),
  bowling_style VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_jersey_per_team UNIQUE (registration_id, jersey_number)
);

-- 6. Payment & Verification Record Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id VARCHAR(32) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  utr_transaction_id VARCHAR(100) UNIQUE NOT NULL,
  payment_screenshot TEXT NOT NULL DEFAULT 'CASHFREE_GATEWAY_VERIFIED',
  method VARCHAR(50) NOT NULL DEFAULT 'UPI',
  gateway VARCHAR(50) NOT NULL DEFAULT 'MANUAL',
  gateway_order_id VARCHAR(100),
  gateway_payment_id VARCHAR(100),
  gateway_raw_response JSONB,
  base_amount INTEGER NOT NULL DEFAULT 8000,
  branding_amount INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (payment_status IN ('PENDING_VERIFICATION', 'VERIFIED', 'PAYMENT_REJECTED')),
  verified_at TIMESTAMPTZ,
  verified_by VARCHAR(255),
  confirmation_email_sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6B. Cashfree Payment Intents Table (Immutable order-to-draft binding)
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(100) UNIQUE NOT NULL,
  draft_token VARCHAR(64) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(32) NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'PAID', 'FAILED', 'CANCELLED')),
  category VARCHAR(32) NOT NULL,
  include_branding BOOLEAN NOT NULL DEFAULT FALSE,
  team_name VARCHAR(255),
  cf_payment_id VARCHAR(100),
  bank_reference VARCHAR(100),
  payment_method VARCHAR(50),
  auth_user_id VARCHAR(255),
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safe migration alters for existing databases
ALTER TABLE payments ADD COLUMN IF NOT EXISTS gateway VARCHAR(50) DEFAULT 'MANUAL';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS gateway_order_id VARCHAR(100);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS gateway_payment_id VARCHAR(100);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS gateway_raw_response JSONB;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ;

-- 7. Autosave / Server-Side Drafts Table
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_token VARCHAR(64) UNIQUE NOT NULL,
  auth_user_id VARCHAR(255),
  current_step INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Standalone OTP Sessions Table (Fast2SMS BidWar Integration)
CREATE TABLE IF NOT EXISTS otp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile VARCHAR(50) NOT NULL,
  purpose VARCHAR(50) NOT NULL DEFAULT 'bpl_registration',
  payload JSONB,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Transactional Email Delivery & Idempotency Tracking Table
CREATE TABLE IF NOT EXISTS email_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id VARCHAR(32) NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  recipient_type VARCHAR(32) NOT NULL CHECK (recipient_type IN ('ASSOCIATION', 'MENTOR', 'PARENT')),
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(50) NOT NULL CHECK (email_type IN ('REGISTRATION_CONFIRMATION', 'PAYMENT_CONFIRMATION', 'TOURNAMENT_RULES')),
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
  provider_message_id VARCHAR(255),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_reg_recipient_email_type UNIQUE (registration_id, recipient_email, email_type)
);

-- Indexes for high performance & query optimization
CREATE INDEX IF NOT EXISTS idx_registrations_category ON registrations(category);
CREATE INDEX IF NOT EXISTS idx_registrations_auth_user ON registrations(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_associations_registration_id ON associations(registration_id);
CREATE INDEX IF NOT EXISTS idx_mentors_registration_id ON mentors(registration_id);
CREATE INDEX IF NOT EXISTS idx_players_registration_id ON players(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON payments(registration_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_gateway_order_unique ON payments(gateway_order_id) WHERE gateway_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payment_intents_order_id ON payment_intents(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_draft_token ON payment_intents(draft_token);
CREATE INDEX IF NOT EXISTS idx_drafts_token ON drafts(draft_token);
CREATE INDEX IF NOT EXISTS idx_drafts_auth_user ON drafts(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_mobile ON otp_sessions(mobile);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_reg_id ON email_deliveries(registration_id);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_status ON email_deliveries(status);

