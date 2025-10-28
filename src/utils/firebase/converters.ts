// Firebase data converters for Firestore

import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  GeoPoint,
} from '@react-native-firebase/firestore';

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export function timestampToDate(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date(timestamp);
}

/**
 * Convert JavaScript Date to Firestore Timestamp
 */
export function dateToTimestamp(date: Date | string | number): any {
  if (date instanceof Date) {
    return Timestamp.fromDate(date);
  }
  return Timestamp.fromDate(new Date(date));
}

/**
 * Convert Firestore GeoPoint to plain object
 */
export function geoPointToObject(geoPoint: any): { latitude: number; longitude: number } | null {
  if (geoPoint && typeof geoPoint === 'object' && 'latitude' in geoPoint && 'longitude' in geoPoint) {
    return {
      latitude: geoPoint.latitude,
      longitude: geoPoint.longitude,
    };
  }
  return null;
}

/**
 * Convert plain object to Firestore GeoPoint
 */
export function objectToGeoPoint(obj: { latitude: number; longitude: number }): any {
  if (obj && typeof obj === 'object' && 'latitude' in obj && 'longitude' in obj) {
    return new GeoPoint(obj.latitude, obj.longitude);
  }
  return null;
}

/**
 * Convert Firestore document to plain object
 */
export function documentToObject<T = any>(doc: QueryDocumentSnapshot<DocumentData>): T & { id: string } {
  const data = doc.data();
  return {
    id: doc.id,
    ...convertTimestamps(data),
    ...convertGeoPoints(data),
  } as T & { id: string };
}

/**
 * Convert multiple documents to plain objects
 */
export function documentsToObject<T = any>(docs: QueryDocumentSnapshot<DocumentData>[]): (T & { id: string })[] {
  return docs.map(doc => documentToObject<T>(doc));
}

/**
 * Convert Firestore Timestamps in an object to Dates
 */
export function convertTimestamps(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Timestamp) {
    return obj.toDate();
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestamps(item));
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertTimestamps(value);
    }
    return converted;
  }

  return obj;
}

/**
 * Convert Firestore GeoPoints in an object to plain objects
 */
export function convertGeoPoints(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof GeoPoint) {
    return {
      latitude: obj.latitude,
      longitude: obj.longitude,
    };
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertGeoPoints(item));
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertGeoPoints(value);
    }
    return converted;
  }

  return obj;
}

/**
 * Prepare object for Firestore (convert Dates to Timestamps, objects to GeoPoints)
 */
export function prepareForFirestore(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return Timestamp.fromDate(obj);
  }

  if (obj && typeof obj === 'object' && 'latitude' in obj && 'longitude' in obj) {
    return new GeoPoint(obj.latitude, obj.longitude);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => prepareForFirestore(item));
  }

  if (typeof obj === 'object') {
    const prepared: any = {};
    for (const [key, value] of Object.entries(obj)) {
      prepared[key] = prepareForFirestore(value);
    }
    return prepared;
  }

  return obj;
}

/**
 * Clean object for serialization (remove Firestore-specific types)
 */
export function cleanForSerialization(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString();
  }

  if (obj instanceof GeoPoint) {
    return {
      latitude: obj.latitude,
      longitude: obj.longitude,
    };
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanForSerialization(item));
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = cleanForSerialization(value);
    }
    return cleaned;
  }

  return obj;
}

/**
 * Convert batch write operations
 */
export function prepareBatchData(data: Record<string, any>): Record<string, any> {
  const prepared: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      prepared[key] = null; // Explicitly set to null for deletion
    } else {
      prepared[key] = prepareForFirestore(value);
    }
  }

  return prepared;
}

/**
 * Convert query results to typed objects
 */
export function convertQueryResults<T>(
  snapshot: { docs: QueryDocumentSnapshot<DocumentData>[] }
): (T & { id: string })[] {
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
    ...convertGeoPoints(doc.data()),
  } as T & { id: string }));
}

