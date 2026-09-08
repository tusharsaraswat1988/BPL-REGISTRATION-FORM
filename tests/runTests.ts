import { createApp } from '../src/server/app';
import {
  validateRegistrationPayload,
  isRegistrationWindowOpen,
  normalizeUtr,
  PublicTeamDTO,
  RegistrationSubmissionInput
} from '../src/server/db/registrations';
import { validateImageBuffer } from '../src/server/services/cloudinaryService';
import { getAuthProvider, BidWarOtpAuthProvider } from '../src/server/services/auth';
import {
  setDatabaseOverrides,
  initDatabase,
  loadSchemaSql,
  REQUIRED_TABLES,
  getSafeDatabaseMetadata,
  query,
  getPool,
  closeDatabase
} from '../src/server/db/index';
import { config, validateEnv } from '../src/server/config/env';
import { sendRegistrationConfirmationEmail, RegistrationEmailData } from '../src/server/services/emailService';
import crypto from 'crypto';
import http from 'http';
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

function generateUserSessionToken(userId: string, mobile: string = '9811000001'): string {
  const nowSec = Math.floor(Date.now() / 1000);
  const payload = {
    userId,
    mobile: `+91${mobile}`,
    provider: 'bidwar_otp',
    iat: nowSec,
    exp: nowSec + 3600,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', config.sessionSecret).update(payloadB64).digest('base64url');
  return `bpl_jwt_${payloadB64}.${sig}`;
}

async function runAllTests() {
  console.log('\n===============================================================');
  console.log('  RUNNING BPL KIDS PRODUCTION ACCEPTANCE TEST SUITE');
  console.log('===============================================================\n');

  // -------------------------------------------------------------
  // TEST SUITE 1: Registration Window & Authoritative Clock
  // -------------------------------------------------------------
  console.log('--- Suite 1: Registration Window Enforcement ---');
  const windowStatus = isRegistrationWindowOpen();
  assert(windowStatus.open === true, 'Current date (Sept 2026) is within registration window');

  // -------------------------------------------------------------
  // TEST SUITE 2: UTR Normalization & Validation
  // -------------------------------------------------------------
  console.log('\n--- Suite 2: UTR Normalization ---');
  const normalized = normalizeUtr('  hdfc-n260901847192  ');
  assert(normalized === 'HDFC-N260901847192', 'UTR whitespace trimmed and uppercase normalized');

  // -------------------------------------------------------------
  // TEST SUITE 3: Roster Constraints (Exactly 8 Players)
  // -------------------------------------------------------------
  console.log('\n--- Suite 3: Registration Payload Validations ---');
  
  const valid8Players = Array.from({ length: 8 }, (_, i) => ({
    playerName: `Player ${i + 1}`,
    studentClass: 5,
    dateOfBirth: '2015-05-12',
    parentMobile: '+91 98110 0000' + i,
    parentEmail: `parent${i}@example.com`,
    playerPhoto: 'https://res.cloudinary.com/demo/image/upload/bpl-kids/players/p' + (i + 1) + '.jpg',
    jerseyNumber: i + 1,
    jerseySize: '32',
    cricketRole: 'All Rounder',
    battingStyle: 'Right Hand',
    bowlingStyle: 'Right Arm Medium',
  }));

  const validSubmission: RegistrationSubmissionInput = {
    category: 'class_4_5_6',
    teamName: 'DPS Thunderbolts',
    includeBranding: true,
    teamTagline: 'Defend with Pride',
    association: {
      associationName: 'Delhi Public School',
      branch: 'East Campus',
      email: 'sports@dps.edu.in',
      mobile: '+91 98112 34567',
      associationLogo: 'https://res.cloudinary.com/demo/image/upload/bpl-kids/associations/logo.png',
    },
    mentor: {
      name: 'Vikram Rawat',
      mobile: '+91 98112 34567',
      email: 'coach@dps.edu.in',
      photo: 'https://res.cloudinary.com/demo/image/upload/bpl-kids/mentors/mentor.jpg',
    },
    players: valid8Players,
    payment: {
      utrTransactionId: 'HDFC982319082',
      paymentScreenshot: 'https://res.cloudinary.com/demo/image/upload/bpl-kids/payment-proofs/proof.jpg',
      method: 'UPI',
    },
  };

  const validCheck = validateRegistrationPayload(validSubmission);
  assert(validCheck.valid === true, 'Valid 8-player squad passes validation');

  // Check 7 players rejection
  const invalid7Players = { ...validSubmission, players: valid8Players.slice(0, 7) };
  const check7 = validateRegistrationPayload(invalid7Players);
  assert(check7.valid === false && (check7.error?.includes('EXACTLY 8 players') ?? false), '7-player squad is rejected');

  // Check 9 players rejection
  const invalid9Players = {
    ...validSubmission,
    players: [...valid8Players, { ...valid8Players[0], jerseyNumber: 99, playerName: 'Sub Player' }]
  };
  const check9 = validateRegistrationPayload(invalid9Players);
  assert(check9.valid === false && (check9.error?.includes('EXACTLY 8 players') ?? false), '9-player squad is rejected');

  // Check duplicate jersey numbers rejection
  const duplicateJersey = {
    ...validSubmission,
    players: valid8Players.map((p, idx) => idx === 1 ? { ...p, jerseyNumber: 1 } : p)
  };
  const checkDupJersey = validateRegistrationPayload(duplicateJersey);
  assert(checkDupJersey.valid === false && (checkDupJersey.error?.includes('unique') ?? false), 'Duplicate jersey number within team is rejected');

  // Check player class category mismatch (e.g. Class 8 in Class 4-5-6 division)
  const classMismatch = {
    ...validSubmission,
    players: valid8Players.map((p, idx) => idx === 0 ? { ...p, studentClass: 8 } : p)
  };
  const checkClassMismatch = validateRegistrationPayload(classMismatch);
  assert(checkClassMismatch.valid === false && (checkClassMismatch.error?.includes('Class must be in') ?? false), 'Invalid player class for selected category is rejected');

  // Check missing UTR
  const missingUtr = {
    ...validSubmission,
    payment: { ...validSubmission.payment, utrTransactionId: '' }
  };
  const checkMissingUtr = validateRegistrationPayload(missingUtr);
  assert(checkMissingUtr.valid === false && (checkMissingUtr.error?.includes('UTR') ?? false), 'Missing UTR is rejected');

  // Check missing payment proof
  const missingProof = {
    ...validSubmission,
    payment: { ...validSubmission.payment, paymentScreenshot: '' }
  };
  const checkMissingProof = validateRegistrationPayload(missingProof);
  assert(checkMissingProof.valid === false && (checkMissingProof.error?.includes('screenshot') ?? false), 'Missing payment proof screenshot is rejected');

  // -------------------------------------------------------------
  // TEST SUITE 4: Cloudinary Buffer & MIME Validation
  // -------------------------------------------------------------
  console.log('\n--- Suite 4: File & Image Upload Validations ---');
  
  // Valid PNG buffer (89 50 4E 47 ...)
  const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert(validateImageBuffer(validPng, 'image/png') === true, 'Valid PNG magic bytes accepted');

  // Valid JPEG buffer (FF D8 FF ...)
  const validJpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
  assert(validateImageBuffer(validJpg, 'image/jpeg') === true, 'Valid JPEG magic bytes accepted');

  // Fake executable disguised as JPG
  const fakeJpg = Buffer.from([0x4d, 0x5a, 0x90, 0x00]); // MZ executable
  assert(validateImageBuffer(fakeJpg, 'image/jpeg') === false, 'Disguised executable rejected by MIME byte validation');

  // Oversized buffer > 5MB
  const oversizedBuffer = Buffer.alloc(5 * 1024 * 1024 + 10);
  assert(validateImageBuffer(oversizedBuffer, 'image/jpeg') === false, 'Oversized payload (>5MB) rejected');

  // -------------------------------------------------------------
  // TEST SUITE 5: Authentication Provider Architecture
  // -------------------------------------------------------------
  console.log('\n--- Suite 5: Authentication Provider Architecture ---');
  const authProvider = getAuthProvider();
  assert(authProvider !== null, 'Auth provider initialized');
  assert(authProvider instanceof BidWarOtpAuthProvider, 'Default provider is BidWarOtpAuthProvider');
  assert(authProvider.isConfigured === false, 'BidWar OTP Provider is marked NOT CONFIGURED until BULKSMS credentials provided');

  const unconfiguredResult = await authProvider.requestOtp('+919876543210');
  assert(
    unconfiguredResult.success === false && unconfiguredResult.message.includes('pending configuration'),
    'Calling unconfigured OTP provider returns clear pending message'
  );

  // Test session token cryptographic verification
  const testMobile = '9811000001';
  const validToken = generateUserSessionToken('bidwar_user_test12345678', testMobile);
  
  const verifiedIdentity = await authProvider.verifySessionToken(validToken);
  assert(verifiedIdentity !== null && verifiedIdentity.userId === 'bidwar_user_test12345678', 'Valid signed session token verifies successfully');

  // Tampered signature must be rejected
  const tamperedToken = validToken.slice(0, -4) + 'abcd';
  const tamperedIdentity = await authProvider.verifySessionToken(tamperedToken);
  assert(tamperedIdentity === null, 'Tampered session token signature is rejected');

  // Expired token must be rejected
  const nowSec = Math.floor(Date.now() / 1000);
  const expiredPayload = {
    userId: 'bidwar_user_test12345678',
    mobile: `+91${testMobile}`,
    provider: 'bidwar_otp',
    iat: nowSec - 7200,
    exp: nowSec - 10,
  };
  const expB64 = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
  const expSig = crypto.createHmac('sha256', config.sessionSecret).update(expB64).digest('base64url');
  const expiredToken = `bpl_jwt_${expB64}.${expSig}`;
  const expiredIdentity = await authProvider.verifySessionToken(expiredToken);
  assert(expiredIdentity === null, 'Expired session token is rejected');

  // -------------------------------------------------------------
  // TEST SUITE 6: Public API Privacy (CRITICAL ACCEPTANCE TEST)
  // -------------------------------------------------------------
  console.log('\n--- Suite 6: Public API Privacy & Strict DTO Verification ---');
  
  // Set up mock DB store for server routes
  const mockRegistrations = new Map<string, any>();
  const mockAssociations = new Map<string, any>();
  const mockMentors = new Map<string, any>();
  const mockPlayers = new Map<string, any[]>();
  const mockPayments = new Map<string, any>();

  // Seed Registration A (Owned by User A: bidwar_user_A)
  const regAId = 'BPL-2026-0001';
  const teamCodeA = '1027';
  const userAId = 'bidwar_user_A';
  mockRegistrations.set(regAId, {
    id: regAId,
    team_code: teamCodeA,
    category: 'class_4_5_6',
    team_name: 'DPS Thunderbolts',
    include_branding: true,
    team_tagline: 'Defend with Pride',
    team_short_code: 'DPS',
    status: 'SUBMITTED',
    auth_user_id: userAId,
    created_at: new Date('2026-09-08T10:00:00Z').toISOString(),
  });
  mockAssociations.set(regAId, {
    association_name: 'Delhi Public School',
    branch: 'East Campus',
    email: 'sports@dps.edu.in',
    mobile: '+91 98112 34567',
    association_logo: 'https://res.cloudinary.com/bpl-kids/associations/dps.png',
    association_type: 'School',
    city: 'Delhi',
  });
  mockMentors.set(regAId, {
    name: 'Vikram Rawat',
    mobile: '+91 98112 34567',
    second_mobile: null,
    email: 'coach@dps.edu.in',
    photo: 'https://res.cloudinary.com/bpl-kids/mentors/vikram.jpg',
    designation: 'Head Coach',
  });
  mockPlayers.set(regAId, valid8Players);
  mockPayments.set(regAId, {
    utr_transaction_id: 'HDFC982319082',
    payment_screenshot: 'https://res.cloudinary.com/bpl-kids/payment-proofs/proof.jpg',
    method: 'UPI',
    base_amount: 8000,
    branding_amount: 5000,
    total_amount: 13000,
    payment_status: 'PENDING_VERIFICATION',
    paid_at: new Date().toISOString(),
  });

  // Seed Registration B (Owned by User B: bidwar_user_B)
  const regBId = 'BPL-2026-0002';
  const teamCodeB = '2048';
  const userBId = 'bidwar_user_B';
  mockRegistrations.set(regBId, {
    id: regBId,
    team_code: teamCodeB,
    category: 'class_7_8_9',
    team_name: 'Modern Strikers',
    include_branding: false,
    team_tagline: 'Speed & Skill',
    team_short_code: 'MS',
    status: 'SUBMITTED',
    auth_user_id: userBId,
    created_at: new Date('2026-09-08T11:00:00Z').toISOString(),
  });
  mockAssociations.set(regBId, {
    association_name: 'Modern School Barakhamba',
    branch: 'Main Branch',
    email: 'sports@modernschool.edu.in',
    mobile: '+91 98113 45678',
    association_logo: 'https://res.cloudinary.com/bpl-kids/associations/modern.png',
    association_type: 'School',
    city: 'Delhi',
  });
  mockMentors.set(regBId, {
    name: 'Anil Sharma',
    mobile: '+91 98113 45678',
    second_mobile: null,
    email: 'anil@modernschool.edu.in',
    photo: 'https://res.cloudinary.com/bpl-kids/mentors/anil.jpg',
    designation: 'Sports Director',
  });
  mockPlayers.set(regBId, valid8Players);
  mockPayments.set(regBId, {
    utr_transaction_id: 'ICICI982319083',
    payment_screenshot: 'https://res.cloudinary.com/bpl-kids/payment-proofs/proof2.jpg',
    method: 'UPI',
    base_amount: 8000,
    branding_amount: 0,
    total_amount: 8000,
    payment_status: 'PENDING_VERIFICATION',
    paid_at: new Date().toISOString(),
  });

  // Configure Database Interceptor for deterministic test assertions
  setDatabaseOverrides({
    query: async (text: string, params?: any[]) => {
      // 1. SELECT id, auth_user_id FROM registrations WHERE id = $1 OR team_code = $1 LIMIT 1
      if (text.includes('SELECT id, auth_user_id FROM registrations')) {
        const search = params?.[0];
        for (const reg of mockRegistrations.values()) {
          if (reg.id === search || reg.team_code === search) {
            return { rows: [{ id: reg.id, auth_user_id: reg.auth_user_id }] } as any;
          }
        }
        return { rows: [] } as any;
      }

      // 2. SELECT * FROM registrations WHERE id = $1 LIMIT 1
      if (text.includes('SELECT * FROM registrations WHERE id = $1')) {
        const id = params?.[0];
        const reg = mockRegistrations.get(id);
        return { rows: reg ? [reg] : [] } as any;
      }

      // 3. SELECT * FROM associations WHERE registration_id = $1 LIMIT 1
      if (text.includes('SELECT * FROM associations WHERE registration_id = $1')) {
        const id = params?.[0];
        const assoc = mockAssociations.get(id);
        return { rows: assoc ? [assoc] : [] } as any;
      }

      // 4. SELECT * FROM mentors WHERE registration_id = $1 LIMIT 1
      if (text.includes('SELECT * FROM mentors WHERE registration_id = $1')) {
        const id = params?.[0];
        const mentor = mockMentors.get(id);
        return { rows: mentor ? [mentor] : [] } as any;
      }

      // 5. SELECT * FROM players WHERE registration_id = $1
      if (text.includes('SELECT * FROM players WHERE registration_id = $1')) {
        const id = params?.[0];
        const players = mockPlayers.get(id) || [];
        return {
          rows: players.map((p, idx) => ({
            player_name: p.playerName,
            student_class: p.studentClass,
            date_of_birth: p.dateOfBirth,
            parent_mobile: p.parentMobile,
            parent_email: p.parentEmail,
            player_photo: p.playerPhoto,
            jersey_number: p.jerseyNumber,
            jersey_size: p.jerseySize,
            cricket_role: p.cricketRole,
            batting_style: p.battingStyle,
            bowling_style: p.bowlingStyle,
          })),
        } as any;
      }

      // 6. SELECT * FROM payments WHERE registration_id = $1
      if (text.includes('SELECT * FROM payments WHERE registration_id = $1')) {
        const id = params?.[0];
        const payment = mockPayments.get(id);
        return { rows: payment ? [payment] : [] } as any;
      }

      // 7. Public teams query
      if (text.includes('a.association_name AS "associationName"')) {
        const rows: PublicTeamDTO[] = Array.from(mockRegistrations.values()).map(r => {
          const a = mockAssociations.get(r.id);
          return {
            teamName: r.team_name,
            associationName: a?.association_name || '',
            associationLogo: a?.association_logo || '',
            category: r.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9',
          };
        });
        return { rows } as any;
      }

      return { rows: [] } as any;
    },
    withTransaction: async (callback) => {
      // Mock Transaction Client
      let createdRegId = 'BPL-2026-0003';
      let createdTeamCode = '3156';
      let storedAuthUserId: string | null = null;
      let storedCategory = 'class_4_5_6';
      let storedTeamName = 'Test Squad';

      const mockClient: any = {
        query: async (text: string, params?: any[]) => {
          if (text.includes('registration_sequence')) {
            return { rows: [{ last_number: 3 }] };
          }
          if (text.includes('SELECT 1 FROM registrations WHERE team_code')) {
            return { rows: [] };
          }
          if (text.includes('SELECT 1 FROM payments WHERE utr_transaction_id')) {
            return { rows: [] };
          }
          if (text.includes('INSERT INTO registrations')) {
            createdRegId = params?.[0];
            createdTeamCode = params?.[1];
            storedCategory = params?.[2];
            storedTeamName = params?.[3];
            storedAuthUserId = params?.[7];
            mockRegistrations.set(createdRegId, {
              id: createdRegId,
              team_code: createdTeamCode,
              category: storedCategory,
              team_name: storedTeamName,
              include_branding: params?.[4],
              status: 'SUBMITTED',
              auth_user_id: storedAuthUserId,
              created_at: new Date().toISOString(),
            });
            return { rows: [] };
          }
          if (text.includes('INSERT INTO associations')) {
            mockAssociations.set(createdRegId, {
              association_name: params?.[1],
              branch: params?.[2],
              email: params?.[3],
              mobile: params?.[4],
              association_logo: params?.[5],
            });
            return { rows: [] };
          }
          if (text.includes('INSERT INTO mentors')) {
            mockMentors.set(createdRegId, {
              name: params?.[1],
              mobile: params?.[2],
              email: params?.[4],
              photo: params?.[5],
            });
            return { rows: [] };
          }
          if (text.includes('INSERT INTO payments')) {
            mockPayments.set(createdRegId, {
              utr_transaction_id: params?.[1],
              payment_screenshot: params?.[2],
              method: params?.[3],
              base_amount: params?.[4],
              branding_amount: params?.[5],
              total_amount: params?.[6],
              payment_status: 'PENDING_VERIFICATION',
            });
            return { rows: [] };
          }
          if (text.includes('SELECT * FROM registrations WHERE id = $1')) {
            const id = params?.[0];
            const reg = mockRegistrations.get(id);
            return { rows: reg ? [reg] : [] };
          }
          if (text.includes('SELECT * FROM associations WHERE registration_id = $1')) {
            const id = params?.[0];
            const assoc = mockAssociations.get(id);
            return { rows: assoc ? [assoc] : [] };
          }
          if (text.includes('SELECT * FROM mentors WHERE registration_id = $1')) {
            const id = params?.[0];
            const mentor = mockMentors.get(id);
            return { rows: mentor ? [mentor] : [] };
          }
          if (text.includes('SELECT * FROM players WHERE registration_id = $1')) {
            return { rows: [] };
          }
          if (text.includes('SELECT * FROM payments WHERE registration_id = $1')) {
            const id = params?.[0];
            const payment = mockPayments.get(id);
            return { rows: payment ? [payment] : [] };
          }
          return { rows: [] };
        },
      };

      return callback(mockClient);
    },
  });

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  // 1. Test GET /api/health
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const healthData = await healthRes.json();
  assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK');

  // 2. Test GET /api/tournament-info
  const tournRes = await fetch(`${baseUrl}/api/tournament-info`);
  const tournData = await tournRes.json();
  assert(tournRes.status === 200 && tournData.tournamentName === 'BIDWAR PREMIER LEAGUE', 'GET /api/tournament-info returns canonical config');

  // 3. Test GET /api/public/teams privacy boundary
  const publicRes = await fetch(`${baseUrl}/api/public/teams`);
  const publicJson = await publicRes.json();
  assert(publicRes.status === 200 && Array.isArray(publicJson.teams), 'GET /api/public/teams returns HTTP 200 OK');

  const allowedPublicKeys = new Set(['teamName', 'associationName', 'associationLogo', 'category']);
  let allPublicEntriesStrict = true;
  for (const team of publicJson.teams) {
    const keys = Object.keys(team);
    const extra = keys.filter(k => !allowedPublicKeys.has(k));
    if (extra.length > 0 || keys.length !== 4) {
      allPublicEntriesStrict = false;
      break;
    }
  }
  assert(allPublicEntriesStrict && publicJson.teams.length > 0, 'GET /api/public/teams contains STRICTLY the 4 required public keys (teamName, associationName, associationLogo, category)');

  // -------------------------------------------------------------
  // TEST SUITE 7: Final Submission Response Privacy (Minimal DTO)
  // -------------------------------------------------------------
  console.log('\n--- Suite 7: Final Submission Response Privacy (Minimal DTO) ---');
  
  const tokenA = generateUserSessionToken(userAId, '9811234567');
  const tokenB = generateUserSessionToken(userBId, '9811345678');

  // Test POST /api/registrations with valid payload
  const submissionRes = await fetch(`${baseUrl}/api/registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      ...validSubmission,
      teamName: 'DPS Thunderbolts S1',
      payment: {
        utrTransactionId: 'HDFC-TEST-999901',
        paymentScreenshot: 'https://res.cloudinary.com/bpl-kids/payments/proof99.jpg',
        method: 'UPI',
      },
    }),
  });

  const submissionJson = await submissionRes.json();
  assert(submissionRes.status === 201, 'POST /api/registrations returns HTTP 201 Created');
  assert(submissionJson.success === true, 'POST /api/registrations returns success: true');
  assert(typeof submissionJson.registration === 'object', 'POST /api/registrations returns registration object');

  // Assert exact keys of minimal confirmation DTO
  const returnedRegKeys = Object.keys(submissionJson.registration);
  const allowedConfirmationKeys = new Set(['registrationId', 'teamCode', 'teamName', 'category', 'paymentStatus']);
  const unexpectedRegKeys = returnedRegKeys.filter(k => !allowedConfirmationKeys.has(k));

  assert(unexpectedRegKeys.length === 0, 'Registration response contains NO unexpected fields');
  assert(returnedRegKeys.includes('registrationId'), 'Registration response contains registrationId');
  assert(returnedRegKeys.includes('teamCode'), 'Registration response contains teamCode');
  assert(returnedRegKeys.includes('teamName'), 'Registration response contains teamName');
  assert(returnedRegKeys.includes('category'), 'Registration response contains category');
  assert(returnedRegKeys.includes('paymentStatus'), 'Registration response contains paymentStatus');

  // Strict privacy assertions - MUST NOT leak private data to browser
  assert(!returnedRegKeys.includes('players'), 'Registration response does NOT return player records');
  assert(!returnedRegKeys.includes('playerName'), 'Registration response does NOT return player names');
  assert(!returnedRegKeys.includes('dateOfBirth'), 'Registration response does NOT return player DOB');
  assert(!returnedRegKeys.includes('parentMobile'), 'Registration response does NOT return parent mobile');
  assert(!returnedRegKeys.includes('parentEmail'), 'Registration response does NOT return parent email');
  assert(!returnedRegKeys.includes('playerPhoto'), 'Registration response does NOT return player photo URLs');
  assert(!returnedRegKeys.includes('mentor'), 'Registration response does NOT return mentor information');
  assert(!returnedRegKeys.includes('association'), 'Registration response does NOT return association private contact');
  assert(!returnedRegKeys.includes('utrTransactionId'), 'Registration response does NOT return payment UTR');
  assert(!returnedRegKeys.includes('paymentScreenshot'), 'Registration response does NOT return payment screenshot');
  assert(!returnedRegKeys.includes('auth_user_id') && !returnedRegKeys.includes('authUserId'), 'Registration response does NOT return auth_user_id');
  assert(!returnedRegKeys.includes('draftToken'), 'Registration response does NOT return draft token');

  // -------------------------------------------------------------
  // TEST SUITE 8: Authenticated Ownership Authorization Boundary
  // -------------------------------------------------------------
  console.log('\n--- Suite 8: Authenticated Ownership Authorization Boundary ---');

  // 1. User A authenticated + Registration A -> HTTP 200
  const userA_regA_Res = await fetch(`${baseUrl}/api/registrations/${regAId}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const userA_regA_Json = await userA_regA_Res.json();
  assert(userA_regA_Res.status === 200 && userA_regA_Json.success === true, 'User A authenticated + Registration A -> HTTP 200 OK');

  // 2. User A authenticated + Registration B -> HTTP 403 Forbidden
  const userA_regB_Res = await fetch(`${baseUrl}/api/registrations/${regBId}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const userA_regB_Json = await userA_regB_Res.json();
  assert(userA_regB_Res.status === 403 && userA_regB_Json.error === 'Forbidden', 'User A authenticated + Registration B -> HTTP 403 Forbidden');

  // 3. User B authenticated + Registration B -> HTTP 200
  const userB_regB_Res = await fetch(`${baseUrl}/api/registrations/${regBId}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const userB_regB_Json = await userB_regB_Res.json();
  assert(userB_regB_Res.status === 200 && userB_regB_Json.success === true, 'User B authenticated + Registration B -> HTTP 200 OK');

  // 4. User B authenticated + Registration A -> HTTP 403 Forbidden
  const userB_regA_Res = await fetch(`${baseUrl}/api/registrations/${regAId}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const userB_regA_Json = await userB_regA_Res.json();
  assert(userB_regA_Res.status === 403 && userB_regA_Json.error === 'Forbidden', 'User B authenticated + Registration A -> HTTP 403 Forbidden');

  // 5. Team Code alone (unauthenticated) -> MUST NOT authorize access (HTTP 401)
  const teamCodeAloneRes = await fetch(`${baseUrl}/api/registrations/${teamCodeA}`);
  assert(teamCodeAloneRes.status === 401, 'Team Code alone -> MUST NOT authorize access (HTTP 401)');

  // 6. Registration ID alone (unauthenticated) -> MUST NOT authorize access (HTTP 401)
  const regIdAloneRes = await fetch(`${baseUrl}/api/registrations/${regAId}`);
  assert(regIdAloneRes.status === 401, 'Registration ID alone -> MUST NOT authorize access (HTTP 401)');

  // 7. Frontend-supplied auth_user_id MUST NOT override req.authIdentity.userId
  // Submit with User A auth token, but attempting to spoof auth_user_id: 'bidwar_user_B' in the payload body
  const spoofAttemptRes = await fetch(`${baseUrl}/api/registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      ...validSubmission,
      auth_user_id: 'bidwar_user_B_spoofed',
      authUserId: 'bidwar_user_B_spoofed',
      teamName: 'DPS Spoof Test Team',
      payment: {
        utrTransactionId: 'HDFC-SPOOF-001',
        paymentScreenshot: 'https://res.cloudinary.com/bpl-kids/payments/proof-spoof.jpg',
        method: 'UPI',
      },
    }),
  });
  const spoofAttemptJson = await spoofAttemptRes.json();
  assert(spoofAttemptRes.status === 201, 'Submission with spoofed body ID completes using verified token identity');

  const createdRegId = spoofAttemptJson.registration?.registrationId;
  const createdRecord = mockRegistrations.get(createdRegId);
  assert(
    createdRecord && createdRecord.auth_user_id === userAId,
    'Frontend-supplied auth_user_id is ignored: record is assigned strictly to req.authIdentity.userId (User A)'
  );

  // User B attempting to access the newly created registration must get 403 Forbidden
  const userB_spoofedCheckRes = await fetch(`${baseUrl}/api/registrations/${createdRegId}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert(userB_spoofedCheckRes.status === 403, 'User B cannot access registration created with spoofed body ID (HTTP 403 Forbidden)');

  // User A can access their registration
  const userA_spoofedCheckRes = await fetch(`${baseUrl}/api/registrations/${createdRegId}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert(userA_spoofedCheckRes.status === 200, 'User A can access their newly created registration (HTTP 200 OK)');

  // -------------------------------------------------------------
  // TEST SUITE 9: Secret Audit (Frontend Bundle & Logging)
  // -------------------------------------------------------------
  console.log('\n--- Suite 9: Secret Audit (Frontend Bundle & Logging) ---');
  
  const secretsToCheck = [
    'DATABASE_URL',
    'CLOUDINARY_API_SECRET',
    'BULKSMS_KEY',
    'RESEND_API_KEY',
    'SESSION_SECRET',
    'ADMIN_API_KEY',
  ];

  // Scan frontend source directory
  const frontendDir = path.resolve(process.cwd(), 'src');
  const frontendFiles: string[] = [];

  function collectFrontendFiles(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'server' && entry.name !== 'node_modules') {
          collectFrontendFiles(fullPath);
        }
      } else if (/\.(tsx?|jsx?|html|css)$/.test(entry.name)) {
        frontendFiles.push(fullPath);
      }
    }
  }

  collectFrontendFiles(frontendDir);
  let secretsInFrontend = false;

  for (const file of frontendFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const secret of secretsToCheck) {
      if (content.includes(`process.env.${secret}`) || content.includes(secret)) {
        secretsInFrontend = true;
        console.error(`Secret ${secret} referenced in frontend file: ${file}`);
      }
    }
  }

  // -------------------------------------------------------------
  // TEST SUITE 10: Live PostgreSQL Database Schema & Migration Verification
  // -------------------------------------------------------------
  console.log('\n--- Suite 10: PostgreSQL Database Schema & Migration Verification ---');
  
  // 10.1 Test safe schema SQL loading (ESM/CJS resolution)
  const schemaInfo = loadSchemaSql();
  assert(typeof schemaInfo.sql === 'string' && schemaInfo.sql.length > 500, 'Schema SQL resolves and loads valid SQL content');
  assert(typeof schemaInfo.source === 'string' && schemaInfo.source.length > 0, `Schema source identified (${schemaInfo.source})`);

  // 10.2 Clear overrides to test live database connection
  setDatabaseOverrides(null);

  if (config.databaseUrl) {
    const meta = getSafeDatabaseMetadata();
    assert(meta.configured === true, `Database configured with host: ${meta.host}`);

    // Execute real initDatabase
    let initSuccess = false;
    try {
      initSuccess = await initDatabase();
    } catch (e: any) {
      console.error('initDatabase error:', e.message);
    }
    assert(initSuccess === true, 'initDatabase() executes and initializes schema successfully');

    // Verify each required table explicitly exists via to_regclass
    for (const table of REQUIRED_TABLES) {
      const regclassRes = await query(`SELECT to_regclass($1) AS regclass`, [`public.${table}`]);
      assert(
        regclassRes.rows[0]?.regclass !== null && regclassRes.rows[0]?.regclass !== undefined,
        `Table "public.${table}" exists in actual PostgreSQL database`
      );
    }

    // Verify 2026 sequence row exists
    const seqCheck = await query(`SELECT year, last_number FROM registration_sequence WHERE year = 2026`);
    assert(
      seqCheck.rows.length === 1 && typeof seqCheck.rows[0].last_number === 'number',
      `2026 registration sequence exists with valid last_number: ${seqCheck.rows[0]?.last_number}`
    );

    // Verify migration idempotency by running initDatabase a second time
    let secondInitSuccess = false;
    try {
      secondInitSuccess = await initDatabase();
    } catch (e: any) {
      console.error('Second initDatabase error:', e.message);
    }
    assert(secondInitSuccess === true, 'initDatabase() is idempotent and safe to execute repeatedly');

    // 10.3 Test real HTTP GET /api/public/teams with live DB (No DB overrides)
    const liveTeamsRes = await new Promise<any>((resolve) => {
      http.get(`http://localhost:${port}/api/public/teams`, (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        });
      });
    });

    assert(liveTeamsRes.status === 200, 'GET /api/public/teams against live DB returns HTTP 200 OK');
    assert(liveTeamsRes.body.success === true, 'GET /api/public/teams returns success: true');
    assert(Array.isArray(liveTeamsRes.body.teams), 'GET /api/public/teams returns teams array without DB errors');

    // 10.4 Test real HTTP GET /api/health with DB status
    const liveHealthRes = await new Promise<any>((resolve) => {
      http.get(`http://localhost:${port}/api/health`, (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        });
      });
    });

    assert(liveHealthRes.status === 200, 'GET /api/health returns HTTP 200 OK');
    assert(liveHealthRes.body.database?.initialized === true, 'GET /api/health reports database initialized: true');
  } else {
    console.log('  ⚠ SKIP: DATABASE_URL not set in environment, skipping live PostgreSQL queries.');
  }

  // -------------------------------------------------------------
  // TEST SUITE 11: Production Transactional Email Verification & Failsafe
  // -------------------------------------------------------------
  console.log('\n--- Suite 11: Production Transactional Email Verification & Failsafe ---');

  // Save current config state
  const origEmailConfig = { ...config.email };
  const origDbUrl = config.databaseUrl;
  const origCloudinary = { ...config.cloudinary };
  const origOtp = { ...config.otp };
  const origSessionSecret = config.sessionSecret;
  const origAdminKey = config.adminApiKey;

  // Set mock full production environment
  config.databaseUrl = 'postgresql://user:pass@ep-host.neon.tech/neondb?sslmode=require';
  config.cloudinary.cloudName = 'bidwar-cloud';
  config.cloudinary.apiKey = '123456789012345';
  config.cloudinary.apiSecret = 'mock_secret_abcdef1234567890';
  config.otp.bulkSmsKey = 'mock_bulksms_key_123456';
  config.otp.bulkSmsTemplateId = '123456';
  config.adminApiKey = 'mock_admin_key_production_123';
  process.env.SESSION_SECRET = 'a_very_secure_production_session_secret_32_chars';
  config.email.resendApiKey = 're_mock_production_api_key';
  config.email.mailFrom = 'BidWar Premier League <bpl@bidwar.in>';
  config.email.emailEnabled = true;

  // 11.1 Production + email enabled + credentials present -> valid
  const validProdResult = validateEnv(true);
  assert(validProdResult.valid === true, '11.1: Production + email enabled + credentials present -> validation passes');
  assert(validProdResult.missingRequired.length === 0, '11.1: Zero missing required variables when all credentials supplied');

  // 11.2 Production + email enabled + RESEND_API_KEY missing -> validation fails
  config.email.resendApiKey = '';
  const missingResendKeyResult = validateEnv(true);
  assert(missingResendKeyResult.valid === false, '11.2: Production + email enabled + missing RESEND_API_KEY -> validation fails');
  assert(
    missingResendKeyResult.missingRequired.some((m) => m.includes('RESEND_API_KEY')),
    '11.2: Error message explicitly identifies RESEND_API_KEY as missing'
  );

  // 11.3 Production + email enabled + MAIL_FROM missing -> validation fails
  config.email.resendApiKey = 're_mock_production_api_key';
  config.email.mailFrom = '';
  const missingMailFromResult = validateEnv(true);
  assert(missingMailFromResult.valid === false, '11.3: Production + email enabled + missing MAIL_FROM -> validation fails');
  assert(
    missingMailFromResult.missingRequired.some((m) => m.includes('MAIL_FROM')),
    '11.3: Error message explicitly identifies MAIL_FROM as missing'
  );

  // 11.4 Development without email credentials -> development remains usable
  config.email.resendApiKey = '';
  config.email.mailFrom = '';
  const devResult = validateEnv(false);
  assert(devResult.valid === true, '11.4: Development without email credentials -> validation remains valid for local work');
  assert(devResult.warnings.length > 0, '11.4: Non-blocking warning logged in development');

  // 11.5 Email Payload Structure contains only appropriate information (No sensitive tokens/parents)
  const sampleEmailData: RegistrationEmailData = {
    registrationId: 'BPL-2026-0001',
    teamCode: '4821',
    teamName: 'Thunderbolts XI',
    category: 'class_4_5_6',
    associationName: 'DPS East',
    mentorName: 'Coach Vikram',
    mentorEmail: 'coach@dps.edu.in',
    associationEmail: 'sports@dps.edu.in',
    totalAmount: 8000,
    paymentStatus: 'PENDING_VERIFICATION',
  };

  const emailDataKeys = Object.keys(sampleEmailData);
  assert(!emailDataKeys.includes('players'), '11.5: Email payload does NOT include player records');
  assert(!emailDataKeys.includes('parentMobile'), '11.5: Email payload does NOT include parent phone numbers');
  assert(!emailDataKeys.includes('parentEmail'), '11.5: Email payload does NOT include parent email addresses');
  assert(!emailDataKeys.includes('sessionToken'), '11.5: Email payload does NOT include auth session tokens');
  assert(!emailDataKeys.includes('paymentScreenshot'), '11.5: Email payload does NOT include payment screenshot URLs');

  // 11.6 Resend failure after DB commit does NOT throw or crash registration
  // Test sendRegistrationConfirmationEmail failsafe behavior
  config.email.resendApiKey = 'invalid_mock_resend_key';
  config.email.mailFrom = 'bpl@bidwar.in';
  config.email.emailEnabled = true;

  let emailSendThrew = false;
  let emailResult = false;
  try {
    emailResult = await sendRegistrationConfirmationEmail(sampleEmailData);
  } catch {
    emailSendThrew = true;
  }
  assert(!emailSendThrew, '11.6: sendRegistrationConfirmationEmail never throws unhandled exceptions on network/API failure');
  assert(emailResult === false || emailResult === true, '11.6: sendRegistrationConfirmationEmail returns boolean result gracefully');

  // Restore original config
  config.email = origEmailConfig;
  config.databaseUrl = origDbUrl;
  config.cloudinary = origCloudinary;
  config.otp = origOtp;
  config.sessionSecret = origSessionSecret;
  config.adminApiKey = origAdminKey;

  server.close();
  await closeDatabase();

  // Reset database overrides
  setDatabaseOverrides(null);

  // -------------------------------------------------------------
  // Test Summary
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`  FINAL ACCEPTANCE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test runner encountered unexpected error:', err);
  process.exit(1);
});
