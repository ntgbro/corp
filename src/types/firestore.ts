// src/types/firestore.ts
// Updated interfaces for new Firestore collections

export interface User {
  userId: string;
  phone: string;
  displayName: string;
  email: string;
  profilePhotoURL: string;
  role: 'customer' | 'restaurant_owner' | 'admin' | 'delivery_partner';
  status: 'active' | 'suspended' | 'pending_verification' | 'deactivated';
  preferences: {
    cuisines: string[];
    foodTypes: string[];
    notifications: {
      orderUpdates: boolean;
      promotions: boolean;
      offers: boolean;
    };
  };
  loyaltyPoints: number;
  totalOrders: number;
  joinedAt: Date;
}

export interface MenuItem {
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageURL?: string;
  isAvailable: boolean;
  preparationTime: number;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  restaurantId: string; // Made this required since we're ensuring it's always populated
  // New fields
  allergens?: string[];
  cuisine?: string;
  galleryURLs?: string[];
  ingredients?: string[];
  isVeg?: boolean;
  orderCount?: number;
  portionSize?: string;
  prepTime?: string;
  rating?: number;
  serviceId?: string;
  spiceLevel?: string;
  status?: string;
  tags?: string[];
  createdAt?: any;
  updatedAt?: any;
  mainImageURL?: string;
}

export interface Service {
  serviceId: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageURL?: string;
  stockQuantity: number;
  supplier: string;
  expiryDate?: Date;
}

export interface Restaurant {
  restaurantId: string;
  name: string;
  ownerId: string;
  logoURL: string;
  bannerURL: string;
  galleryURLs: string[];
  description: string;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    geoPoint: any; // GeoPoint from Firestore
  };
  cityId: string;
  phone: string;
  email: string;
  cuisines: string[];
  avgRating: number;
  totalRatings: number;
  priceRange: string;
  openHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  deliveryCharges: number;
  freeDeliveryAbove: number;
  minOrderAmount: number;
  maxDeliveryRadius: number;
  avgDeliveryTime: string;
  isActive: boolean;
  isPromoted: boolean;
  isPureVeg: boolean;
  hasOnlinePayment: boolean;
  hasCashOnDelivery: boolean;
  orderCount: number;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
  serviceId: string;
  serviceIds?: string[]; // Multiple services
  needsSetup?: boolean;
  deliveryLocation?: {
    cityId: string;
    cityName: string;
    isDeliverable: boolean;
    pincodeCode: string;
    pincodeId: string;
    pincodeName: string;
    zoneId: string;
    zoneName: string;
  };
  deliveryLocations?: Array<{
    cityId: string;
    cityName: string;
    isDeliverable: boolean;
    pincodeCode: string;
    pincodeId: string;
    pincodeName: string;
    zoneId: string;
    zoneName: string;
  }>;
}

export interface Order {
  orderId: string;
  userId: string;
  restaurantId: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface OrderItem {
  itemId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface StatusHistory {
  statusId: string;
  status: string;
  timestamp: Date;
  notes?: string;
}

export interface Payment {
  paymentId: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
}
