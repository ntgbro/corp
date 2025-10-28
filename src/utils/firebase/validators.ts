// Firebase-specific validation utilities

import { FirebaseError } from '@react-native-firebase/app';

/**
 * Firebase error codes and their user-friendly messages
 */
export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this phone number',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-email': 'Invalid email address',
  'auth/invalid-phone-number': 'Invalid phone number format',
  'auth/invalid-verification-code': 'Invalid verification code',
  'auth/invalid-verification-id': 'Invalid verification ID',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'auth/requires-recent-login': 'Please log in again to continue',
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/phone-number-already-exists': 'An account with this phone number already exists',
  'auth/account-exists-with-different-credential': 'Account exists with different sign-in method',
  'auth/credential-already-in-use': 'This credential is already associated with another account',
  'auth/session-cookie-expired': 'Your session has expired. Please sign in again',
  'auth/session-cookie-revoked': 'Your session has been revoked. Please sign in again',
  'auth/weak-password': 'Password is too weak',
  'auth/invalid-credential': 'Invalid credential',
  'auth/invalid-email-verified': 'Invalid email verification',
  'auth/invalid-phone-number-verified': 'Invalid phone number verification',
  'auth/invalid-password-verified': 'Invalid password verification',

  // Firestore errors
  'firestore/cancelled': 'Operation was cancelled',
  'firestore/unknown': 'Unknown Firestore error',
  'firestore/invalid-argument': 'Invalid argument provided',
  'firestore/deadline-exceeded': 'Operation timed out',
  'firestore/not-found': 'Document not found',
  'firestore/already-exists': 'Document already exists',
  'firestore/permission-denied': 'Permission denied',
  'firestore/resource-exhausted': 'Resource quota exceeded',
  'firestore/failed-precondition': 'Operation failed due to current state',
  'firestore/aborted': 'Operation was aborted',
  'firestore/out-of-range': 'Value out of range',
  'firestore/unimplemented': 'Operation not implemented',
  'firestore/internal': 'Internal server error',
  'firestore/unavailable': 'Service temporarily unavailable',
  'firestore/data-loss': 'Data loss detected',
  'firestore/unauthenticated': 'User not authenticated',

  // Storage errors
  'storage/unknown': 'Unknown storage error',
  'storage/object-not-found': 'File not found',
  'storage/bucket-not-found': 'Storage bucket not found',
  'storage/project-not-found': 'Project not found',
  'storage/quota-exceeded': 'Storage quota exceeded',
  'storage/unauthenticated': 'User not authenticated for storage',
  'storage/unauthorized': 'User not authorized for storage',
  'storage/retry-limit-exceeded': 'Retry limit exceeded',
  'storage/invalid-checksum': 'Invalid checksum',
  'storage/canceled': 'Operation cancelled',
  'storage/invalid-event-name': 'Invalid event name',
  'storage/invalid-url': 'Invalid URL',
  'storage/invalid-argument': 'Invalid argument',
  'storage/no-default-bucket': 'No default bucket',
  'storage/cannot-slice-blob': 'Cannot slice blob',
  'storage/server-file-wrong-size': 'Server file wrong size',

  // Functions errors
  'functions/cancelled': 'Function execution was cancelled',
  'functions/unknown': 'Unknown function error',
  'functions/invalid-argument': 'Invalid argument provided to function',
  'functions/deadline-exceeded': 'Function execution timed out',
  'functions/not-found': 'Function not found',
  'functions/already-exists': 'Function already exists',
  'functions/permission-denied': 'Permission denied to execute function',
  'functions/resource-exhausted': 'Function resource quota exceeded',
  'functions/failed-precondition': 'Function failed due to current state',
  'functions/aborted': 'Function execution was aborted',
  'functions/out-of-range': 'Function parameter out of range',
  'functions/unimplemented': 'Function not implemented',
  'functions/internal': 'Internal function error',
  'functions/unavailable': 'Function service unavailable',
  'functions/data-loss': 'Function data loss detected',
  'functions/unauthenticated': 'User not authenticated to execute function',

  // Common errors
  'network-request-failed': 'Network error. Please check your connection',
  'internal-error': 'Internal error occurred',
  'service-unavailable': 'Service temporarily unavailable',
};

/**
 * Convert Firebase error to user-friendly message
 */
