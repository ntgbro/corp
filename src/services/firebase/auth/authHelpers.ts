import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { COUNTRY_CODES } from '../../../config';

export interface ParsedPhoneNumber {
  countryCode: string;
  nationalNumber: string;
  fullNumber: string;
  isValid: boolean;
}

/**
 * Parse phone number and extract country code and national number
 */
export const parsePhoneNumber = (phoneNumber: string): ParsedPhoneNumber => {
  // Clean the phone number
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Try to match with country codes
  for (const country of COUNTRY_CODES) {
    if (cleanNumber.startsWith(country.dialCode)) {
      return {
        countryCode: country.dialCode,
        nationalNumber: cleanNumber.substring(country.dialCode.length),
        fullNumber: cleanNumber,
        isValid: true,
      };
    }
  }

  // If no match found, assume it's a local number or invalid
  return {
    countryCode: '+91', // Default to India
    nationalNumber: cleanNumber,
    fullNumber: cleanNumber,
    isValid: false,
  };
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phoneNumber: string, countryCode?: string): string => {
  const parsed = parsePhoneNumber(phoneNumber);

  if (!parsed.isValid) {
    return phoneNumber;
  }

  // Format: +91 98765 43210
  const nationalNumber = parsed.nationalNumber;
  if (nationalNumber.length === 10) {
    return `${parsed.countryCode} ${nationalNumber.substring(0, 5)} ${nationalNumber.substring(5)}`;
  }

  return parsed.fullNumber;
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const parsed = parsePhoneNumber(phoneNumber);
  return parsed.isValid && parsed.nationalNumber.length >= 10;
};

/**
 * Get country info from phone number
 */
export const getCountryFromPhoneNumber = (phoneNumber: string) => {
  const parsed = parsePhoneNumber(phoneNumber);
  return COUNTRY_CODES.find(country => country.dialCode === parsed.countryCode);
};

/**
 * Check if user needs to verify phone number
 */
export const shouldVerifyPhoneNumber = (user: FirebaseAuthTypes.User | null): boolean => {
  if (!user) return false;

  // Check if phone number is verified
  return !user.phoneNumber || !user.phoneNumber.length;
};

/**
 * Get user display info
 */
export const getUserDisplayInfo = (user: FirebaseAuthTypes.User | null) => {
  if (!user) return null;

  return {
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    displayName: user.displayName || user.phoneNumber || 'User',
    photoURL: user.photoURL,
    email: user.email,
    isAnonymous: user.isAnonymous,
    isVerified: !!user.phoneNumber,
    metadata: user.metadata,
  };
};

/**
 * Format auth error message
 */
export const formatAuthError = (error: any): string => {
  const errorCode = error?.code || error?.message || 'unknown_error';

  const errorMessages: Record<string, string> = {
    'auth/invalid-phone-number': 'Invalid phone number format',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
    'auth/invalid-verification-code': 'Invalid verification code',
    'auth/code-expired': 'Verification code has expired',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this phone number',
    'network-request-failed': 'Network error. Please check your connection',
    'timeout': 'Request timed out. Please try again',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred';
};

/**
 * Check if error is retryable
 */
export const isRetryableAuthError = (error: any): boolean => {
  const retryableErrors = [
    'network-request-failed',
    'timeout',
    'auth/internal-error',
    'auth/unavailable',
  ];

  return retryableErrors.includes(error?.code);
};

/**
 * Generate OTP for testing (development only)
 */
export const generateTestOTP = (): string => {
  if (__DEV__) {
    // Generate a random 6-digit OTP for testing
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  return '';
};

/**
 * Check if user is new (just registered)
 */
export const isNewUser = (user: FirebaseAuthTypes.User): boolean => {
  const creationTime = user.metadata.creationTime;
  const lastSignInTime = user.metadata.lastSignInTime;

  if (!creationTime || !lastSignInTime) return false;

  // Consider new if created and last sign in are within 5 minutes
  const creationDate = new Date(creationTime);
  const lastSignInDate = new Date(lastSignInTime);
  const diffMinutes = (lastSignInDate.getTime() - creationDate.getTime()) / (1000 * 60);

  return diffMinutes < 5;
};

export default {
  parsePhoneNumber,
  formatPhoneNumber,
  isValidPhoneNumber,
  getCountryFromPhoneNumber,
  shouldVerifyPhoneNumber,
  getUserDisplayInfo,
  formatAuthError,
  isRetryableAuthError,
  generateTestOTP,
  isNewUser,
};
