import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/firebase/auth/authService';
import { useAuth } from '../contexts/AuthContext';
import { APP_CONFIG } from '../config/constants';

export interface UseAuthReturn {
  user: ReturnType<typeof useAuth>['user'];
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuthGlobal = (): UseAuthReturn => {
  const authContext = useAuth();

  return {
    ...authContext,
    isAuthenticated: !!authContext.user,
  };
};

// Hook for Firebase operations
export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage = 'Operation failed'
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err: any) {
      const errorMsg = err?.message || errorMessage;
      setError(errorMsg);
      console.error('Firestore operation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, executeAsync };
};

// Hook for image operations
export const useImagePicker = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = useCallback(async (options?: {
    mediaType?: 'photo' | 'video';
    includeBase64?: boolean;
    maxHeight?: number;
    maxWidth?: number;
    quality?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // For now, return a placeholder - implement with actual image picker library
      const imageUri = 'placeholder_image_uri';

      return imageUri;
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to pick image';
      setError(errorMsg);
      console.error('Image picker error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, pickImage };
};

// Hook for location services
export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, return placeholder - implement with actual location library
      const mockLocation = {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'New Delhi, India',
      };

      setLocation(mockLocation);
      return mockLocation;
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to get location';
      setError(errorMsg);
      console.error('Location error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, location, getCurrentLocation };
};

// Hook for analytics
export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    try {
      // For now, just log - implement with actual analytics service
      console.log('Analytics Event:', eventName, parameters);

      // Example Firebase Analytics integration:
      // analytics().logEvent(eventName, parameters);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  const trackScreen = useCallback((screenName: string, screenClass?: string) => {
    try {
      console.log('Screen View:', screenName, screenClass);
      // analytics().logScreenView({ screen_name: screenName, screen_class: screenClass });
    } catch (error) {
      console.error('Screen tracking error:', error);
    }
  }, []);

  return { trackEvent, trackScreen };
};

// Hook for offline data sync
export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(false);

  useEffect(() => {
    // Network status monitoring would go here
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners for online/offline status
    // window.addEventListener('online', handleOnline);
    // window.addEventListener('offline', handleOffline);

    return () => {
      // Cleanup event listeners
      // window.removeEventListener('online', handleOnline);
      // window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = useCallback(async () => {
    if (!isOnline) {
      setPendingSync(true);
      return false;
    }

    try {
      // Implement sync logic here
      console.log('Syncing offline data...');
      setPendingSync(false);
      return true;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  }, [isOnline]);

  return { isOnline, pendingSync, syncData };
};

// Hook for app settings
export const useAppSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'en',
    currency: 'INR',
    locationServices: true,
  });

  const updateSetting = useCallback(<K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    // Persist to storage
    try {
      // AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
      console.log('Settings updated:', key, value);
    } catch (error) {
      console.error('Settings persistence error:', error);
    }
  }, []);

  return { settings, updateSetting };
};

export default {
  useAuthGlobal,
  useFirestore,
  useImagePicker,
  useLocation,
  useAnalytics,
  useOfflineSync,
  useAppSettings,
};
