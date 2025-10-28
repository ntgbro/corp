// Firebase specific types
export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface QuerySnapshot<T> {
  docs: QueryDocumentSnapshot<T>[];
  size: number;
  empty: boolean;
}

export interface QueryDocumentSnapshot<T> {
  id: string;
  data(): T;
  exists: boolean;
}

export interface DocumentSnapshot<T> {
  id: string;
  data(): T | undefined;
  exists: boolean;
}

export interface WriteBatch {
  set<T>(documentRef: any, data: T): WriteBatch;
  update(documentRef: any, data: any): WriteBatch;
  delete(documentRef: any): WriteBatch;
  commit(): Promise<void>;
}

export interface DocumentReference<T> {
  id: string;
  set(data: T): Promise<void>;
  update(data: any): Promise<void>;
  delete(): Promise<void>;
  get(): Promise<DocumentSnapshot<T>>;
  collection(path: string): any;
}

export interface CollectionReference<T> {
  id: string;
  add(data: T): Promise<DocumentReference<T>>;
  get(): Promise<QuerySnapshot<T>>;
  where(field: string, op: any, value: any): any;
  orderBy(field: string, direction?: 'asc' | 'desc'): any;
  limit(limit: number): any;
  doc(id?: string): DocumentReference<T>;
}

export interface FirestoreError {
  code: string;
  message: string;
  name: string;
}

// Firebase Auth types
export interface FirebaseUser {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  providerData: any[];
}

export interface AuthError {
  code: string;
  message: string;
  email?: string;
  phoneNumber?: string;
}

// Storage types
export interface UploadTask {
  on: (event: string, callback: (snapshot: any) => void) => void;
  then: (callback: (result: any) => void) => void;
  catch: (callback: (error: any) => void) => void;
}

export interface UploadTaskSnapshot {
  bytesTransferred: number;
  totalBytes: number;
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
  metadata: {
    name: string;
    size: number;
    contentType: string;
    fullPath: string;
    downloadURLs: string[];
  };
}
