// User specific types
export interface UserProfile {
  id: string;
  uid: string; // Firebase Auth UID
  phoneNumber: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  role: UserRole;
  isVerified: boolean;
  isAnonymous: boolean;
  preferences: UserPreferences;
  createdAt: any;
  lastLoginAt: any;
  metadata: {
    deviceInfo?: DeviceInfo;
    location?: LocationInfo;
    appVersion?: string;
  };
}

export type UserRole = 'customer' | 'chef' | 'admin' | 'moderator';

export interface UserPreferences {
  notifications: {
    push: boolean;
    sms: boolean;
    email: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    reviews: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  dietaryRestrictions: DietaryRestriction[];
  favoriteCategories: string[];
  defaultAddress?: string;
  deliveryInstructions?: string;
}

export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'halal'
  | 'kosher'
  | 'low-carb'
  | 'keto'
  | 'paleo';

export interface DeviceInfo {
  platform: 'ios' | 'android';
  osVersion: string;
  appVersion: string;
  deviceId: string;
  pushToken?: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

// User service response types
export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCategory: string;
  averageRating: number;
  reviewsCount: number;
  addressesCount: number;
}

export interface UserActivity {
  lastOrderDate?: any;
  lastReviewDate?: any;
  totalOrdersThisMonth: number;
  favoriteChefs: string[];
  preferredDeliveryTime: string;
}

// Form types
export interface UpdateProfileForm {
  displayName?: string;
  email?: string;
  photoURL?: string;
}

export interface UserPreferencesForm {
  notifications: UserPreferences['notifications'];
  theme: UserPreferences['theme'];
  language: UserPreferences['language'];
  currency: UserPreferences['currency'];
  dietaryRestrictions: DietaryRestriction[];
  favoriteCategories: string[];
  defaultAddress?: string;
  deliveryInstructions?: string;
}

// Validation types
export interface UserValidationErrors {
  phoneNumber?: string;
  displayName?: string;
  email?: string;
  role?: string;
  preferences?: Partial<Record<keyof UserPreferences, string>>;
}
