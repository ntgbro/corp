// Push notification configuration
export const NOTIFICATION_CONFIG = {
  // FCM Configuration
  FCM: {
    CHANNELS: {
      DEFAULT: {
        id: 'corpease_default',
        name: 'General Notifications',
        description: 'General app notifications',
        importance: 4, // High importance
        sound: 'default',
        vibration: true,
        badge: true,
      },
      ORDERS: {
        id: 'corpease_orders',
        name: 'Order Updates',
        description: 'Order status and delivery updates',
        importance: 5, // Max importance
        sound: 'default',
        vibration: true,
        badge: true,
      },
      PROMOTIONS: {
        id: 'corpease_promotions',
        name: 'Promotions',
        description: 'Special offers and promotions',
        importance: 3, // Default importance
        sound: 'default',
        vibration: true,
        badge: false,
      },
    },
  },

  // Notification Types
  TYPES: {
    ORDER_STATUS: 'order_status',
    ORDER_READY: 'order_ready',
    DELIVERY_UPDATE: 'delivery_update',
    PROMOTION: 'promotion',
    SYSTEM: 'system',
    CHAT: 'chat',
  },

  // Notification Priorities
  PRIORITIES: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
  },

  // Notification Categories
  CATEGORIES: {
    ORDER: {
      id: 'order',
      name: 'Order Updates',
      actions: ['VIEW_ORDER', 'TRACK_ORDER', 'CONTACT_SUPPORT'],
    },
    PROMOTION: {
      id: 'promotion',
      name: 'Promotions',
      actions: ['VIEW_OFFER', 'DISMISS'],
    },
    SYSTEM: {
      id: 'system',
      name: 'System Updates',
      actions: ['VIEW_DETAILS', 'DISMISS'],
    },
  },

  // Notification Sounds
  SOUNDS: {
    DEFAULT: 'default',
    ORDER_UPDATE: 'order_update.mp3',
    PROMOTION: 'promotion.mp3',
    URGENT: 'urgent.mp3',
  },

  // Settings
  SETTINGS: {
    ENABLED: true,
    SOUND_ENABLED: true,
    VIBRATION_ENABLED: true,
    BANNER_ENABLED: true,
    LIGHTS_ENABLED: true,
    PRECISE_ALARMS: false,
  },

  // Time-based settings
  TIME_SETTINGS: {
    QUIET_HOURS_START: '22:00', // 10 PM
    QUIET_HOURS_END: '08:00',   // 8 AM
    DO_NOT_DISTURB: false,
  },

  // Message Templates
  TEMPLATES: {
    ORDER_PLACED: {
      title: 'Order Placed Successfully',
      body: 'Your order #{orderId} has been placed and will be prepared shortly.',
      actions: ['TRACK_ORDER', 'VIEW_ORDER'],
    },
    ORDER_READY: {
      title: 'Order Ready for Pickup',
      body: 'Your order #{orderId} is ready! Come pick it up.',
      actions: ['GET_DIRECTIONS', 'CONTACT_CHEF'],
    },
    DELIVERY_STARTED: {
      title: 'Out for Delivery',
      body: 'Your order #{orderId} is on the way!',
      actions: ['TRACK_DELIVERY', 'CONTACT_DRIVER'],
    },
    ORDER_DELIVERED: {
      title: 'Order Delivered',
      body: 'Your order #{orderId} has been delivered. Enjoy your meal!',
      actions: ['RATE_ORDER', 'REORDER'],
    },
    PROMOTION: {
      title: 'Special Offer Just for You!',
      body: '{message}',
      actions: ['VIEW_OFFER', 'DISMISS'],
    },
  },
} as const;

// Notification permission levels
export const NOTIFICATION_PERMISSIONS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  UNDETERMINED: 'undetermined',
} as const;

// Notification action types
export const NOTIFICATION_ACTIONS = {
  VIEW_ORDER: 'VIEW_ORDER',
  TRACK_ORDER: 'TRACK_ORDER',
  CONTACT_SUPPORT: 'CONTACT_SUPPORT',
  GET_DIRECTIONS: 'GET_DIRECTIONS',
  CONTACT_CHEF: 'CONTACT_CHEF',
  TRACK_DELIVERY: 'TRACK_DELIVERY',
  CONTACT_DRIVER: 'CONTACT_DRIVER',
  RATE_ORDER: 'RATE_ORDER',
  REORDER: 'REORDER',
  VIEW_OFFER: 'VIEW_OFFER',
  VIEW_DETAILS: 'VIEW_DETAILS',
  DISMISS: 'DISMISS',
} as const;

export default NOTIFICATION_CONFIG;
