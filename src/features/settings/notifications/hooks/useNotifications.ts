import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from '@react-native-firebase/firestore';
import { QueryDocumentSnapshot } from '../../../../types/firebase';

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: any;
  actionURL?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.userId) {
      try {
        setLoading(true);
        
        // Listen for notifications in the user's notifications subcollection
        const notificationsQuery = query(
          collection(db, 'users', user.userId, 'notifications'),
          orderBy('createdAt', 'desc')
        );
        
        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
          const notificationList: UserNotification[] = [];
          snapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
            notificationList.push({
              id: doc.id,
              ...doc.data()
            } as UserNotification);
          });
          
          // Debug: Log the fetched notifications
          console.log('Fetched notifications from Firebase:', notificationList);
          
          setNotifications(notificationList);
          setUnreadCount(notificationList.filter(n => !n.isRead).length);
          setLoading(false);
        }, (error) => {
          console.error('Error listening to notifications:', error);
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up notifications listener:', error);
        setLoading(false);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [user?.userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      if (user?.userId) {
        const notificationRef = doc(db, 'users', user.userId, 'notifications', notificationId);
        await updateDoc(notificationRef, { isRead: true });
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      if (user?.userId) {
        // Update all unread notifications
        const unreadNotifications = notifications.filter(n => !n.isRead);
        const updatePromises = unreadNotifications.map(notification => {
          const notificationRef = doc(db, 'users', user.userId!, 'notifications', notification.id);
          return updateDoc(notificationRef, { isRead: true });
        });
        
        await Promise.all(updatePromises);
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};