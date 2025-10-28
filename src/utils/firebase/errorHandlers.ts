// Firebase error handling utilities

import { FirebaseError } from '@react-native-firebase/app';
import { getFirebaseErrorMessage, getErrorSeverity } from './validators';

/**
 * Custom error class for Firebase operations
 */
export class FirebaseOperationError extends Error {
  public readonly code: string;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';
  public readonly retryable: boolean;
  public readonly context?: any;

  constructor(
    message: string,
    code: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    retryable: boolean = false,
    context?: any
  ) {
    super(message);
    this.name = 'FirebaseOperationError';
    this.code = code;
    this.severity = severity;
    this.retryable = retryable;
    this.context = context;
  }
}

/**
 * Handle Firebase authentication errors
 */
export function handleAuthError(error: any, context?: any): FirebaseOperationError {
  const message = getFirebaseErrorMessage(error);
  const severity = getErrorSeverity(error);
  const retryable = isRetryableAuthError(error);

  return new FirebaseOperationError(
    message,
    error.code || 'auth/unknown',
    severity,
    retryable,
    { ...context, operation: 'authentication' }
  );
}

/**
 * Handle Firestore errors
 */
export function handleFirestoreError(error: any, context?: any): FirebaseOperationError {
  const message = getFirebaseErrorMessage(error);
  const severity = getErrorSeverity(error);
  const retryable = isRetryableFirestoreError(error);

  return new FirebaseOperationError(
    message,
    error.code || 'firestore/unknown',
    severity,
    retryable,
    { ...context, operation: 'firestore' }
  );
}

/**
 * Handle Firebase Storage errors
 */
export function handleStorageError(error: any, context?: any): FirebaseOperationError {
  const message = getFirebaseErrorMessage(error);
  const severity = getErrorSeverity(error);
  const retryable = isRetryableStorageError(error);

  return new FirebaseOperationError(
    message,
    error.code || 'storage/unknown',
    severity,
    retryable,
    { ...context, operation: 'storage' }
  );
}

/**
 * Handle Firebase Functions errors
 */
export function handleFunctionsError(error: any, context?: any): FirebaseOperationError {
  const message = getFirebaseErrorMessage(error);
  const severity = getErrorSeverity(error);
  const retryable = isRetryableFunctionsError(error);

  return new FirebaseOperationError(
    message,
    error.code || 'functions/unknown',
    severity,
    retryable,
    { ...context, operation: 'functions' }
  );
}

/**
 * Check if an authentication error is retryable
 */
function isRetryableAuthError(error: any): boolean {
  const retryableCodes = [
    'network-request-failed',
    'timeout',
    'internal-error',
    'too-many-requests', // Can retry after backoff
  ];

  return retryableCodes.some(code => error.code?.includes(code));
}

/**
 * Check if a Firestore error is retryable
 */
function isRetryableFirestoreError(error: any): boolean {
  const retryableCodes = [
    'deadline-exceeded',
    'resource-exhausted',
    'unavailable',
    'internal',
    'cancelled',
  ];

  return retryableCodes.some(code => error.code?.includes(code));
}

/**
 * Check if a Storage error is retryable
 */
function isRetryableStorageError(error: any): boolean {
  const retryableCodes = [
    'retry-limit-exceeded',
    'server-file-wrong-size',
    'network-request-failed',
  ];

  return retryableCodes.some(code => error.code?.includes(code));
}

/**
 * Check if a Functions error is retryable
 */
function isRetryableFunctionsError(error: any): boolean {
  const retryableCodes = [
    'deadline-exceeded',
    'resource-exhausted',
    'unavailable',
    'internal',
    'cancelled',
  ];

  return retryableCodes.some(code => error.code?.includes(code));
}

/**
 * Get retry delay for an error
 */
export function getRetryDelay(error: any, attempt: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds

  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 1000; // Add up to 1 second jitter

  let delay = exponentialDelay + jitter;

  // Cap at max delay
  if (delay > maxDelay) {
    delay = maxDelay;
  }

  // Special delays for specific errors
  if (error.code?.includes('too-many-requests')) {
    // Firebase rate limiting - wait longer
    delay = Math.max(delay, 5000);
  }

  if (error.code?.includes('resource-exhausted')) {
    // Resource exhaustion - wait even longer
    delay = Math.max(delay, 10000);
  }

  return Math.floor(delay);
}

/**
 * Log Firebase error with context
 */
export function logFirebaseError(
  error: FirebaseOperationError,
  context?: any
): void {
  const logData = {
    message: error.message,
    code: error.code,
    severity: error.severity,
    retryable: error.retryable,
    context: { ...error.context, ...context },
    stack: error.stack,
    timestamp: new Date().toISOString(),
  };

  // In production, send to error reporting service
  console.error('Firebase Error:', logData);

  // You could also send to analytics or crash reporting
  // analytics.track('firebase_error', {
  //   code: error.code,
  //   severity: error.severity,
  //   operation: error.context?.operation,
  // });
}

