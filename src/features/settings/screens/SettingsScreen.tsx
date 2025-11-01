import React from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { signOut } from '../../../store/slices/authSlice';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsItem } from '../components/SettingsItem';

import { SettingsStackParamList } from '../navigation/SettingsNavigator';

// Extend the navigation prop type to include reset action
type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsHome'> & {
  dispatch: typeof CommonActions.reset;
};

export const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // First sign out from Firebase
              await auth().signOut();
              
              // Dispatch the signOut action to update the Redux store
              dispatch(signOut());
              
              // Navigate to the auth stack
              // This assumes you have a root navigator with an 'Auth' stack
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
                })
              );
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="👤"
            title="Profile"
            subtitle="Manage your personal information"
            onPress={() => navigation.navigate('ProfileManagement')}
          />
          <SettingsItem
            icon="🔔"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          <SettingsItem
            icon="📍"
            title="Addresses"
            subtitle="Manage your saved addresses"
            onPress={() => navigation.navigate('AddressManagement')}
          />
        </SettingsSection>

        {/* Orders & Preferences */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon="📦"
            title="Orders"
            subtitle="View your order history"
            onPress={() => navigation.navigate('OrderHistory')}
          />
          <SettingsItem
            icon="⚙️"
            title="Preferences"
            subtitle="Manage your app preferences"
            onPress={() => navigation.navigate('Preferences')}
          />
          <SettingsItem
            icon="❤️"
            title="Wishlist"
            subtitle="View your saved items"
            onPress={() => navigation.navigate('Wishlist')}
          />
          <SettingsItem
            icon="🎨"
            title="Appearance"
            subtitle="Theme and display settings"
            onPress={() => navigation.navigate('Preferences')}
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="❓"
            title="Help & Support"
            onPress={() => navigation.navigate('HelpSupport')}
          />
          <SettingsItem
            icon="💬"
            title="Send Feedback"
            onPress={() => navigation.navigate('Feedback')}
          />
          <SettingsItem
            icon="ℹ️"
            title="About"
            subtitle="App version and information"
            onPress={() => navigation.navigate('AppInfo')}
          />
          <SettingsItem
            icon="🌐"
            title="Follow Us"
            onPress={() => navigation.navigate('SocialMedia')}
          />
        </SettingsSection>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        {/* Sign Out Section */}
        <SettingsSection title="">
          <View style={[styles.signOutButton, { padding: 0 }]}>
            <SettingsItem
              icon="🚪"
              title="Sign Out"
              onPress={handleSignOut}
              showChevron={false}
              titleTextStyle={styles.signOutText}
            />
          </View>
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signOutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    marginTop: 16,
    borderRadius: 8,
  },
  signOutText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});
