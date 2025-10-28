// Environment configuration
export const ENVIRONMENT = {
  // App Environment
  APP_ENV: __DEV__ ? 'development' : 'production',
  DEBUG: __DEV__,
  VERSION: '1.0.0',

  // API Configuration
  API: {
    BASE_URL: __DEV__
      ? 'http://localhost:3000/api'
      : 'https://api.corpease.com/api',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
  },

  // Firebase Configuration
  FIREBASE: {
    PROJECT_ID: 'corpeas-ee450',
    STORAGE_BUCKET: 'corpeas-ee450.firebasestorage.app',
    MESSAGING_SENDER_ID: '371942129309',
  },

  // Third-party Services
  PAYMENT_GATEWAY: {
    ENABLED: false, // Set to true when payment integration is ready
    TEST_MODE: __DEV__,
    PUBLIC_KEY: __DEV__
      ? 'pk_test_your_test_key'
      : 'pk_live_your_live_key',
  },

  // Location Services
  LOCATION: {
    ENABLED: true,
    HIGH_ACCURACY: false, // Set to true for delivery tracking
    UPDATE_INTERVAL: 60000, // 1 minute
    FASTEST_INTERVAL: 30000, // 30 seconds
  },

  // Push Notifications
  NOTIFICATIONS: {
    ENABLED: true,
    FCM_ENABLED: true,
    LOCAL_NOTIFICATIONS: true,
    DEFAULT_CHANNEL: 'corpease_default',
  },

  // Analytics
  ANALYTICS: {
    ENABLED: true,
    FIREBASE_ANALYTICS: true,
    CRASHLYTICS: true,
  },

  // Offline Support
  OFFLINE: {
    ENABLED: true,
    CACHE_SIZE: 50 * 1024 * 1024, // 50MB
    SYNC_INTERVAL: 300000, // 5 minutes
  },

  // Feature Flags
  FEATURES: {
    GUEST_CHECKOUT: false,
    SOCIAL_LOGIN: false,
    ADVANCED_SEARCH: false,
    REAL_TIME_TRACKING: false,
    MULTI_LANGUAGE: false,
    DARK_MODE: true,
    BIOMETRIC_AUTH: false,
  },

  // Development
  DEV: {
    LOG_LEVEL: __DEV__ ? 'debug' : 'error',
    ENABLE_REDUX_DEVTOOLS: __DEV__,
    MOCK_DATA: __DEV__,
    SKIP_AUTH: false, // Set to true for development
  },
} as const;

// Helper functions
export const isDevelopment = () => ENVIRONMENT.APP_ENV === 'development';
export const isProduction = () => ENVIRONMENT.APP_ENV === 'production';
export const isFeatureEnabled = (feature: keyof typeof ENVIRONMENT.FEATURES) =>
  ENVIRONMENT.FEATURES[feature];

export default ENVIRONMENT;