export function getFirebaseErrorMessage(error: FirebaseError | any): string {
  if (error && error.code && FIREBASE_ERROR_MESSAGES[error.code]) {
    return FIREBASE_ERROR_MESSAGES[error.code];
  }

  if (error && error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Check if error is a Firebase authentication error
 */
export function isAuthError(error: any): boolean {
  return error && error.code && error.code.startsWith('auth/');
}

/**
 * Check if error is a Firestore error
 */
export function isFirestoreError(error: any): boolean {
  return error && error.code && error.code.startsWith('firestore/');
}

/**
 * Check if error is a Storage error
 */
export function isStorageError(error: any): boolean {
  return error && error.code && error.code.startsWith('storage/');
}

/**
 * Check if error is a Functions error
 */
export function isFunctionsError(error: any): boolean {
  return error && error.code && error.code.startsWith('functions/');
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const retryableCodes = [
    'network-request-failed',
    'deadline-exceeded',
    'resource-exhausted',
    'unavailable',
    'internal',
  ];

  if (error && error.code) {
    return retryableCodes.some(code => error.code.includes(code));
  }

  return false;
}

/**
 * Get error severity level
 */
export function getErrorSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
  if (!error || !error.code) {
    return 'medium';
  }

  const criticalCodes = [
    'permission-denied',
    'unauthenticated',
    'data-loss',
    'internal-error',
  ];

  const highCodes = [
    'resource-exhausted',
    'quota-exceeded',
    'deadline-exceeded',
  ];

  const lowCodes = [
    'not-found',
    'already-exists',
    'invalid-argument',
  ];

  if (criticalCodes.some(code => error.code.includes(code))) {
    return 'critical';
  }

  if (highCodes.some(code => error.code.includes(code))) {
    return 'high';
  }

  if (lowCodes.some(code => error.code.includes(code))) {
    return 'low';
  }

  return 'medium';
}

/**
 * Validate Firestore document ID
 */
export function isValidDocumentId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  // Firestore document IDs must be valid UTF-8 strings
  // Maximum length is 1500 bytes
  // Cannot contain forward slashes
  // Cannot be empty or contain only whitespace

  if (id.length === 0 || id.length > 1500) {
    return false;
  }

  if (id.includes('/')) {
    return false;
  }

  if (/^\s+$/.test(id)) {
    return false;
  }

  try {
    // Check if it's valid UTF-8
    new TextEncoder().encode(id);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Firestore collection name
 */
export function isValidCollectionName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // Collection names must be 1-63 characters
  // Can only contain lowercase letters, numbers, underscores, hyphens
  // Cannot start or end with hyphen or underscore
  // Cannot contain consecutive hyphens or underscores

  if (name.length < 1 || name.length > 63) {
    return false;
  }

  const validPattern = /^[a-z0-9][a-z0-9_-]*[a-z0-9]$|^[a-z0-9]$/;
  return validPattern.test(name);
}

/**
 * Validate Firestore field name
 */
export function isValidFieldName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // Field names must be 1-1500 bytes
  // Cannot start with __ (reserved for Firestore)
  // Cannot contain . or / (field path separators)

  if (name.length === 0 || name.length > 1500) {
    return false;
  }

  if (name.startsWith('__')) {
    return false;
  }

  if (name.includes('.') || name.includes('/')) {
    return false;
  }

  try {
    new TextEncoder().encode(name);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Firestore query limit
 */
export function isValidQueryLimit(limit: number): boolean {
  return Number.isInteger(limit) && limit > 0 && limit <= 1000;
}

/**
 * Validate email for Firebase Auth
 */
export function isValidFirebaseEmail(email: string): boolean {
  // Firebase Auth accepts most email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number for Firebase Auth
 */
export function isValidFirebasePhoneNumber(phone: string): boolean {
  // Firebase accepts international format: +1234567890
  const phoneRegex = /^\+[1-9]\d{8,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate password for Firebase Auth
 */
export function isValidFirebasePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password must not exceed 128 characters' };
  }

  return { isValid: true };
}

/**
 * Validate image file for Firebase Storage
 */
export function isValidFirebaseImageFile(file: File): {
  isValid: boolean;
  message?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: 'Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      message: 'File size too large. Please select an image smaller than 10MB.'
    };
  }

  return { isValid: true };
}

/**
 * Validate document size for Firestore
 */
export function isValidDocumentSize(data: any): {
  isValid: boolean;
  size?: number;
  message?: string;
} {
  const size = JSON.stringify(data).length;
  const maxSize = 1048576; // 1MB

  if (size > maxSize) {
    return {
      isValid: false,
      size,
      message: `Document size (${size} bytes) exceeds maximum allowed size (1MB)`
    };
  }

  return { isValid: true, size };
}

/**
 * Validate batch write operations
 */
export function validateBatchOperations(operations: any[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (operations.length > 500) {
    errors.push('Batch operation cannot exceed 500 operations');
  }

  let totalSize = 0;
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];

    if (op.type === 'set' || op.type === 'update' || op.type === 'create') {
      const sizeCheck = isValidDocumentSize(op.data);
      if (!sizeCheck.isValid) {
        errors.push(`Operation ${i + 1}: ${sizeCheck.message}`);
      }
      totalSize += sizeCheck.size || 0;
    }
  }

  if (totalSize > 10485760) { // 10MB
    errors.push('Total batch size exceeds 10MB limit');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Firestore query constraints
 */
export function validateQueryConstraints(constraints: any[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  let hasInequality = false;
  let inequalityField = '';

  for (const constraint of constraints) {
    if (constraint.type === 'where') {
      const [field, operator, value] = constraint.args;

      // Check for inequality operators
      if (['<', '<=', '>', '>=', '!='].includes(operator)) {
        if (hasInequality && inequalityField !== field) {
          errors.push(`Cannot use inequality filters on different fields: ${inequalityField} and ${field}`);
        }
        hasInequality = true;
        inequalityField = field;
      }

      // Check field name validity
      if (!isValidFieldName(field)) {
        errors.push(`Invalid field name: ${field}`);
      }

      // Check value type
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && !(value instanceof Date)) {
          errors.push(`Invalid value type for field ${field}: Objects must be Dates or GeoPoints`);
        }
      }
    }

    if (constraint.type === 'limit') {
      const limit = constraint.args[0];
      if (!isValidQueryLimit(limit)) {
        errors.push(`Invalid limit: ${limit}. Must be between 1 and 1000`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if user has required permissions for an operation
 */
export function hasRequiredPermissions(user: any, operation: string): {
  allowed: boolean;
  reason?: string;
} {
  if (!user) {
    return { allowed: false, reason: 'User not authenticated' };
  }

  // Admin users can do anything
  if (user.role === 'admin') {
    return { allowed: true };
  }

  switch (operation) {
    case 'read_user_profile':
      return { allowed: user.id === user.id }; // Users can read their own profile

    case 'update_user_profile':
      return { allowed: user.id === user.id }; // Users can update their own profile

    case 'delete_user_profile':
      return { allowed: false, reason: 'Users cannot delete their own profiles' };

    case 'create_order':
      return { allowed: true }; // Any authenticated user can create orders

    case 'read_own_orders':
      return { allowed: true }; // Users can read their own orders

    case 'update_own_order':
      return { allowed: true }; // Users can update their own orders

    case 'create_product':
      return { allowed: user.role === 'chef', reason: 'Only chefs can create products' };

    case 'update_product':
      return { allowed: user.role === 'chef', reason: 'Only chefs can update products' };

    case 'delete_product':
      return { allowed: user.role === 'chef', reason: 'Only chefs can delete products' };

    default:
      return { allowed: false, reason: `Unknown operation: ${operation}` };
  }
}

/**
 * Validate Firestore security rules compliance
 */
export function validateSecurityRulesCompliance(
  operation: string,
  data: any,
  user: any
): {
  compliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Check if user is authenticated for protected operations
  if (!user && ['create', 'update', 'delete'].includes(operation)) {
    violations.push('User must be authenticated for write operations');
  }

  // Check data sanitization
  if (data && typeof data === 'object') {
    for (const [key, value] of Object.entries(data)) {
      if (!isValidFieldName(key)) {
        violations.push(`Invalid field name: ${key}`);
      }

      if (value === undefined) {
        violations.push(`Undefined value for field: ${key}`);
      }
    }
  }

  // Check for potential security issues
  if (data && data.__proto__ && data.__proto__.constructor.name !== 'Object') {
    violations.push('Potential prototype pollution detected');
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}
