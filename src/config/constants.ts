// App constants and configuration
export const APP_CONFIG = {
  // App Info
  NAME: 'Corpease',
  VERSION: '1.0.0',
  PACKAGE_NAME: 'com.corpease',

  // Firebase Project
  FIREBASE_PROJECT_ID: 'corpeas-ee450',

  // API Endpoints
  API_BASE_URL: __DEV__ ? 'http://localhost:3000' : 'https://api.corpease.com',

  // Storage Keys
  STORAGE_KEYS: {
    USER_PROFILE: '@corpease/user_profile',
    CART_ITEMS: '@corpease/cart_items',
    AUTH_TOKEN: '@corpease/auth_token',
    APP_SETTINGS: '@corpease/app_settings',
    OFFLINE_DATA: '@corpease/offline_data',
  },

  // Limits and Constraints
  LIMITS: {
    MAX_CART_ITEMS: 50,
    MAX_ADDRESSES: 10,
    MAX_IMAGES_PER_PRODUCT: 10,
    MAX_PRODUCTS_PER_CHEF: 100,
    MAX_CHEFS_PER_CATEGORY: 50,
    MAX_ORDERS_HISTORY: 100,
    MAX_SEARCH_RESULTS: 50,
    MAX_REVIEWS_PER_ITEM: 20,
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    IMAGE_COMPRESSION_QUALITY: 0.8,
  },

  // Timeouts
  TIMEOUTS: {
    API_REQUEST: 30000, // 30 seconds
    IMAGE_UPLOAD: 60000, // 60 seconds
    AUTH_TIMEOUT: 300000, // 5 minutes
    OTP_RESEND: 60000, // 1 minute
    OFFLINE_SYNC: 300000, // 5 minutes
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 50,
    PRODUCTS_PER_ROW: 2,
    CHEFS_PER_ROW: 1,
  },

  // Cache
  CACHE: {
    USER_DATA_TTL: 300000, // 5 minutes
    PRODUCT_DATA_TTL: 600000, // 10 minutes
    CHEF_DATA_TTL: 900000, // 15 minutes
    ORDER_DATA_TTL: 1800000, // 30 minutes
  },

  // Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 50,
    MIN_PHONE_LENGTH: 10,
    MAX_PHONE_LENGTH: 15,
    MIN_ADDRESS_LENGTH: 10,
    MAX_ADDRESS_LENGTH: 500,
    MIN_REVIEW_LENGTH: 10,
    MAX_REVIEW_LENGTH: 1000,
  },

  // UI
  UI: {
    DEFAULT_ANIMATION_DURATION: 300,
    LONG_ANIMATION_DURATION: 500,
    SNACKBAR_DURATION: 4000,
    PULL_REFRESH_THRESHOLD: 80,
    SWIPE_THRESHOLD: 100,
  },

  // Features
  FEATURES: {
    OFFLINE_MODE: true,
    PUSH_NOTIFICATIONS: true,
    ANALYTICS: true,
    IMAGE_UPLOAD: true,
    LOCATION_SERVICES: true,
    SOCIAL_LOGIN: false, // Disabled for now
    GUEST_CHECKOUT: false, // Disabled for now
  },

  // Error Messages
  ERRORS: {
    NETWORK_ERROR: 'Please check your internet connection',
    PERMISSION_DENIED: 'Permission required to continue',
    AUTH_REQUIRED: 'Please sign in to continue',
    LOCATION_UNAVAILABLE: 'Unable to get your location',
    CAMERA_UNAVAILABLE: 'Camera not available',
    STORAGE_FULL: 'Storage full, please free up space',
    UPLOAD_FAILED: 'Upload failed, please try again',
    INVALID_DATA: 'Invalid data provided',
  },

  // Success Messages
  SUCCESS: {
    PROFILE_UPDATED: 'Profile updated successfully',
    ORDER_PLACED: 'Order placed successfully',
    PAYMENT_COMPLETED: 'Payment completed successfully',
    ADDRESS_ADDED: 'Address added successfully',
    REVIEW_SUBMITTED: 'Review submitted successfully',
  },

  // Support
  SUPPORT: {
    EMAIL: 'support@corpease.com',
    PHONE: '+1-800-CORPEASE',
    WEBSITE: 'https://corpease.com',
  },
} as const;

// App routes and navigation
export const ROUTES = {
  // Auth
  AUTH: 'Auth',
  PHONE_AUTH: 'PhoneAuth',
  OTP_VERIFICATION: 'OTPVerification',

// Main
  MAIN: 'Main',
  HOME: 'Home',
  CART: 'Cart',
  ORDERS: 'Orders',
  PROFILE: 'Profile',

  // Product
  PRODUCT_LIST: 'ProductList',
  PRODUCT_DETAIL: 'ProductDetail',
  PRODUCT_REVIEWS: 'ProductReviews',
  WAREHOUSE_LIST: 'WarehouseList',
  WAREHOUSE_DETAIL: 'WarehouseDetail',
  WAREHOUSE_PRODUCTS: 'WarehouseProducts',

  // Order
  ORDER_DETAILS: 'OrderDetails',
  ORDER_TRACKING: 'OrderTracking',
  ORDER_RATING: 'OrderRating',

  // Profile
  EDIT_PROFILE: 'EditProfile',
  ADDRESS_SCREEN: 'AddressScreen',
  ADD_ADDRESS: 'AddAddress',
  EDIT_ADDRESS: 'EditAddress',
  SETTINGS: 'Settings',
  NOTIFICATIONS: 'Notifications',
  PRIVACY: 'Privacy',
  PREFERENCES: 'Preferences',
  DELIVERY_PARTNER_PROFILE: 'DeliveryPartnerProfile',
  DELIVERY_HISTORY: 'DeliveryHistory',
} as const;

// Animation types
export const ANIMATION_TYPES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  EMPTY: 'empty',
} as const;

// Service types
export const SERVICE_TYPES = {
  FRESH_SERVE: 'fresh_serve',
  FMCG: 'fmcg',
  SUPPLIES: 'supplies',
} as const;

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  CASH_ON_DELIVERY: 'cash_on_delivery',
  WALLET: 'wallet',
} as const;

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  CHEF: 'chef',
  ADMIN: 'admin',
  WAREHOUSE_OWNER: 'warehouse_owner',
} as const;

// Review ratings
export const RATING_RANGE = {
  MIN: 1,
  MAX: 5,
} as const;

export default APP_CONFIG;