/**
 * Create a document reference converter
 */
export function createDocumentConverter<T>() {
  return {
    toFirestore: (data: T) => prepareForFirestore(data),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>) => ({
      id: snapshot.id,
      ...convertTimestamps(snapshot.data()),
      ...convertGeoPoints(snapshot.data()),
    } as T & { id: string }),
  };
}

/**
 * Create a collection converter
 */
export function createCollectionConverter<T>() {
  return {
    toFirestore: (data: T) => prepareForFirestore(data),
    fromFirestore: (snapshot: { docs: QueryDocumentSnapshot<DocumentData>[] }) =>
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
        ...convertGeoPoints(doc.data()),
      } as T & { id: string })),
  };
}

/**
 * Convert Firestore error to a standard error format
 */
export function convertFirestoreError(error: any): {
  code: string;
  message: string;
  details?: any;
} {
  return {
    code: error.code || 'firestore/unknown',
    message: error.message || 'An unknown Firestore error occurred',
    details: error,
  };
}

/**
 * Check if a value is a Firestore Timestamp
 */
export function isTimestamp(value: any): value is Timestamp {
  return value instanceof Timestamp ||
    (value && typeof value === 'object' && value.seconds && value.nanoseconds);
}

/**
 * Check if a value is a Firestore GeoPoint
 */
export function isGeoPoint(value: any): value is GeoPoint {
  return value instanceof GeoPoint ||
    (value && typeof value === 'object' && 'latitude' in value && 'longitude' in value);
}

/**
 * Convert server timestamp
 */
export function serverTimestamp(): any {
  return { '.sv': 'timestamp' };
}

/**
 * Convert array union
 */
export function arrayUnion(...elements: any[]): any {
  return { '.sv': 'arrayUnion', elements };
}

/**
 * Convert array remove
 */
export function arrayRemove(...elements: any[]): any {
  return { '.sv': 'arrayRemove', elements };
}

/**
 * Convert increment
 */
export function increment(n: number): any {
  return { '.sv': 'increment', n };
}

/**
 * Convert decrement (custom implementation)
 */
export function decrement(n: number): any {
  return { '.sv': 'increment', n: -n };
}

/**
 * Create field path for nested fields
 */
export function fieldPath(...fieldNames: string[]): any {
  return fieldNames.join('.');
}

/**
 * Convert reference to document path
 */
export function referenceToPath(reference: any): string {
  if (reference && typeof reference === 'object' && reference.path) {
    return reference.path;
  }
  return '';
}

/**
 * Create document mask for partial updates
 */
export function createDocumentMask(fields: string[]): string[] {
  return fields;
}

/**
 * Validate document data before saving
 */
export function validateDocumentData(data: any, requiredFields: string[] = []): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`Required field '${field}' is missing or empty`);
    }
  }

  // Check field types
  if (data.id && typeof data.id !== 'string') {
    errors.push('Document ID must be a string');
  }

  if (data.createdAt && !isTimestamp(data.createdAt) && !(data.createdAt instanceof Date)) {
    errors.push('createdAt must be a Date or Timestamp');
  }

  if (data.updatedAt && !isTimestamp(data.updatedAt) && !(data.updatedAt instanceof Date)) {
    errors.push('updatedAt must be a Date or Timestamp');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize document data (remove undefined values)
 */
export function sanitizeDocumentData(data: any): any {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Create a snapshot listener converter
 */
export function createSnapshotConverter<T>() {
  return (snapshot: { docs: QueryDocumentSnapshot<DocumentData>[] }) => {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
      ...convertGeoPoints(doc.data()),
    } as T & { id: string }));
  };
}

/**
 * Convert write batch for offline support
 */
export function prepareOfflineBatch(batch: any[]): any[] {
  return batch.map(operation => ({
    ...operation,
    data: operation.data ? cleanForSerialization(operation.data) : undefined,
  }));
}
