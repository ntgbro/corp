// src/utils/firestoreHelpers.ts
// Utility functions for handling Firestore data in Redux

import { Timestamp } from '@react-native-firebase/firestore';

/**
 * Converts Firestore Timestamp to serializable Date object
 */
export function convertFirestoreTimestamp(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
    // Handle Firestore Timestamp-like object
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  // Fallback for string dates or other formats
  return new Date(timestamp);
}

/**
 * Converts a user object from Firestore to Redux-compatible format
 */
export function convertUserForRedux(userData: any) {
  return {
    ...userData,
    joinedAt: convertFirestoreTimestamp(userData.joinedAt),
  };
}

/**
 * Converts an array of objects containing Firestore Timestamps
 */
export function convertArrayForRedux<T extends Record<string, any>>(items: T[]): T[] {
  return items.map(item => {
    const converted = { ...item };
    // Convert common timestamp fields if they exist
    if ('createdAt' in converted) {
      (converted as any).createdAt = convertFirestoreTimestamp(converted.createdAt);
    }
    if ('updatedAt' in converted) {
      (converted as any).updatedAt = convertFirestoreTimestamp(converted.updatedAt);
    }
    if ('joinedAt' in converted) {
      (converted as any).joinedAt = convertFirestoreTimestamp(converted.joinedAt);
    }
    if ('expiryDate' in converted) {
      (converted as any).expiryDate = convertFirestoreTimestamp(converted.expiryDate);
    }
    if ('orderDate' in converted) {
      (converted as any).orderDate = convertFirestoreTimestamp(converted.orderDate);
    }
    return converted;
  });
}
