import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsItem } from '../components/SettingsItem';
import { useFirebase } from '../../../contexts/FirebaseContext';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'promotion' | 'order_update' | 'price_drop' | 'stock_alert' | 'general';
  data?: any;
  timestamp: any; // Firestore timestamp
  read: boolean;
}

export const NotificationSettingsScreen = () => {
  const theme = useTheme();
  const colors = theme.colors as any; // Temporary workaround for theme type
  const { firestore, auth } = useFirebase();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      if (!auth.currentUser?.uid) return;
      
      const notificationsRef = firestore()
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('notifications')
        .orderBy('timestamp', 'desc')
        .limit(50);

      const snapshot = await notificationsRef.get();
      const notificationsData = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [auth.currentUser?.uid]);

  const markAsRead = async (id: string) => {
    try {
      if (!auth.currentUser?.uid) return;
      
      await firestore()
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('notifications')
        .doc(id)
        .update({ read: true });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return '🎁';
      case 'order_update':
        return '📦';
      case 'price_drop':
        return '💰';
      case 'stock_alert':
        return '🔔';
      default:
        return '📢';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return '';
    return format(timestamp.toDate(), 'MMM d, yyyy h:mm a');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No notifications yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text + '80' }]}>
              We'll notify you when there's something new
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SettingsItem
            key={item.id}
            icon={getNotificationIcon(item.type)}
            title={item.title}
            subtitle={item.body}
            onPress={() => markAsRead(item.id)}
            rightComponent={
              <Text style={[styles.timeText, { color: colors.text + '80' }]}>
                {formatDate(item.timestamp)}
              </Text>
            }
            containerStyle={!item.read ? { 
              backgroundColor: `${colors.primary}20`,
              marginHorizontal: 8,
              marginVertical: 4,
              borderRadius: 8,
            } : {
              marginHorizontal: 8,
              marginVertical: 4,
              borderRadius: 8,
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
