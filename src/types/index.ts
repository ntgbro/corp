// Type definitions for the entire app
export interface User {
  id: string;
  phoneNumber: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  role: 'customer' | 'chef' | 'admin';
  isVerified: boolean;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
    favoriteCategories: string[];
    dietaryRestrictions: string[];
  };
  createdAt: any;
  lastLoginAt: any;
}

export interface Chef {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  photoURL?: string;
  rating: number;
  reviewCount: number;
  description: string;
  specialties: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  serviceType: string[];
  isAvailable: boolean;
  verified: boolean;
  deliveryRadius: number;
  minimumOrder: number;
  preparationTime: number;
  workingHours: {
    [key: string]: { open: string; close: string };
  };
  menuHighlights: string[];
  certifications: string[];
  createdAt: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categoryId: string;
  chefId: string;
  serviceType: string;
  isAvailable: boolean;
  stock: number;
  unit: string;
  rating: number;
  reviewCount: number;
  preparationTime: number;
  tags: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  ingredients: string[];
  servingSize: string;
  spiceLevel: 'none' | 'mild' | 'medium' | 'hot' | 'extra-hot';
  isVegetarian: boolean;
  isVegan: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  serviceType: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  tags: string[];
  createdAt: any;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  bannerImage?: string;
  isActive: boolean;
  sortOrder: number;
  features: string[];
  pricing: {
    baseDeliveryFee: number;
    minimumOrder: number;
    freeDeliveryThreshold: number;
  };
  createdAt: any;
}

export interface Order {
  id: string;
  userId: string;
  chefId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  deliveryAddress: Address;
  deliveryInstructions?: string;
  estimatedDeliveryTime: any;
  actualDeliveryTime?: any;
  chefNotes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
  createdAt: any;
}

export interface Review {
  id: string;
  userId: string;
  targetId: string; // productId or chefId
  targetType: 'product' | 'chef';
  rating: number;
  comment: string;
  images?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  chefId: string;
  chefName: string;
  specialInstructions?: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  PhoneAuth: undefined;
  OTPVerification: { phoneNumber: string; confirm: any };
};

export type MainTabParamList = {
  Home: undefined;
  Product: { categoryId?: string };
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type ProductStackParamList = {
  ProductList: { categoryId?: string };
  ProductDetail: { productId: string };
  ProductReviews: { productId: string };
};

export type OrderStackParamList = {
  OrdersList: undefined;
  OrderDetail: { orderId: string };
  OrderTracking: { orderId: string };
  OrderRating: { orderId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Preferences: undefined;
  AddressBook: undefined;
  AddAddress: undefined;
  EditAddress: { addressId: string };
  Settings: undefined;
  Privacy: undefined;
};

export type ChefStackParamList = {
  ChefList: { serviceType?: string };
  ChefDetail: { chefId: string };
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  phoneNumber: string;
}

export interface OTPForm {
  code: string;
}

export interface ProductFilters {
  categoryId?: string;
  chefId?: string;
  serviceType?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'rating' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  query: string;
  categoryId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
}

// Error types
export interface FirebaseError {
  code: string;
  message: string;
  details?: any;
}

export interface AppError {
  type: 'network' | 'auth' | 'permission' | 'validation' | 'server' | 'unknown';
  message: string;
  code?: string;
  details?: any;
}

// Theme and UI types
export interface ThemeColors {
  primary: string;
  secondary: string;
  error: string;
  warning: string;
  success: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  white: string;
  black: string;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface Typography {
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
}

// Component prop types
export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  showChef?: boolean;
  compact?: boolean;
}

export interface ChefCardProps {
  chef: Chef;
  onPress?: (chef: Chef) => void;
  showMenu?: boolean;
  compact?: boolean;
}

export interface OrderCardProps {
  order: Order;
  onPress?: (order: Order) => void;
  showStatus?: boolean;
  compact?: boolean;
}

// Hook return types
export interface UseAuthReturn {
  user: User | null;
  firebaseUser: any;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface UseCartReturn {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

// Store types
export interface RootState {
  auth: AuthState;
  cart: CartState;
  orders: OrdersState;
  products: ProductsState;
  user: UserState;
  app: AppState;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export interface ProductsState {
  products: Product[];
  categories: Category[];
  services: Service[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  searchQuery: string;
}

export interface UserState {
  profile: User | null;
  addresses: Address[];
  preferences: User['preferences'];
  loading: boolean;
  error: string | null;
}

export interface AppState {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  loading: boolean;
  error: string | null;
}
