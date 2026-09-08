# BidWar Premier League — Kids Version (Season 1)
## Production Standalone Registration Portal

This repository contains the standalone, production-ready team registration portal for the **BidWar Premier League — Kids Version (Season 1)** box-cricket tournament held on **3rd & 4th October 2026**, organised by **Bidwar.in & KV TechMedia**.

---

## 1. System Architecture

The application is architected as a standalone, production-grade system with clean decoupling between:
- **Presentation Layer**: React 19 + Tailwind CSS + Lucide Icons.
- **Server API Layer**: Node.js Express server with rate limiting, input validation, and secure error handling.
- **Persistence Layer**: Standalone Neon PostgreSQL database with ACID transactions, constraints, and sequences.
- **File Storage Layer**: Standalone Cloudinary media pipeline for sports assets with size and MIME validation.
- **Identity & Auth Abstraction**: Modular `AuthProvider` interface isolating future BidWar OTP identity provider.

```
┌────────────────────────────────────────────────────────┐
│               BPL Kids Client Application              │
│       (Registration Wizard / Showcase Directory)       │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON / Multipart
┌──────────────────────────▼─────────────────────────────┐
│                 BPL Express API Server                 │
│  ├── /api/public/teams (Strict 4-Field Privacy DTO)   │
│  ├── /api/upload (Cloudinary Storage Pipeline)         │
│  ├── /api/drafts (Crypto Token Autosave)               │
│  ├── /api/registrations (Atomic Transaction)          │
│  └── /api/admin/registrations (Payment Verification)   │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
┌──────────────▼─────────────┐ ┌──────────▼──────────────┐
│   Neon PostgreSQL Database  │ │    Cloudinary Storage    │
│  - registrations           │ │  - bpl-kids/associations│
│  - associations            │ │  - bpl-kids/players     │
│  - mentors                 │ │  - bpl-kids/mentors     │
│  - players (8 per team)    │ │  - bpl-kids/payment-    │
│  - payments                │ │    proofs (Private)     │
│  - drafts                  │ └─────────────────────────┘
│  - registration_sequence   │
└────────────────────────────┘
```

---

## 2. BidWar OTP Integration — Pending Provider Contract

> [!IMPORTANT]
> **Current Status**: `NOT CONFIGURED`
>
> **Reason**: The local standalone BPL repository does not contain the core BidWar OTP provider contract, endpoints, or signing keys. To avoid guessing or creating a fake secondary OTP system, authentication is architected behind a clean `AuthProvider` boundary (`src/server/services/auth/`).

### Required Information Before Activation:
1. **OTP Request Endpoint**: URL & method (e.g. `POST https://auth.bidwar.in/api/otp/send`) and body contract.
2. **OTP Verification Endpoint**: URL & method (e.g. `POST https://auth.bidwar.in/api/otp/verify`).
3. **Authentication Response**: Payload format (e.g. `userId`, `mobile`, `token`).
4. **Token/Session Mechanism**: JWT (with public key/verification URL), session cookie, or Bearer token.
5. **Session Expiry & Refresh**: Expiry duration and refresh mechanism.
6. **Subdomain / CORS Context**: Whether BPL Kids will share root `.bidwar.in` cookies or communicate server-to-server.

The database schema (`registrations.auth_user_id`, `drafts.auth_user_id`) is already prepared to link authenticated identities directly upon OTP provider activation.

---

## 3. Database Schema & Constraints

The database is built on Neon PostgreSQL with the following entities:

