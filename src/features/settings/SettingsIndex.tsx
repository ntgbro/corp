import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, ToastAndroid, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../components/layout';
import { useThemeContext } from '../../contexts/ThemeContext';
import { SettingsStackParamList } from './navigation/SettingsNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from './profile/hooks/useProfile';

type SettingsNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsHome'>;

export const SettingsIndex = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation<SettingsNavigationProp>();
  const { signOut, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
      profile: 'SettingsProfile', // Changed from 'Profile' to 'SettingsProfile'
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

  const handleLogout = async () => {
    try {
      console.log('Logout initiated');
      setShowLogoutModal(false);
      await signOut();
      console.log('Logout completed successfully');
      
      // Show success message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Logged out successfully', ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', 'Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setShowLogoutModal(false);
      
      // Show error message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to logout. Please try again.', ToastAndroid.LONG);
      } else {
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>profile</Text>
        
        {/* Profile Section with Circular Photo */}
        <View style={[styles.profileSection, { backgroundColor: theme.colors.surface }]}>
          {profileLoading ? (
            <View style={styles.profilePlaceholder}>
              <Text style={{ color: theme.colors.textSecondary }}>Loading...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.profileContainer}
              onPress={() => handleNavigate('profile')}
            >
              {profile?.profilePhotoURL ? (
                <Image 
                  source={{ uri: profile.profilePhotoURL }} 
                  style={styles.profileImage}
                />
              ) : (
                <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.colors.background }]}>
                  <Text style={{ fontSize: 24, color: theme.colors.textSecondary }}>👤</Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>{profile?.displayName || 'User'}</Text>
                <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>{profile?.email || ''}</Text>
              </View>
              <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          )}
        </View>
        
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
          
          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.colors.error, borderColor: theme.colors.error }]}
            onPress={confirmLogout}
            disabled={loading}
          >
            <Text style={[styles.logoutText, { color: theme.colors.white }]}>
              {loading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Logout</Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.border }]}
                onPress={cancelLogout}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutModalButton, { backgroundColor: theme.colors.error }]}
                onPress={handleLogout}
              >
                <Text style={[styles.logoutModalButtonText, { color: theme.colors.white }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  profileSection: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  profilePlaceholder: {
    padding: 20,
    alignItems: 'center',
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
  logoutButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  logoutModalButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsIndex;