import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

// Redux Persist configuration
export const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,

  // Whitelist: only persist these reducers
  whitelist: [
    'auth',        // User authentication state
    'cart',        // Shopping cart data
    'location',    // User location and delivery address
    'user',        // User profile and preferences
    'app',         // App settings
  ],

  // Blacklist: never persist these reducers
  blacklist: [
    'orders',      // Orders are fetched fresh
    'products',    // Products are fetched fresh
    'notifications', // Real-time notifications
  ],

  // Custom serialization for complex objects
  serialize: true,
  deserialize: true,

  // Timeout for storage operations
  timeout: 10000,

  // Migration strategies for version changes
  migrate: (state: any, version: number) => {
    if (version === 0) {
      // Migration from version 0 to 1
      return {
        ...state,
        // Add any migration logic here
        _persist: {
          version: 1,
          rehydrated: false,
        },
      };
    }
    return state;
  },

  // Custom transform functions
  transforms: [],

  // Debug mode
  debug: __DEV__,

  // State reconciler
  stateReconciler: undefined,

  // Write fail handler
  writeFailHandler: (error: Error) => {
    console.error('Redux Persist: Write failed', error);
  },

  // Immutable check
  immutableCheck: __DEV__ ? {
    warnAfter: 128,
  } : false,
};

// Individual reducer configurations
export const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['user', 'isAuthenticated'],
  blacklist: ['loading', 'error'],
};

export const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['items', 'totalItems', 'totalAmount'],
};

export const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['profile', 'addresses', 'preferences'],
  blacklist: ['loading', 'error'],
};

export const locationPersistConfig = {
  key: 'location',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['currentLocation', 'savedAddresses'], // Persist location data
  blacklist: ['loading', 'error', 'permissionStatus'], // Don't persist temporary states
};

// Persistence status
export type PersistStatus = 'idle' | 'loading' | 'success' | 'error' | 'purging';

export interface PersistState {
  version: number;
  rehydrated: boolean;
  status: PersistStatus;
}

// Helper functions
export const clearAllPersistedData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('Redux Persist: All persisted data cleared');
  } catch (error) {
    console.error('Redux Persist: Failed to clear data', error);
    throw error;
  }
};

export const getPersistedKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(key => key.startsWith('@corpease/'));
  } catch (error) {
    console.error('Redux Persist: Failed to get keys', error);
    return [];
  }
};

export const getPersistedDataSize = async (): Promise<number> => {
  try {
    const keys = await getPersistedKeys();
    let totalSize = 0;

    for (const key of keys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        totalSize += data.length;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Redux Persist: Failed to get data size', error);
    return 0;
  }
};
