import { Router } from 'express';
import { getAuthProvider } from '../services/auth';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';
import { publicApiLimiter } from '../middleware/rateLimiter';

export const authRoutes = Router();

// 1. Request Mobile OTP
authRoutes.post('/auth/otp/send', publicApiLimiter, async (req, res, next) => {
  try {
    const { mobile, purpose } = req.body;
    if (!mobile || typeof mobile !== 'string') {
      res.status(400).json({ success: false, message: 'Mobile number is required.' });
      return;
    }

    const provider = getAuthProvider();
    const result = await provider.requestOtp(mobile.trim(), purpose || 'bpl_registration');

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  } catch (err: any) {
    next(err);
  }
});

// 2. Verify Mobile OTP
authRoutes.post('/auth/otp/verify', publicApiLimiter, async (req, res, next) => {
  try {
    const { mobile, otp, purpose } = req.body;
    if (!mobile || !otp) {
      res.status(400).json({ success: false, message: 'Mobile and OTP are required.' });
      return;
    }

    const provider = getAuthProvider();
    const result = await provider.verifyOtp(mobile.trim(), otp.trim(), purpose || 'bpl_registration');

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  } catch (err: any) {
    next(err);
  }
});

// 3. Current Authenticated Session
authRoutes.get('/auth/me', optionalAuth, (req: AuthenticatedRequest, res) => {
  if (!req.authIdentity) {
    res.json({ authenticated: false, identity: null });
    return;
  }

  res.json({
    authenticated: true,
    identity: req.authIdentity,
  });
});
