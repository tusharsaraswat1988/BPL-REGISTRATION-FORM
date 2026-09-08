import { Router } from 'express';
import {
  createRegistrationTransaction,
  getRegistrationById,
  RegistrationSubmissionInput
} from '../db/registrations';
import { query } from '../db/index';
import { registrationSubmissionLimiter, publicApiLimiter } from '../middleware/rateLimiter';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';
import { triggerRegistrationCompletedEmails, triggerPaymentVerifiedEmails } from '../services/emailService';

export const registrationRoutes = Router();

// Final Submission Endpoint (Atomic Transaction)
registrationRoutes.post(
  '/registrations',
  registrationSubmissionLimiter,
  optionalAuth,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const idempotencyKey = req.headers['x-idempotency-key'] as string | undefined;
      const draftToken = req.headers['x-draft-token'] as string | undefined || req.body.draftToken;
      
      // CRITICAL: authUserId MUST come strictly from req.authIdentity.userId
      // Frontend-supplied auth_user_id or authUserId in req.body cannot override it.
      const authUserId = req.authIdentity?.userId;
      const { auth_user_id: _ignored1, authUserId: _ignored2, ...cleanedBody } = req.body || {};

      const input: RegistrationSubmissionInput = {
        ...cleanedBody,
        idempotencyKey,
        draftToken,
        authUserId,
      };

      const registration = await createRegistrationTransaction(input);

      // Async notification dispatch - failsafe outside transaction
      triggerRegistrationCompletedEmails(registration.id)
        .then(async () => {
          if (registration.payment.paymentStatus === 'VERIFIED') {
            await triggerPaymentVerifiedEmails(registration.id);
          }
        })
        .catch((err) => console.error('[Email Notification Error]', err.message));

      // Return strictly minimal confirmation DTO (NO private player, mentor, UTR, or contact details)
      res.status(201).json({
        success: true,
        message: 'Registration submitted successfully for BidWar Premier League — Kids Version Season 1.',
        registration: {
          registrationId: registration.id,
          teamCode: registration.teamCode,
          teamName: registration.teamName,
          category: registration.category,
          paymentStatus: registration.payment.paymentStatus,
        },
      });
    } catch (err: any) {
      next(err);
    }
  }
);

// Private Registration Lookup Endpoint (Requires Authenticated BidWar OTP Identity)
// Public unauthenticated lookups are rejected to prevent unauthorized enumeration.
registrationRoutes.get(
  '/registrations/:query',
  publicApiLimiter,
  optionalAuth,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      // 1. Enforce Authentication Requirement
      if (!req.authIdentity) {
        res.status(401).json({
          success: false,
          error: 'AuthenticationPending',
          message: 'Private registration lookup requires authenticated BidWar OTP identity. Authentication provider integration is currently pending.',
        });
        return;
      }

      const search = req.params.query.trim();
      if (!search) {
        res.status(400).json({ success: false, error: 'Query parameter required.' });
        return;
      }

      // 2. Look up registration in database
      const dbResult = await query(
        `SELECT id, auth_user_id FROM registrations WHERE id = $1 OR team_code = $1 LIMIT 1`,
        [search]
      );

      if (dbResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'RegistrationNotFound',
          message: `No team record matching '${search}' was found in the BPL Kids registry.`,
        });
        return;
      }

      const reg = dbResult.rows[0];

      // 3. Enforce Ownership Boundary: User can only view their own registration
      if (!reg.auth_user_id || reg.auth_user_id !== req.authIdentity.userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Access denied. You do not have authorization to view this registration record.',
        });
        return;
      }

      const full = await getRegistrationById(reg.id);
      if (!full) {
        res.status(404).json({ success: false, message: 'Registration record not found.' });
        return;
      }

      res.json({
        success: true,
        registration: full,
      });
    } catch (err: any) {
      next(err);
    }
  }
);
