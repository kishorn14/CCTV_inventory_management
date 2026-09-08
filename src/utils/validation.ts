/**
 * Input validation utilities for Meksha Solutions
 */

/**
 * Validates whether a phone/mobile number has at least 10 numeric digits.
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const cleanDigits = phone.replace(/[^0-9]/g, '');
  return cleanDigits.length >= 10;
}

/**
 * Returns a human-friendly validation error message or null if valid.
 */
export function getPhoneValidationError(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return 'Mobile number is required.';
  }
  const cleanDigits = phone.replace(/[^0-9]/g, '');
  if (cleanDigits.length === 0) {
    return 'Please enter digits (e.g. 9876543210).';
  }
  if (cleanDigits.length < 10) {
    return `Mobile number must be at least 10 digits (currently ${cleanDigits.length} digit${cleanDigits.length === 1 ? '' : 's'}).`;
  }
  return null;
}
