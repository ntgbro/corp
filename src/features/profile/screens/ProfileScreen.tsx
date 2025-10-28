import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../../config/theme';
import { useNavigation } from '@react-navigation/native';
import { Avatar, ListItem, Divider } from '../../../components/common';
import { SectionHeader } from '../../../components/layout';
import { SafeAreaWrapper } from '../../../components/layout';

interface UserProfile {
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john@example.com',
    avatar: undefined,
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // Handle logout logic
          console.log('User logged out');
        }},
      ]
    );
  };

  const menuItems = [
    {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: '👤',
      onPress: () => console.log('Edit profile'),
    },
    {
      title: 'My Addresses',
      subtitle: 'Manage delivery addresses',
      icon: '📍',
      onPress: () => console.log('Manage addresses'),
    },
    {
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      icon: '💳',
      onPress: () => console.log('Payment methods'),
    },
    {
      title: 'Order History',
      subtitle: 'View past orders',
      icon: '📋',
      onPress: () => navigation.navigate('Orders' as never),
    },
    {
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: '🔔',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Settings',
      subtitle: 'App preferences and settings',
      icon: '⚙️',
      onPress: () => console.log('Settings'),
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: '💬',
      onPress: () => console.log('Help & Support'),
    },
    {
      title: 'About',
      subtitle: 'App version and information',
      icon: 'ℹ️',
      onPress: () => console.log('About'),
    },
  ];

  const renderMenuItem = (item: typeof menuItems[0], index: number) => (
    <ListItem
      key={index}
      title={item.title}
      subtitle={item.subtitle}
      leftIcon={<Text style={{ fontSize: 20 }}>{item.icon}</Text>}
      onPress={item.onPress}
      style={styles.menuItem}
    />
  );

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface }]}>
          <Avatar
            source={profile.avatar}
            name={profile.name}
            size="xlarge"
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {profile.name}
          </Text>
          <Text style={[styles.phone, { color: theme.colors.textSecondary }]}>
            {profile.phone}
          </Text>
          {profile.email && (
            <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
              {profile.email}
            </Text>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <SectionHeader title="Account" />
          {menuItems.slice(0, 4).map(renderMenuItem)}

          <Divider style={styles.divider} />

          <SectionHeader title="Preferences" />
          {menuItems.slice(4, 6).map(renderMenuItem)}

          <Divider style={styles.divider} />

          <SectionHeader title="Support" />
          {menuItems.slice(6, 8).map(renderMenuItem)}

          <Divider style={styles.divider} />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutText, { color: theme.colors.white }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  phone: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    marginVertical: 2,
  },
  divider: {
    marginVertical: 16,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
