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
