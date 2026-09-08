import { Router } from 'express';
import { verifyPaymentByAdmin, getRegistrationById } from '../db/registrations';
import { requireAdminKey } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';

export const adminRoutes = Router();

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
