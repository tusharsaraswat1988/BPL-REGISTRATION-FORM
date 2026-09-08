import rateLimit from 'express-rate-limit';

export const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again in a moment.' }
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Upload Rate Limit Exceeded', message: 'Too many file uploads. Please wait before retrying.' }
});

export const registrationSubmissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Submission Limit Exceeded', message: 'Too many submission requests. Please wait a moment.' }
});

export const draftLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 90,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Draft Rate Limit Exceeded', message: 'Autosave requests throttled.' }
});

export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Admin Rate Limit Exceeded' }
});
