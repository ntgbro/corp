import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { NotificationItem } from '../components/NotificationItem';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationsScreen = () => {
  const { theme } = useThemeContext();
  const { notifications, loading, saving, toggleNotification, updateAllNotifications } = useNotifications();
  const [masterSwitch, setMasterSwitch] = useState(true);

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await toggleNotification(id, enabled);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification setting');
    }
  };

  const handleMasterToggle = async (enabled: boolean) => {
    setMasterSwitch(enabled);
    try {
      await updateAllNotifications(enabled);
      Alert.alert('Success', `All notifications ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const renderNotificationItems = () => {
    return notifications.map(notification => (
      <NotificationItem
        key={notification.id}
        id={notification.id}
        title={notification.title}
        description={notification.description}
        enabled={notification.enabled}
        onToggle={handleToggle}
      />
    ));
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Notifications</Text>
        
        <View style={[styles.masterSwitchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.masterSwitchLabel, { color: theme.colors.text }]}>Enable All Notifications</Text>
          <Switch
            value={masterSwitch}
            onValueChange={handleMasterToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="white"
          />
        </View>
        
        <View style={styles.content}>
          {loading ? (
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading notification settings...
            </Text>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No notification settings available
              </Text>
            </View>
          ) : (
            renderNotificationItems()
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  masterSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  masterSwitchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    fontSize: 16,
  },
});

export default NotificationsScreen;