import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Auth middleware to handle authentication side effects
export const authMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);
  const typedAction = action as { type: string; payload?: any };

  // Handle user sign out
  if (typedAction.type === 'auth/signOut') {
    // Clear all data when user signs out
    store.dispatch({ type: 'cart/clearCart' } as any);
    store.dispatch({ type: 'orders/clearOrders' } as any);
    store.dispatch({ type: 'products/clearProducts' } as any);
    store.dispatch({ type: 'notifications/clearNotifications' } as any);

    console.log('Auth middleware: Cleared all user data on sign out');
  }

  // Handle user profile updates
  if (typedAction.type === 'auth/updateUser') {
    // Update preferences in other parts of the app
    console.log('Auth middleware: User profile updated', typedAction.payload);
  }

  // Handle successful authentication
  if (typedAction.type === 'auth/setUser' && typedAction.payload) {
    const state = store.getState() as RootState;

    // Update app session info
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    store.dispatch({ type: 'app/setSessionId', payload: sessionId } as any);

    // Track successful login
    console.log('Auth middleware: User logged in successfully', {
      userId: typedAction.payload.id,
      phoneNumber: typedAction.payload.phoneNumber,
      role: typedAction.payload.role,
    });

    // Update preferences in other parts of the app
    console.log('Auth middleware: User profile updated', typedAction.payload);
  }

  // Handle authentication errors
  if (typedAction.type === 'auth/setError') {
    const error = typedAction.payload;

    // Only log actual errors, not when clearing errors (null)
    if (error) {
      console.error('🔐 Auth Error:', error);
      console.error('📍 Stack trace:', new Error().stack);

      // Could trigger additional error handling here
      // For example, show a user-friendly error message
      // or trigger analytics tracking
    } else {
      // Optional: Log when errors are cleared for debugging
      // console.log('Auth middleware: Error cleared');
    }
  }

  // Handle user preferences updates
  if (typedAction.type === 'auth/updateUserPreferences') {
    const preferences = typedAction.payload;

    // Update notification settings if changed
    if (preferences.notifications !== undefined) {
      store.dispatch({
        type: 'notifications/updateSettings',
        payload: { pushNotifications: preferences.notifications }
      } as any);
    }

    // Update theme if changed
    if (preferences.darkMode !== undefined) {
      const theme = preferences.darkMode ? 'dark' : 'light';
      store.dispatch({ type: 'app/setTheme', payload: theme } as any);
    }

    console.log('Auth middleware: User preferences updated', preferences);
  }

  // Handle JWT token operations
  if (typedAction.type === 'auth/setTokens') {
    const { jwtToken, refreshToken, tokenExpiry } = typedAction.payload;

    console.log('Auth middleware: JWT tokens stored', {
      hasToken: !!jwtToken,
      hasRefreshToken: !!refreshToken,
      expiresAt: new Date(tokenExpiry).toISOString(),
    });

    // Store tokens in secure storage (AsyncStorage)
    // This would be handled by persistence middleware
  }

  // Handle token refresh
  if (typedAction.type === 'auth/refreshToken') {
    console.log('Auth middleware: Token refresh initiated');
  }

  return result;
};

// JWT Token utilities
export const generateJWTToken = async (userId: string, userData: any): Promise<string> => {
  // In a real implementation, this would call your backend API
  // For now, we'll create a simple JWT-like token for demo purposes

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    userId,
    email: userData.email,
    role: userData.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };

  // Simple base64 encoding (not cryptographically secure)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  // For demo purposes, we'll use a simple signature
  const signature = btoa(`${encodedHeader}.${encodedPayload}.demo_signature`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const validateJWTToken = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const refreshJWTToken = async (refreshToken: string): Promise<string | null> => {
  // In a real implementation, this would call your backend API
  // For demo purposes, return null to indicate refresh failed
  console.log('Token refresh requested with token:', refreshToken);
  return null;
};

// Additional auth middleware for token refresh
export const tokenRefreshMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);

  // Check if tokens are expired and refresh them
  const state = store.getState() as RootState;

  if (state.auth.jwtToken && state.auth.tokenExpiry) {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = state.auth.tokenExpiry - currentTime;

    // Refresh token if it expires within 5 minutes
    if (timeUntilExpiry < 300) {
      console.log('Token expiring soon, refreshing...');
      // Trigger token refresh
      store.dispatch({ type: 'auth/refreshToken' } as any);
    }
  }

  return result;
};

// Auth validation middleware
export const authValidationMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const typedAction = action as { type: string; payload?: any };

  // Validate authentication state before certain actions
  const state = store.getState() as RootState;

  // For example, prevent certain actions if user is not authenticated
  if (typedAction.type.startsWith('orders/') || typedAction.type.startsWith('cart/')) {
    if (!state.auth.isAuthenticated) {
      console.warn('Auth validation: Action requires authentication', typedAction.type);
      // Could dispatch an error or redirect to login
      // store.dispatch({ type: 'auth/setError', payload: 'Authentication required' });
    }
  }

  return next(action);
};

// Auth persistence middleware
export const authPersistenceMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);

  // Persist authentication state changes
  const typedAction = action as { type: string; payload?: any };

  if (typedAction.type === 'auth/setUser' || typedAction.type === 'auth/signOut' || typedAction.type === 'auth/setTokens') {
    // Trigger save to persistent storage
    // This is handled by the main persistence middleware
    // but we can add additional auth-specific persistence logic here
    console.log('Auth persistence: Saving auth state to storage');
  }

  return result;
};