### Tables:
- **`registration_sequence`**: Atomic year-based counter (`year=2026`, `last_number`) for collision-free `BPL-2026-0001` ID generation.
- **`registrations`**:
  - `id` (VARCHAR(32) PRIMARY KEY e.g. `BPL-2026-0001`)
  - `team_code` (VARCHAR(4) UNIQUE NOT NULL, 1000–9999)
  - `category` (VARCHAR(32) NOT NULL CHECK IN ('class_4_5_6', 'class_7_8_9'))
  - `team_name` (VARCHAR(255) NOT NULL)
  - `include_branding` (BOOLEAN NOT NULL DEFAULT FALSE)
  - `team_tagline` (VARCHAR(255))
  - `team_short_code` (VARCHAR(32))
  - `status` (VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED' CHECK IN ('SUBMITTED', 'CONFIRMED', 'UNDER_REVIEW', 'REJECTED'))
  - `auth_user_id` (VARCHAR(255))
  - `idempotency_key` (VARCHAR(128) UNIQUE)
  - `notes` (TEXT)
  - `created_at` / `updated_at` (TIMESTAMPTZ)
- **`associations`**: `association_name`, `branch`, `email`, `mobile`, `association_logo` (TEXT), `city`.
- **`mentors`**: Exactly 1 record per registration: `name`, `mobile`, `second_mobile`, `email`, `photo`, `designation`.
- **`players`**: Exactly 8 records per registration (`player_index` 1..8): `player_name`, `student_class`, `date_of_birth`, `parent_mobile`, `parent_email`, `player_photo`, `jersey_number`, `jersey_size`, `cricket_role`, `batting_style`, `bowling_style`.
  - Constraint: `UNIQUE(registration_id, jersey_number)` enforces unique jersey numbers per team.
- **`payments`**: `utr_transaction_id` (UNIQUE NOT NULL), `payment_screenshot`, `method`, `base_amount` (8000), `branding_amount` (0 or 5000), `total_amount` (8000 or 13000), `payment_status` ('PENDING_VERIFICATION' | 'VERIFIED' | 'PAYMENT_REJECTED').
- **`drafts`**: `draft_token` (VARCHAR(64) UNIQUE NOT NULL), `current_step`, `data` (JSONB), `auth_user_id`.

---

## 4. API Inventory

| Method | Endpoint | Classification | Purpose | Auth Required |
|---|---|---|---|---|
| `GET` | `/api/health` | PUBLIC | Health, server time, registration status | No |
| `GET` | `/api/tournament-info` | PUBLIC | Canonical tournament details & fees | No |
| `GET` | `/api/public/teams` | PUBLIC | Registered teams showcase (**Strictly 4 fields**) | No |
| `POST` | `/api/upload` | PUBLIC USER | Cloudinary image upload (max 5MB, JPG/PNG/WebP) | No |
| `POST` | `/api/drafts` | PRIVATE USER | Autosave registration draft (returns `draftToken`) | Optional / Token |
| `GET` | `/api/drafts/:draftToken`| PRIVATE USER | Retrieve active draft via `x-draft-token` | Token |
| `DELETE`| `/api/drafts/:draftToken`| PRIVATE USER| Clear saved draft | Token |
| `POST` | `/api/registrations` | PUBLIC USER | Atomic final submission with ACID transaction | Optional / Token |
| `GET` | `/api/registrations/:query` | PUBLIC USER | Status lookup by Team Code or Registration ID | No (PII Redacted) |
| `POST` | `/api/admin/registrations/:id/verify-payment` | ADMIN | Mark payment as `VERIFIED` | `x-admin-api-key` |

---

## 5. Public vs Private Privacy Boundary

### Public Registered Teams API (`GET /api/public/teams`):
The response is strictly limited to:
```json
{
  "success": true,
  "total": 1,
  "teams": [
    {
      "teamName": "DPS Thunderbolts",
      "associationName": "Delhi Public Global School",
      "associationLogo": "https://res.cloudinary.com/...",
      "category": "Class 7–8–9"
    }
  ]
}
```
**Zero sensitive data is exposed**:
- No player names, photos, classes, or DOBs.
- No parent phone numbers or parent emails.
- No mentor phone numbers, emails, or photos.
- No payment proofs, UTRs, or fee amounts.
- No 4-digit Team Codes or internal database IDs.

---

## 6. Registration & Payment Lifecycles

### Registration Lifecycle:
1. `DRAFT`: Saved continuously to database with a crypto `draftToken`.
2. `SUBMITTED`: Transitions upon atomic final submission transaction.
3. `UNDER_REVIEW`: Committee reviewing roster class compliance.
4. `CONFIRMED`: Roster confirmed for fixtures.

### Payment Lifecycle:
1. `PENDING_VERIFICATION`: Initial status upon user submission with UTR and receipt.
2. `VERIFIED`: Set exclusively by tournament administrator via `/api/admin/registrations/:id/verify-payment` with `ADMIN_API_KEY`.
3. `PAYMENT_REJECTED`: Flagged if UTR/screenshot does not match banking records.

---

## 7. Cloudinary Media Storage

- Uploads stream directly to Cloudinary server-side using `multer.memoryStorage()`.
- Partitioned folder structure:
  - `bpl-kids/associations` (Public logos)
  - `bpl-kids/players` (Private player headshots)
  - `bpl-kids/mentors` (Private mentor photos)
  - `bpl-kids/payment-proofs` (Strictly authenticated private proofs)
- Validations:
  - Max file size 5MB.
  - Image MIME check and magic bytes verification (PNG, JPEG, WebP).
  - No Data URLs or base64 images stored in PostgreSQL.

---

## 8. Environment Configuration (`.env`)

Refer to `.env.example`:

```env
# Server
NODE_ENV=production
PORT=3000

# Standalone Neon PostgreSQL
DATABASE_URL=postgresql://[user]:[password]@[neon-host]/[dbname]?sslmode=require

# Standalone Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Tournament Window
REGISTRATION_START_TIME=2026-09-08T00:00:00+05:30
REGISTRATION_END_TIME=2026-10-15T23:59:59+05:30
REGISTRATION_ENABLED=true

# Admin Payment Verification Key
ADMIN_API_KEY=super_secure_admin_key_here

# Email / SMTP (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=BidWar Premier League <bpl@bidwar.in>

# Future BidWar OTP Provider (Pending)
# BIDWAR_AUTH_BASE_URL=
# BIDWAR_AUTH_CLIENT_ID=
# BIDWAR_AUTH_CLIENT_SECRET=
```

---

## 9. Build, Test, and Run Commands

```bash
# Install dependencies
npm install

# Run automated test suite
npm test

# Typecheck codebase
npm run lint

# Build production client and server bundles
npm run build

# Start production server
npm start
```
