import { Router } from 'express';
import {
  verifyPaymentByAdmin,
  rejectPaymentByAdmin,
  getRegistrationById,
  getAllRegistrationsForAdmin,
  getAdminDashboardStats
} from '../db/registrations';
import { requireAdminKey } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';
import { triggerPaymentVerifiedEmails } from '../services/emailService';

export const adminRoutes = Router();

// Validate Admin Key
adminRoutes.post(
  '/admin/verify-key',
  adminLimiter,
  requireAdminKey,
  async (_req, res) => {
    res.json({
      success: true,
      message: 'Admin credentials authenticated successfully.',
    });
  }
);

// Get Aggregate Admin Statistics
adminRoutes.get(
  '/admin/stats',
  adminLimiter,
  requireAdminKey,
  async (_req, res, next) => {
    try {
      const stats = await getAdminDashboardStats();
      res.json({
        success: true,
        stats,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

// Get All Registrations with optional filtering
adminRoutes.get(
  '/admin/registrations',
  adminLimiter,
  requireAdminKey,
  async (req, res, next) => {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const paymentStatus = typeof req.query.paymentStatus === 'string' ? req.query.paymentStatus : undefined;
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;

      const registrations = await getAllRegistrationsForAdmin({
        category,
        paymentStatus,
        search,
      });

      res.json({
        success: true,
        count: registrations.length,
        registrations,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

// Get Single Registration Record for Admin
adminRoutes.get(
  '/admin/registrations/:id',
  adminLimiter,
  requireAdminKey,
  async (req, res, next) => {
    try {
      const registrationId = req.params.id;
      const registration = await getRegistrationById(registrationId);
      if (!registration) {
        res.status(404).json({
          success: false,
          error: 'RegistrationNotFound',
          message: `Registration ${registrationId} not found.`,
        });
        return;
      }

      res.json({
        success: true,
        registration,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

// Admin Payment Verification
adminRoutes.post(
  '/admin/registrations/:id/verify-payment',
  adminLimiter,
  requireAdminKey,
  async (req, res, next) => {
    try {
      const registrationId = req.params.id;
      const verifiedBy = (req.body.verifiedBy || 'Tournament Committee Admin').trim();

      const success = await verifyPaymentByAdmin(registrationId, verifiedBy);
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'RegistrationNotFound',
          message: `Registration ${registrationId} not found or could not be updated.`,
        });
        return;
      }

      // Trigger payment verified email workflow (payment confirmation + rules)
      triggerPaymentVerifiedEmails(registrationId)
        .catch((err) => console.error('[Admin Email Error]', err.message));

      const updated = await getRegistrationById(registrationId);
      res.json({
        success: true,
        message: `Payment verified successfully for ${registrationId}.`,
        registration: updated,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

// Admin Payment Rejection
adminRoutes.post(
  '/admin/registrations/:id/reject-payment',
  adminLimiter,
  requireAdminKey,
  async (req, res, next) => {
    try {
      const registrationId = req.params.id;
      const rejectedBy = (req.body.rejectedBy || 'Tournament Committee Admin').trim();
      const reason = req.body.reason ? String(req.body.reason).trim() : undefined;

      const success = await rejectPaymentByAdmin(registrationId, rejectedBy, reason);
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'RegistrationNotFound',
          message: `Registration ${registrationId} not found or could not be updated.`,
        });
        return;
      }

      const updated = await getRegistrationById(registrationId);
      res.json({
        success: true,
        message: `Payment marked as rejected for ${registrationId}.`,
        registration: updated,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

