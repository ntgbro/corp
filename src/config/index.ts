// Config barrel export
export * from './constants';
export * from './countryCodes';
export * from './environment';
export * from './firebase';
export * from './notifications';
export * from './servicesConfig';
export * from './theme';

// Re-export Firebase exports
export {
  auth,
  firestore as db,
  storage,
  messaging,
  analytics
} from './firebase';
