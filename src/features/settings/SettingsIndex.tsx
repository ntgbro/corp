import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../components/layout';
import { useThemeContext } from '../../contexts/ThemeContext';
import { SettingsStackParamList } from './navigation/SettingsNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type SettingsNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsHome'>;

export const SettingsIndex = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation<SettingsNavigationProp>();

  const settingsSections = [
    { id: 'profile', title: 'Profile', description: 'Manage your personal information', icon: '👤' },
    { id: 'orders', title: 'Orders', description: 'View your order history', icon: '📦' },
    { id: 'wishlist', title: 'Wishlist', description: 'View your saved items', icon: '❤️' },
    { id: 'addresses', title: 'Addresses', description: 'Manage your saved addresses', icon: '📍' },
    { id: 'preferences', title: 'Preferences', description: 'Manage your app preferences', icon: '⚙️' },
    { id: 'notifications', title: 'Notifications', description: 'Manage your notification preferences', icon: '🔔' },
    { id: 'generalInfo', title: 'General Information', description: 'App version and information', icon: 'ℹ️' },
    { id: 'helpSupport', title: 'Help & Support', description: 'Get help and support', icon: '❓' },
    { id: 'socialMedia', title: 'Follow Us', description: 'Connect with us on social media', icon: '🌐' },
  ];

  const handleNavigate = (sectionId: string) => {
    // Map section IDs to navigation names
    const navigationMap: Record<string, keyof SettingsStackParamList> = {
      profile: 'Profile',
      orders: 'Orders',
      wishlist: 'Wishlist',
      addresses: 'Addresses',
      preferences: 'Preferences',
      notifications: 'Notifications',
      generalInfo: 'GeneralInfo',
      helpSupport: 'HelpSupport',
      socialMedia: 'SocialMedia',
    };

    const target = navigationMap[sectionId];
    if (target) {
      navigation.navigate(target);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Settings</Text>
        <View style={styles.content}>
          {settingsSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => handleNavigate(section.id)}
            >
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionIcon, { color: theme.colors.primary }]}>{section.icon}</Text>
                <View style={styles.sectionText}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
                  <Text style={[styles.sectionDescription, { color: theme.colors.textSecondary }]}>{section.description}</Text>
                </View>
                <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 16,
  },
});

export default SettingsIndex;