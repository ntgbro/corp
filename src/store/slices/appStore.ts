import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  // App configuration
  version: string;
  environment: 'development' | 'staging' | 'production';
  buildNumber: string;

  // UI state
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;

  // User preferences
  notificationsEnabled: boolean;
  locationEnabled: boolean;
  analyticsEnabled: boolean;

  // Push notifications settings
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    offers: boolean;
    newRestaurants: boolean;
    deliveryUpdates: boolean;
  };

  // Device and session info
  deviceId: string | null;
  sessionId: string | null;
  appOpenedAt: Date | null;

  // Location state
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;

  // Network and connectivity
  isOnline: boolean;
  networkType: 'wifi' | 'cellular' | 'none';

  // App state
  isAppActive: boolean;
  isAppInForeground: boolean;

  // Loading states
  loading: boolean;
  error: string | null;

  // Feature flags
  features: {
    enableOfflineMode: boolean;
    enablePushNotifications: boolean;
    enableAnalytics: boolean;
    enableCrashReporting: boolean;
    enableLocationServices: boolean;
    enableImageUploads: boolean;
    enableSocialLogin: boolean;
    enableGuestMode: boolean;
  };

  // Maintenance mode
  maintenance: {
    enabled: boolean;
    message: string;
    startTime: Date | null;
    endTime: Date | null;
  };
}

const initialState: AppState = {
  version: '1.0.0',
  environment: __DEV__ ? 'development' : 'production',
  buildNumber: '1',

  theme: 'system',
  language: 'en',
  currency: 'INR',

  notificationsEnabled: true,
  locationEnabled: true,
  analyticsEnabled: true,

  notifications: {
    orderUpdates: true,
    promotions: true,
    offers: true,
    newRestaurants: true,
    deliveryUpdates: true,
  },

  deviceId: null,
  sessionId: null,
  appOpenedAt: null,

  currentLocation: null,

  isOnline: true,
  networkType: 'wifi',

  isAppActive: true,
  isAppInForeground: true,

  loading: false,
  error: null,

  features: {
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableAnalytics: true,
    enableCrashReporting: true,
    enableLocationServices: true,
    enableImageUploads: true,
    enableSocialLogin: false,
    enableGuestMode: true,
  },

  maintenance: {
    enabled: false,
    message: '',
    startTime: null,
    endTime: null,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // App configuration
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },

    setEnvironment: (state, action: PayloadAction<'development' | 'staging' | 'production'>) => {
      state.environment = action.payload;
    },

    setBuildNumber: (state, action: PayloadAction<string>) => {
      state.buildNumber = action.payload;
    },

    // UI state
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },

    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },

    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },

    // User preferences
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },

    setLocationEnabled: (state, action: PayloadAction<boolean>) => {
      state.locationEnabled = action.payload;
    },

    setAnalyticsEnabled: (state, action: PayloadAction<boolean>) => {
      state.analyticsEnabled = action.payload;
    },

    // Push notifications
    updateNotifications: (state, action: PayloadAction<Partial<AppState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },

    setNotificationEnabled: (state, action: PayloadAction<{
      type: keyof AppState['notifications'];
      enabled: boolean;
    }>) => {
      state.notifications[action.payload.type] = action.payload.enabled;
    },
    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload;
    },

    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },

    setAppOpenedAt: (state, action: PayloadAction<Date>) => {
      state.appOpenedAt = action.payload;
    },

    // Location
    setCurrentLocation: (state, action: PayloadAction<AppState['currentLocation']>) => {
      state.currentLocation = action.payload;
    },

    updateLocation: (state, action: PayloadAction<{
      latitude: number;
      longitude: number;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
    }>) => {
      if (state.currentLocation) {
        state.currentLocation = { ...state.currentLocation, ...action.payload };
      } else {
        state.currentLocation = {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          address: action.payload.address,
          city: action.payload.city,
          state: action.payload.state,
          pincode: action.payload.pincode,
        };
      }
    },

    clearLocation: (state) => {
      state.currentLocation = null;
    },

    // Network and connectivity
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },

    setNetworkType: (state, action: PayloadAction<'wifi' | 'cellular' | 'none'>) => {
      state.networkType = action.payload;
    },

    // App state
    setAppActive: (state, action: PayloadAction<boolean>) => {
      state.isAppActive = action.payload;
    },

    setAppInForeground: (state, action: PayloadAction<boolean>) => {
      state.isAppInForeground = action.payload;
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Feature flags
    updateFeatureFlag: (state, action: PayloadAction<{
      feature: keyof AppState['features'];
      enabled: boolean;
    }>) => {
      state.features[action.payload.feature] = action.payload.enabled;
    },

    setFeatureFlags: (state, action: PayloadAction<Partial<AppState['features']>>) => {
      state.features = { ...state.features, ...action.payload };
    },

    // Maintenance mode
    setMaintenanceMode: (state, action: PayloadAction<{
      enabled: boolean;
      message: string;
      startTime: Date | null;
      endTime: Date | null;
    }>) => {
      state.maintenance = action.payload;
    },

    clearMaintenanceMode: (state) => {
      state.maintenance = {
        enabled: false,
        message: '',
        startTime: null,
        endTime: null,
      };
    },

    // Reset app state
    resetAppState: (state) => {
      return {
        ...initialState,
        deviceId: state.deviceId, // Preserve device ID
        sessionId: state.sessionId, // Preserve session ID
        appOpenedAt: state.appOpenedAt, // Preserve app opened time
      };
    },
  },
});

export const {
  setVersion,
  setEnvironment,
  setBuildNumber,
  setTheme,
  setLanguage,
  setCurrency,
  setNotificationsEnabled,
  setLocationEnabled,
  setAnalyticsEnabled,
  updateNotifications,
  setNotificationEnabled,
  setDeviceId,
  setSessionId,
  setAppOpenedAt,
  setCurrentLocation,
  updateLocation,
  clearLocation,
  setOnlineStatus,
  setNetworkType,
  setAppActive,
  setAppInForeground,
  setLoading,
  setError,
  clearError,
  updateFeatureFlag,
  setFeatureFlags,
  setMaintenanceMode,
  clearMaintenanceMode,
  resetAppState,
} = appSlice.actions;

export default appSlice.reducer;
