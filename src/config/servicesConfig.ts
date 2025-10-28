// Service configuration and metadata
export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  features: string[];
  restrictions?: {
    minOrder?: number;
    maxOrder?: number;
    deliveryTime?: string;
    preparationTime?: string;
  };
}

export const SERVICE_CONFIG: ServiceConfig[] = [
  {
    id: 'fresh_serve',
    name: 'Fresh Serve',
    description: 'Fresh, home-cooked meals prepared by local chefs',
    icon: '🍽️',
    color: '#4CAF50', // Green
    enabled: true,
    features: [
      'Home-cooked meals',
      'Daily menu updates',
      'Chef ratings',
      'Custom orders',
      'Delivery tracking',
    ],
    restrictions: {
      minOrder: 100,
      maxOrder: 2000,
      preparationTime: '30-60 minutes',
    },
  },
  {
    id: 'fmcg',
    name: 'FMCG',
    description: 'Fast Moving Consumer Goods - Groceries and daily essentials',
    icon: '🛒',
    color: '#2196F3', // Blue
    enabled: true,
    features: [
      'Quick delivery',
      'Bulk discounts',
      'Scheduled delivery',
      'Express checkout',
      'Return policy',
    ],
    restrictions: {
      minOrder: 50,
      maxOrder: 5000,
      deliveryTime: '15-30 minutes',
    },
  },
  {
    id: 'supplies',
    name: 'Supplies',
    description: 'Kitchen supplies, cooking ingredients, and chef tools',
    icon: '👨‍🍳',
    color: '#FF9800', // Orange
    enabled: true,
    features: [
      'Chef-grade ingredients',
      'Bulk packaging',
      'Quality guarantee',
      'Expert consultation',
      'Wholesale prices',
    ],
    restrictions: {
      minOrder: 200,
      maxOrder: 10000,
      preparationTime: '1-2 hours',
    },
  },
];

// Service status
export const SERVICE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  COMING_SOON: 'coming_soon',
} as const;

// Service features
export const SERVICE_FEATURES = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
  SCHEDULING: 'scheduling',
  SUBSCRIPTION: 'subscription',
  CUSTOM_ORDERS: 'custom_orders',
  BULK_DISCOUNTS: 'bulk_discounts',
  EXPRESS_DELIVERY: 'express_delivery',
  REAL_TIME_TRACKING: 'real_time_tracking',
  QUALITY_GUARANTEE: 'quality_guarantee',
  RETURN_POLICY: 'return_policy',
} as const;

// Service restrictions
export const SERVICE_RESTRICTIONS = {
  MIN_ORDER: 'min_order',
  MAX_ORDER: 'max_order',
  DELIVERY_RADIUS: 'delivery_radius',
  PREPARATION_TIME: 'preparation_time',
  BUSINESS_HOURS: 'business_hours',
  ADVANCE_ORDERING: 'advance_ordering',
} as const;

// Helper functions
export const getServiceById = (id: string): ServiceConfig | undefined => {
  return SERVICE_CONFIG.find(service => service.id === id);
};

export const getEnabledServices = (): ServiceConfig[] => {
  return SERVICE_CONFIG.filter(service => service.enabled);
};

export const getServiceColor = (serviceId: string): string => {
  const service = getServiceById(serviceId);
  return service?.color || '#666666';
};

export const getServiceIcon = (serviceId: string): string => {
  const service = getServiceById(serviceId);
  return service?.icon || '📦';
};

export const isServiceEnabled = (serviceId: string): boolean => {
  const service = getServiceById(serviceId);
  return service?.enabled || false;
};

export default SERVICE_CONFIG;
