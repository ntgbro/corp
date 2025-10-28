// Common shared types used across the application

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  timestamp: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  message?: string;
}

export interface ListResponse<T = any> extends PaginatedResponse<T> {
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

// Form and validation types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'password' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'time' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: ValidationRule[];
  defaultValue?: any;
}

export interface FormFieldOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Location and geography types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: Coordinates;
  type: 'home' | 'work' | 'restaurant' | 'office' | 'other';
  isDefault?: boolean;
  instructions?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: Coordinates;
  placeId?: string;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
}

// Image and media types
export interface ImageUpload {
  uri: string;
  type: string;
  fileName: string;
  fileSize?: number;
}

export interface ImageInfo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  size: number;
  type: string;
  uploadedAt: any;
  uploadedBy: string;
}

// Notification types
export interface NotificationSettings {
  pushNotifications: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  reviews: boolean;
  chefUpdates: boolean;
  deliveryUpdates: boolean;
  marketing: boolean;
}

export interface PushNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  type: NotificationType;
  priority: 'low' | 'normal' | 'high';
  read: boolean;
  createdAt: any;
}

export type NotificationType =
  | 'order_status'
  | 'order_ready'
  | 'order_delivered'
  | 'new_review'
  | 'chef_response'
  | 'promotion'
  | 'system'
  | 'reminder'
  | 'payment'
  | 'delivery';

// Payment types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'net_banking' | 'wallet' | 'cash';
  name: string;
  details: {
    cardNumber?: string;
    cardType?: string;
    upiId?: string;
    bankName?: string;
    walletType?: string;
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Transaction {
  id: string;
  userId: string;
  orderId?: string;
  amount: number;
  type: 'debit' | 'credit' | 'refund' | 'transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  transactionId: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: any;
  updatedAt: any;
}

// Search and filter types
export interface SearchFilters {
  query: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  location?: Coordinates;
  distance?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  tags?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isOrganic?: boolean;
  availability?: boolean;
}

export interface FilterOption {
  id: string;
  name: string;
  value: any;
  count?: number;
  selected: boolean;
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventName: string;
  properties?: Record<string, any>;
  timestamp: any;
  sessionId?: string;
  deviceInfo?: DeviceInfo;
}

export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  osVersion: string;
  appVersion: string;
  deviceId: string;
  deviceModel: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

// Error types
export interface AppError {
  id: string;
  code: string;
  message: string;
  type: 'network' | 'auth' | 'permission' | 'validation' | 'server' | 'unknown';
  statusCode?: number;
  details?: Record<string, any>;
  timestamp: any;
  userId?: string;
  context?: string;
  stackTrace?: string;
}

export interface ErrorReport {
  error: AppError;
  user: {
    id: string;
    role: string;
    deviceInfo: DeviceInfo;
  };
  app: {
    version: string;
    environment: string;
    build: string;
  };
  additionalData?: Record<string, any>;
}

// Cache and offline types
export interface CacheItem<T = any> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
  version?: string;
}

export interface OfflineQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  documentId: string;
  data?: any;
  timestamp: number;
  retryCount: number;
  lastError?: string;
}

// Configuration types
export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  firebase: {
    projectId: string;
    apiKey: string;
    authDomain: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  features: {
    [key: string]: boolean;
  };
  maintenance: {
    enabled: boolean;
    message: string;
    startTime: any;
    endTime: any;
  };
  limits: {
    maxCartItems: number;
    maxCartValue: number;
    maxOrderValue: number;
    maxImagesPerProduct: number;
    maxReviewsPerDay: number;
  };
  support: {
    email: string;
    phone: string;
    whatsapp: string;
    helpUrl: string;
  };
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ViewMode = 'list' | 'grid' | 'card' | 'compact';

export interface InfiniteScrollState {
  loading: boolean;
  hasNextPage: boolean;
  loadingMore: boolean;
  error?: string;
}

export interface SearchState {
  query: string;
  results: any[];
  loading: boolean;
  error?: string;
  hasSearched: boolean;
}

// Component prop types
export interface BaseComponentProps {
  testID?: string;
  style?: any;
  children?: React.ReactNode;
}

export interface ListComponentProps<T> extends BaseComponentProps {
  data: T[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  refreshing?: boolean;
  hasMore?: boolean;
  emptyMessage?: string;
  renderItem: (item: T, index: number) => React.ReactElement;
}

export interface FormComponentProps extends BaseComponentProps {
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  values: Record<string, any>;
  onChange: (field: string, value: any) => void;
  onBlur?: (field: string) => void;
  onSubmit?: () => void;
}

// Hook return types
export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  reset: () => void;
}

export interface UseSearchReturn<T> {
  query: string;
  results: T[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  search: (query: string) => void;
  clear: () => void;
}
