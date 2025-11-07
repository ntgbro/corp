import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { NotificationItem } from '../components/NotificationItem';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationsScreen = () => {
  const { theme } = useThemeContext();
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  // Debug: Log notifications to see what data is being fetched
  useEffect(() => {
    console.log('Notifications fetched:', notifications);
  }, [notifications]);

  const handleRefresh = () => {
    setRefreshing(true);
    // In a real implementation, you might want to refresh the data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark notifications as read');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotificationItems = () => {
    return notifications.map(notification => (
      <NotificationItem
        key={notification.id}
        id={notification.id}
        title={notification.title}
        description={notification.message}
        enabled={!notification.isRead}
        onToggle={handleMarkAsRead}
      />
    ));
  };

  return (
    <SafeAreaWrapper>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.content}>
          {loading ? (
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading notifications...
            </Text>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No notifications yet
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                We'll notify you when something important happens
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary, marginTop: 16, textAlign: 'center' }]}>
                If you're seeing preference settings here, please restart the app to refresh the data.
              </Text>
            </View>
          ) : (
            <>
              {unreadCount > 0 && (
                <View style={styles.headerActions}>
                  <TouchableOpacity 
                    style={[styles.markAllButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleMarkAllAsRead}
                  >
                    <Text style={[styles.markAllText, { color: theme.colors.white }]}>
                      Mark All as Read
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {renderNotificationItems()}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 8,
  },
  markAllButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});

export default NotificationsScreen;