import { Request, Response, NextFunction } from 'express';
import { getAuthProvider, AuthIdentity } from '../services/auth';
import { config } from '../config/env';

export interface AuthenticatedRequest extends Request {
  authIdentity?: AuthIdentity;
}

/**
 * Optional Auth middleware - Attaches authIdentity if valid session/bearer token is provided
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7).trim();
  if (!token) return next();

  try {
    const provider = getAuthProvider();
    const identity = await provider.verifySessionToken(token);
    if (identity) {
      req.authIdentity = identity;
    }
  } catch (err) {
    // Ignore invalid token in optional mode
  }

  next();
}

/**
 * Required Auth middleware
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required. BidWar OTP login pending provider integration.'
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  try {
    const provider = getAuthProvider();
    const identity = await provider.verifySessionToken(token);
    if (!identity) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired authentication session.'
      });
      return;
    }

    req.authIdentity = identity;
    next();
  } catch (err: any) {
    res.status(401).json({
      error: 'Unauthorized',
      message: err.message || 'Authentication failed.'
    });
  }
}

/**
 * Required Admin API Key middleware
 */
export function requireAdminKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-admin-api-key'] || req.headers['admin-api-key'];

  if (!config.adminApiKey || !apiKey || apiKey !== config.adminApiKey) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or missing admin credentials.'
    });
    return;
  }

  next();
}
