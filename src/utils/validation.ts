/**
 * Validation utilities for BPL Registration Form
 */

export function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validates Indian 10-digit mobile number.
 * Accepts optional +91, 91, or leading 0 prefixes.
 * Standard Indian mobile numbers start with 6, 7, 8, or 9 and are 10 digits long.
 */
export function isValidIndianMobile(mobile?: string): boolean {
  if (!mobile) return false;
  const digits = extractDigits(mobile);
  
  if (digits.length === 10) {
    return /^[6-9]\d{9}$/.test(digits);
  }
  
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return /^[6-9]\d{9}$/.test(digits.slice(1));
  }

  return false;
}

export function getMobileValidationError(mobile?: string, isRequired = true): string | null {
  if (!mobile || !mobile.trim()) {
    return isRequired ? 'Mobile number is required.' : null;
  }

  const digits = extractDigits(mobile);
  if (digits.length === 0) {
    return 'Please enter a valid mobile number.';
  }

  if (digits.length < 10) {
    return `Mobile number is incomplete (${digits.length}/10 digits).`;
  }

  if (!isValidIndianMobile(mobile)) {
    return 'Must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';
  }

  return null;
}

/**
 * Standard RFC-compliant email regex validation
 */
export function isValidEmail(email?: string): boolean {
  if (!email) return false;
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed) && trimmed.includes('.') && trimmed.split('@')[1]?.includes('.');
}

export function getEmailValidationError(email?: string, isRequired = true): string | null {
  if (!email || !email.trim()) {
    return isRequired ? 'Email address is required.' : null;
  }

  if (!email.includes('@')) {
    return "Email must contain an '@' symbol.";
  }

  const parts = email.split('@');
  if (parts.length > 2) {
    return "Email cannot contain multiple '@' symbols.";
  }

  if (!parts[1] || !parts[1].includes('.')) {
    return 'Email domain must contain a valid top-level domain (e.g. .com, .in).';
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }

  return null;
}

/**
 * Official Tournament Date of Birth Rules per Class (Tournament Date: Oct 10, 2026)
 * Strict window enforced with ±1 Year allowance from standard academic age.
 */
export interface ClassDobConfig {
  minYear: number;
  maxYear: number;
  minDate: string; // 'YYYY-MM-DD'
  maxDate: string; // 'YYYY-MM-DD'
  standardAge: number;
  allowedAgeRange: string;
}

export const CLASS_DOB_LIMITS: Record<number, ClassDobConfig> = {
  4: { minYear: 2014, maxYear: 2018, minDate: '2014-01-01', maxDate: '2018-12-31', standardAge: 9, allowedAgeRange: '8 to 12 Years' },
  5: { minYear: 2013, maxYear: 2017, minDate: '2013-01-01', maxDate: '2017-12-31', standardAge: 10, allowedAgeRange: '9 to 13 Years' },
  6: { minYear: 2012, maxYear: 2016, minDate: '2012-01-01', maxDate: '2016-12-31', standardAge: 11, allowedAgeRange: '10 to 14 Years' },
  7: { minYear: 2011, maxYear: 2015, minDate: '2011-01-01', maxDate: '2015-12-31', standardAge: 12, allowedAgeRange: '11 to 15 Years' },
  8: { minYear: 2010, maxYear: 2014, minDate: '2010-01-01', maxDate: '2014-12-31', standardAge: 13, allowedAgeRange: '12 to 16 Years' },
  9: { minYear: 2009, maxYear: 2013, minDate: '2009-01-01', maxDate: '2013-12-31', standardAge: 14, allowedAgeRange: '13 to 17 Years' },
};

/**
 * Validate Player Date of Birth against selected class
 */
export function validatePlayerDob(
  dob: string | undefined, 
  studentClass: number
): { valid: boolean; error?: string; age?: number } {
  if (!dob || !dob.trim()) {
    return { valid: false, error: 'Date of Birth is required.' };
  }

  const match = dob.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return { valid: false, error: 'Invalid date format (expected YYYY-MM-DD).' };
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { valid: false, error: 'Please enter a valid calendar date.' };
  }

  const limits = CLASS_DOB_LIMITS[studentClass];
  if (limits) {
    if (year < limits.minYear || year > limits.maxYear) {
      return {
        valid: false,
        error: `For Class ${studentClass}, birth year must be between ${limits.minYear} and ${limits.maxYear} (${limits.allowedAgeRange}).`,
      };
    }
  }

  // Calculate approximate age as of tournament date (Oct 10, 2026)
  const tournamentDate = new Date(2026, 9, 10);
  const birthDate = new Date(year, month - 1, day);
  let age = tournamentDate.getFullYear() - birthDate.getFullYear();
  const m = tournamentDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && tournamentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return { valid: true, age };
}

