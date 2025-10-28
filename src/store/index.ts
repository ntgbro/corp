import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { persistConfig, locationPersistConfig } from './persistConfig';

// Import slices
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import productsReducer from './slices/productsSlice';
import locationReducer from './slices/locationSlice';
import appReducer from './slices/appStore';
import userReducer from './slices/userSlice';

// Import middleware
import { analyticsMiddleware } from './middleware/analyticsMiddleware';
import { authMiddleware } from './middleware/authMiddleware';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  orders: ordersReducer,
  products: productsReducer,
  location: persistReducer(locationPersistConfig, locationReducer),
  app: appReducer,
  user: userReducer,
  // Add more slices here as they are implemented
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check in development to avoid Redux Persist noise
      serializableCheck: __DEV__ ? false : {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
        ignoredPaths: [
          '_persist',
          'auth.user.joinedAt',
          'user.profile.joinedAt',
        ],
        isSerializable: (value: any) => {
          // Allow Redux Persist metadata
          if (value && typeof value === 'object' && '_persist' in value) {
            return true;
          }
          // Allow Firestore Timestamp objects
          if (value && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
            return true;
          }
          // Allow Date objects
          if (value instanceof Date) {
            return true;
          }
          return false;
        },
      },
      immutableCheck: {
        warnAfter: 128,
      },
    })
      .concat(analyticsMiddleware)
      .concat(authMiddleware),
  devTools: __DEV__, // Enable Redux DevTools in development
});

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Action types for easier dispatching
export type AppAction = ReturnType<AppDispatch>;

// Selector types
export type Selector<T> = (state: RootState) => T;

// Thunk types
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState,
) => ReturnType;

// Store configuration
export const storeConfig = {
  version: '1.0.0',
  environment: __DEV__ ? 'development' : 'production',
  features: {
    reduxDevTools: __DEV__,
    persistence: true,
    middleware: {
      analytics: true,
      auth: true,
      error: true,
      persistence: true,
    },
  },
};

// Helper functions
export const getStoreState = () => store.getState();

export const dispatchAction = <T>(action: (dispatch: AppDispatch) => T) => {
  return action(store.dispatch);
};

export const selectFromStore = <T>(selector: (state: RootState) => T): T => {
  return selector(store.getState());
};

// Store utilities
export const resetStore = async (): Promise<void> => {
  await persistor.purge();
  store.dispatch({ type: 'RESET_STORE' });
};

export const rehydrateStore = async (): Promise<void> => {
  await persistor.flush();
};

// Development helpers
export const getStoreInfo = () => {
  const state = store.getState();

  return {
    version: storeConfig.version,
    environment: storeConfig.environment,
    slices: Object.keys(state),
    persistence: {
      rehydrated: persistor.getState(),
    },
    middleware: storeConfig.features.middleware,
  };
};

export default store;
