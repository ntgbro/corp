import AsyncStorage from '@react-native-async-storage/async-storage';
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Persistence keys
const PERSISTENCE_KEYS = {
  AUTH: '@corpease/auth',
  CART: '@corpease/cart',
  USER_PREFERENCES: '@corpease/user_preferences',
  APP_SETTINGS: '@corpease/app_settings',
  OFFLINE_QUEUE: '@corpease/offline_queue',
} as const;

// Whitelist: only persist these slices
const PERSIST_WHITELIST = ['auth', 'cart', 'user'] as const;

// Blacklist: never persist these slices
const PERSIST_BLACKLIST = ['orders', 'products', 'app'] as const;

export const persistenceMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);

  // Save state to AsyncStorage after certain actions
  if (shouldPersistAction((action as any)?.type)) {
    saveStateToStorage(store.getState());
  }

  return result;
};

async function saveStateToStorage(state: RootState) {
  try {
    const persistableState = getPersistableState(state);

    // Save each slice separately
    await Promise.all([
      AsyncStorage.setItem(PERSISTENCE_KEYS.AUTH, JSON.stringify(persistableState.auth)),
      AsyncStorage.setItem(PERSISTENCE_KEYS.CART, JSON.stringify(persistableState.cart)),
      AsyncStorage.setItem(PERSISTENCE_KEYS.USER_PREFERENCES, JSON.stringify(persistableState.user)),
      AsyncStorage.setItem(PERSISTENCE_KEYS.APP_SETTINGS, JSON.stringify(persistableState.app)),
    ]);

    console.log('Redux persistence: State saved to storage');
  } catch (error) {
    console.error('Redux persistence: Failed to save state', error);
  }
}

function getPersistableState(state: RootState) {
  return {
    auth: {
      user: state.auth.user,
      isAuthenticated: state.auth.isAuthenticated,
      // Don't persist loading/error states
    },
    cart: {
      items: state.cart.items,
      totalItems: state.cart.totalItems,
      totalAmount: state.cart.totalAmount,
    },
    user: {
      profile: state.user.profile,
      addresses: state.user.addresses,
      isPhoneVerified: state.user.isPhoneVerified,
    },
    app: {
      theme: state.app.theme,
      language: state.app.language,
      currency: state.app.currency,
      notifications: state.app.notifications,
      notificationsEnabled: state.app.notificationsEnabled,
      locationEnabled: state.app.locationEnabled,
      analyticsEnabled: state.app.analyticsEnabled,
    },
  };
}

function shouldPersistAction(actionType: string): boolean {
  // Persist after auth actions
  if (actionType.startsWith('auth/')) {
    return true;
  }

  // Persist after cart actions
  if (actionType.startsWith('cart/')) {
    return true;
  }

  // Persist after user actions
  if (actionType.startsWith('user/')) {
    return true;
  }

  // Persist after app settings changes
  if (actionType.startsWith('app/')) {
    return true;
  }

  return false;
}

// Utility function to load persisted state
export async function loadPersistedState(): Promise<Partial<RootState>> {
  try {
    const [authData, cartData, userPrefsData, appSettingsData] = await Promise.all([
      AsyncStorage.getItem(PERSISTENCE_KEYS.AUTH),
      AsyncStorage.getItem(PERSISTENCE_KEYS.CART),
      AsyncStorage.getItem(PERSISTENCE_KEYS.USER_PREFERENCES),
      AsyncStorage.getItem(PERSISTENCE_KEYS.APP_SETTINGS),
    ]);

    const persistedState: Partial<RootState> = {};

    if (authData) {
      persistedState.auth = JSON.parse(authData);
    }

    if (cartData) {
      persistedState.cart = JSON.parse(cartData);
    }

    if (userPrefsData || appSettingsData) {
      persistedState.user = {
        profile: null,
        addresses: [],
        isPhoneVerified: false,
        loading: false,
        error: null,
      };
    }

    if (appSettingsData) {
      persistedState.app = JSON.parse(appSettingsData);
    }

    console.log('Redux persistence: State loaded from storage');
    return persistedState;
  } catch (error) {
    console.error('Redux persistence: Failed to load state', error);
    return {};
  }
}

// Clear all persisted data
export async function clearPersistedData(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(PERSISTENCE_KEYS.AUTH),
      AsyncStorage.removeItem(PERSISTENCE_KEYS.CART),
      AsyncStorage.removeItem(PERSISTENCE_KEYS.USER_PREFERENCES),
      AsyncStorage.removeItem(PERSISTENCE_KEYS.APP_SETTINGS),
      AsyncStorage.removeItem(PERSISTENCE_KEYS.OFFLINE_QUEUE),
    ]);

    console.log('Redux persistence: All data cleared');
  } catch (error) {
    console.error('Redux persistence: Failed to clear data', error);
  }
}

// Offline queue management
export async function addToOfflineQueue(action: any): Promise<void> {
  try {
    const queueData = await AsyncStorage.getItem(PERSISTENCE_KEYS.OFFLINE_QUEUE);
    const queue = queueData ? JSON.parse(queueData) : [];

    queue.push({
      ...action,
      timestamp: Date.now(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    await AsyncStorage.setItem(PERSISTENCE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    console.log('Redux persistence: Action added to offline queue', action.type);
  } catch (error) {
    console.error('Redux persistence: Failed to add to offline queue', error);
  }
}

export async function getOfflineQueue(): Promise<any[]> {
  try {
    const queueData = await AsyncStorage.getItem(PERSISTENCE_KEYS.OFFLINE_QUEUE);
    return queueData ? JSON.parse(queueData) : [];
  } catch (error) {
    console.error('Redux persistence: Failed to get offline queue', error);
    return [];
  }
}

export async function clearOfflineQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PERSISTENCE_KEYS.OFFLINE_QUEUE);
    console.log('Redux persistence: Offline queue cleared');
  } catch (error) {
    console.error('Redux persistence: Failed to clear offline queue', error);
  }
}
