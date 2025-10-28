import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { useFirebase } from './FirebaseContext';

export interface NotificationData {
  title?: string;
  body?: string;
  image?: string;
  orderId?: string;
  type?: 'order' | 'promotion' | 'general';
  data?: any;
}

interface NotificationContextType {
  // Token management
  fcmToken: string | null;
  requestPermission: () => Promise<boolean>;
  getToken: () => Promise<string | null>;

  // Notification handling
  onNotificationReceived: (callback: (notification: NotificationData) => void) => () => void;
  onNotificationOpened: (callback: (notification: NotificationData) => void) => () => void;

  // Settings
  isPermissionGranted: boolean;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { messaging: fcm } = useFirebase();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Notification event listeners
  const [notificationReceivedCallbacks, setNotificationReceivedCallbacks] = useState<Set<(notification: NotificationData) => void>>(new Set());
  const [notificationOpenedCallbacks, setNotificationOpenedCallbacks] = useState<Set<(notification: NotificationData) => void>>(new Set());

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        console.log('🔔 Initializing push notifications...');

        // Request permission
        const permissionGranted = await requestPermission();
        setIsPermissionGranted(permissionGranted);

        if (permissionGranted) {
          // Get FCM token
          const token = await getToken();
          if (token) {
            setFcmToken(token);
            console.log('✅ FCM token obtained:', token);
          }

          // Set up notification listeners
          setupNotificationListeners();
        }
      } catch (error) {
        console.error('❌ Error initializing notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();

    // Cleanup listeners on unmount
    return () => {
      // Cleanup notification listeners if needed
    };
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        // iOS requires explicit permission request
        const authStatus = await fcm.requestPermission();
        const enabled =
          authStatus === fcm.AuthorizationStatus.AUTHORIZED ||
          authStatus === fcm.AuthorizationStatus.PROVISIONAL;

        console.log('🔔 iOS notification permission:', enabled ? 'granted' : 'denied');
        return enabled;
      } else {
        // Android - check authorization status
        const authStatus = await fcm.getAuthorizationStatus();
        const enabled = authStatus === fcm.AuthorizationStatus.AUTHORIZED ||
                       authStatus === fcm.AuthorizationStatus.PROVISIONAL;

        console.log('🔔 Android notification permission:', enabled ? 'granted' : 'denied');
        return enabled;
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return false;
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      const token = await fcm.getToken();
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  };

  const setupNotificationListeners = () => {
    // Foreground notification listener
    const unsubscribeForeground = fcm.onMessage(async (remoteMessage: any) => {
      console.log('🔔 Foreground notification received:', remoteMessage);

      const notification: NotificationData = {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        image: remoteMessage.notification?.android?.imageUrl,
        data: remoteMessage.data,
      };

      // Notify all registered callbacks
      notificationReceivedCallbacks.forEach(callback => callback(notification));
    });

    // Background/quit notification opened listener
    fcm.onNotificationOpenedApp((remoteMessage: any) => {
      console.log('🔔 Notification opened from background:', remoteMessage);

      const notification: NotificationData = {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        image: remoteMessage.notification?.android?.imageUrl,
        data: remoteMessage.data,
      };

      // Notify all registered callbacks
      notificationOpenedCallbacks.forEach(callback => callback(notification));
    });

    // Get initial notification when app was opened from quit state
    fcm
      .getInitialNotification()
      .then((remoteMessage: any) => {
        if (remoteMessage) {
          console.log('🔔 App opened from quit state by notification:', remoteMessage);

          const notification: NotificationData = {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            image: remoteMessage.notification?.android?.imageUrl,
            data: remoteMessage.data,
          };

          // Notify all registered callbacks
          notificationOpenedCallbacks.forEach(callback => callback(notification));
        }
      });

    // Return cleanup function
    return () => {
      unsubscribeForeground();
    };
  };

  const onNotificationReceived = (callback: (notification: NotificationData) => void) => {
    setNotificationReceivedCallbacks(prev => new Set([...prev, callback]));

    // Return unsubscribe function
    return () => {
      setNotificationReceivedCallbacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  };

  const onNotificationOpened = (callback: (notification: NotificationData) => void) => {
    setNotificationOpenedCallbacks(prev => new Set([...prev, callback]));

    // Return unsubscribe function
    return () => {
      setNotificationOpenedCallbacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  };

  const value: NotificationContextType = {
    fcmToken,
    requestPermission,
    getToken,
    onNotificationReceived,
    onNotificationOpened,
    isPermissionGranted,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