/**
 * Handle Firebase error with retry logic
 */
export async function handleFirebaseErrorWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  context?: any
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      const firebaseError = createFirebaseError(error);
      if (!firebaseError.retryable || attempt === maxRetries) {
        throw firebaseError;
      }

      // Wait before retrying
      const delay = getRetryDelay(firebaseError, attempt);
      console.log(`Retrying Firebase operation in ${delay}ms (attempt ${attempt}/${maxRetries})`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Create a standardized Firebase error object
 */
export function createFirebaseError(
  error: any,
  context?: any
): FirebaseOperationError {
  if (error instanceof FirebaseOperationError) {
    return error;
  }

  if (error instanceof FirebaseError) {
    const message = getFirebaseErrorMessage(error);
    const severity = getErrorSeverity(error);

    // Determine if error is retryable based on code
    const retryable = isRetryableError(error);

    return new FirebaseOperationError(
      message,
      error.code,
      severity,
      retryable,
      context
    );
  }

  // Unknown error
  return new FirebaseOperationError(
    error.message || 'An unknown error occurred',
    'unknown',
    'medium',
    false,
    context
  );
}

/**
 * Check if any error is retryable
 */
function isRetryableError(error: any): boolean {
  if (!error || !error.code) {
    return false;
  }

  const retryablePatterns = [
    'network-request-failed',
    'timeout',
    'deadline-exceeded',
    'resource-exhausted',
    'unavailable',
    'internal',
    'server-error',
    'service-unavailable',
  ];

  return retryablePatterns.some(pattern => error.code.includes(pattern));
}

/**
 * Handle batch operation errors
 */
export function handleBatchErrors(
  errors: any[],
  context?: any
): {
  successful: number;
  failed: number;
  errors: FirebaseOperationError[];
  shouldRetry: boolean;
} {
  const firebaseErrors: FirebaseOperationError[] = [];

  let shouldRetry = false;

  for (const error of errors) {
    const firebaseError = createFirebaseError(error, context);
    firebaseErrors.push(firebaseError);

    if (firebaseError.retryable) {
      shouldRetry = true;
    }
  }

  return {
    successful: errors.length - firebaseErrors.length,
    failed: firebaseErrors.length,
    errors: firebaseErrors,
    shouldRetry,
  };
}

/**
 * Get user-friendly error message for display
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (error instanceof FirebaseOperationError) {
    return error.message;
  }

  const firebaseError = createFirebaseError(error);
  return firebaseError.message;
}

/**
 * Determine if error should be shown to user
 */
export function shouldShowErrorToUser(error: any): boolean {
  const firebaseError = createFirebaseError(error);

  // Don't show low-severity errors to users
  if (firebaseError.severity === 'low') {
    return false;
  }

  // Don't show retryable errors that are temporary
  if (firebaseError.retryable && firebaseError.severity === 'medium') {
    return false;
  }

  return true;
}

/**
 * Get error reporting data for analytics
 */
export function getErrorReportingData(error: any, context?: any): {
  code: string;
  message: string;
  severity: string;
  operation: string;
  userId?: string;
  deviceInfo?: any;
  additionalContext?: any;
} {
  const firebaseError = createFirebaseError(error, context);

  return {
    code: firebaseError.code,
    message: firebaseError.message,
    severity: firebaseError.severity,
    operation: firebaseError.context?.operation || 'unknown',
    userId: context?.userId,
    deviceInfo: context?.deviceInfo,
    additionalContext: firebaseError.context,
  };
}

/**
 * Handle offline errors
 */
export function handleOfflineError(error: any, context?: any): {
  shouldQueue: boolean;
  error: FirebaseOperationError;
} {
  const firebaseError = createFirebaseError(error, context);

  // Network errors should be queued for retry when online
  const shouldQueue = firebaseError.code.includes('network-request-failed') ||
    firebaseError.code.includes('unavailable');

  return {
    shouldQueue,
    error: firebaseError,
  };
}

/**
 * Retry configuration for different error types
 */
export const RETRY_CONFIG = {
  auth: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
  },
  firestore: {
    maxRetries: 5,
    baseDelay: 500,
    maxDelay: 15000,
  },
  storage: {
    maxRetries: 3,
    baseDelay: 2000,
    maxDelay: 20000,
  },
  functions: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
  },
} as const;

/**
 * Get retry configuration for operation type
 */
export function getRetryConfig(operationType: keyof typeof RETRY_CONFIG) {
  return RETRY_CONFIG[operationType] || RETRY_CONFIG.firestore;
}
