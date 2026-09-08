import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status || err.statusCode || 500;
  const isProd = config.nodeEnv === 'production';

  // Sanitize internal error messages
  let userMessage = err.message || 'An unexpected error occurred. Please try again.';
  if (err.message && (err.message.includes('pg_') || err.message.includes('syntax error') || err.message.includes('relation'))) {
    userMessage = 'A database error occurred. Please try again later.';
  }

  // Safe logging without PII
  console.error(`[API Error ${status}]`, err.message || err);

  res.status(status).json({
    success: false,
    error: err.name || 'ServerError',
    message: userMessage,
    ...(isProd ? {} : { stack: err.stack }),
  });
}
