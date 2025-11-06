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
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const settingsSections = [
    { id: 'orders', title: 'Orders', icon: '📦' },
    { id: 'wishlist', title: 'Wishlist', icon: '❤️' },
    { id: 'addresses', title: 'Addresses', icon: '📍' },
    { id: 'preferences', title: 'Preferences', icon: '⚙️' },
    { id: 'notifications', title: 'Notifications', icon: '🔔' },
    { id: 'generalInfo', title: 'General Information', icon: 'ℹ️' },
    { id: 'helpSupport', title: 'Help & Support', icon: '❓' },
    { id: 'socialMedia', title: 'Follow Us', icon: '🌐' },
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
      <View style={[styles.headerContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Profile</Text>
        <TouchableOpacity 
          style={styles.optionsButton}
          onPress={() => setShowOptionsMenu(true)}
        >
          <Text style={[styles.optionsIcon, { color: theme.colors.text }]}>⋮</Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Profile Section - Image, Name, and Email */}
        <View style={styles.profileSection}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>profile</Text>
        
        {/* Profile Section with Circular Photo */}
        <View style={[styles.profileSection, { backgroundColor: theme.colors.surface }]}>
          {profileLoading ? (
            <View style={styles.profilePlaceholder}>
              <Text style={{ color: theme.colors.textSecondary }}>Loading...</Text>
            </View>
          ) : (
            <View style={styles.profileContent}>
              <TouchableOpacity onPress={() => handleNavigate('profile')}>
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
              </TouchableOpacity>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>{profile?.displayName || 'User'}</Text>
              <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>{profile?.email || ''}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          {/* Wrapped Settings Options in One Card */}
          <View style={[styles.settingsCard, { backgroundColor: '#FBF5EB', borderColor: theme.colors.border }]}>
            {settingsSections.map((section, index) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionItem, 
                  { 
                    borderBottomWidth: index !== settingsSections.length - 1 ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: theme.colors.border 
                  }
                ]}
                onPress={() => handleNavigate(section.id)}
              >
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionIcon, { color: theme.colors.primary }]}>{section.icon}</Text>
                  <View style={styles.sectionText}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
                  </View>
                  <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      {/* Options Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOptionsMenu}
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowOptionsMenu(false)}
        >
          <View style={[styles.optionsMenu, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={[styles.optionItem, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border }]}
              onPress={() => {
                setShowOptionsMenu(false);
                handleNavigate('profile');
              }}
            >
              <Text style={[styles.optionText, { color: theme.colors.text }]}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsMenu(false);
                confirmLogout();
              }}
            >
              <Text style={[styles.optionText, { color: theme.colors.text }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
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
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  optionsButton: {
    padding: 10,
  },
  optionsIcon: {
    fontSize: 24,
  },
  optionsMenu: {
    position: 'absolute',
    right: 16,
    top: 50,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 150,
  },
  optionItem: {
    padding: 16,
  },
  optionText: {
    fontSize: 16,
  },
  profileSection: {
    marginVertical: 10,
    alignItems: 'center',
  },
  profileContent: {
    alignItems: 'center',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  profilePlaceholder: {
    padding: 20,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingsCard: {
    marginTop: 16,
    marginBottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionItem: {
    backgroundColor: 'transparent',
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
    fontSize: 24,
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 16,
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