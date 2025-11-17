import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
// Import the modular API functions
import { getMessaging, requestPermission as requestMessagingPermission, hasPermission, getToken as getMessagingToken, onMessage, onNotificationOpenedApp, getInitialNotification, AuthorizationStatus } from '@react-native-firebase/messaging';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { updateSessionWithFCMToken } from '../utils/userSubcollections';
import { useAuth } from './AuthContext';

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
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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
            
            // Update session with FCM token if user is authenticated
            if (user?.userId) {
              await updateSessionWithFCMToken(user.userId, token);
            }
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
  }, [user?.userId]);

  const requestPermission = async (): Promise<boolean> => {
    try {
      // Get messaging instance
      const messaging = getMessaging();
      
      // Request permission using the correct Firebase Messaging API
      await requestMessagingPermission(messaging);
      const authStatus = await hasPermission(messaging);
      const enabled = authStatus === AuthorizationStatus.AUTHORIZED ||
                     authStatus === AuthorizationStatus.PROVISIONAL;

      console.log('🔔 Notification permission:', enabled ? 'granted' : 'denied');
      return enabled;
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return false;
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      const messaging = getMessaging();
      const token = await getMessagingToken(messaging);
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  };

  const setupNotificationListeners = () => {
    const messaging = getMessaging();
    
    // Foreground notification listener
    const unsubscribeForeground = onMessage(messaging, async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
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
    onNotificationOpenedApp(messaging, (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
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
    getInitialNotification(messaging)
      .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
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