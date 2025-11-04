import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';

export interface NotificationSetting {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
  category: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const userDocRef = doc(db, 'users', user.userId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userNotifications = userData?.preferences?.notifications || {};
            
            // Map Firebase data to our notification settings structure
            const notificationSettings: NotificationSetting[] = [
              {
                id: 'order_updates',
                title: 'Order Updates',
                description: 'Get notified about your order status',
                enabled: userNotifications.orderUpdates ?? true,
                category: 'orders',
              },
              {
                id: 'promotions',
                title: 'Promotions',
                description: 'Receive updates about special offers',
                enabled: userNotifications.promotions ?? true,
                category: 'marketing',
              },
              {
                id: 'offers',
                title: 'Special Offers',
                description: 'Get notified about special offers',
                enabled: userNotifications.offers ?? true,
                category: 'marketing',
              },
            ];
            
            setNotifications(notificationSettings);
          }
        } catch (error) {
          console.error('Error fetching notification settings:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setNotifications([]);
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, [user?.userId]);

  const toggleNotification = async (id: string, enabled: boolean) => {
    setSaving(true);
    try {
      if (user?.userId) {
        const userDocRef = doc(db, 'users', user.userId);
        
        // Map the notification ID to the Firebase field
        let fieldToUpdate = {};
        switch (id) {
          case 'order_updates':
            fieldToUpdate = { 'preferences.notifications.orderUpdates': enabled };
            break;
          case 'promotions':
            fieldToUpdate = { 'preferences.notifications.promotions': enabled };
            break;
          case 'offers':
            fieldToUpdate = { 'preferences.notifications.offers': enabled };
            break;
          default:
            throw new Error('Unknown notification type');
        }
        
        await updateDoc(userDocRef, fieldToUpdate);
        
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, enabled } : notification
          )
        );
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateAllNotifications = async (enabled: boolean) => {
    setSaving(true);
    try {
      if (user?.userId) {
        const userDocRef = doc(db, 'users', user.userId);
        const updateData = {
          'preferences.notifications.orderUpdates': enabled,
          'preferences.notifications.promotions': enabled,
          'preferences.notifications.offers': enabled,
        };
        
        await updateDoc(userDocRef, updateData);
        
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, enabled }))
        );
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    notifications,
    loading,
    saving,
    toggleNotification,
    updateAllNotifications,
  };
};