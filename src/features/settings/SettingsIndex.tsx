import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, ToastAndroid, Platform, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../components/layout';
import { useThemeContext } from '../../contexts/ThemeContext';
import { SettingsStackParamList } from './navigation/SettingsNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from './profile/hooks/useProfile';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Path } from 'react-native-svg';

// Custom SVG Icons
const EditProfileIcon = ({ size = 20, color = '#000000', style }: { size?: number; color?: string; style?: any }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path d="M2,21H8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20,1,1,0,0,0,2,21ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5ZM20.207,9.293a1,1,0,0,0-1.414,0l-6.25,6.25a1.011,1.011,0,0,0-.241.391l-1.25,3.75A1,1,0,0,0,12,21a1.014,1.014,0,0,0,.316-.051l3.75-1.25a1,1,0,0,0,.391-.242l6.25-6.25a1,1,0,0,0,0-1.414Zm-5,8.583-1.629.543.543-1.629L19.5,11.414,20.586,12.5Z" fill={color} />
  </Svg>
);

const LogoutIcon = ({ size = 20, color = '#000000', style }: { size?: number; color?: string; style?: any }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" style={style}>
    <Path d="M6.49999 0V8H9.49999V0H6.49999Z" fill={color} />
    <Path d="M4.46447 11.5355C2.51184 9.58291 2.51184 6.41709 4.46447 4.46447L2.34315 2.34315C-0.781049 5.46734 -0.781049 10.5327 2.34315 13.6569C5.46734 16.781 10.5327 16.781 13.6569 13.6569C16.781 10.5327 16.781 5.46734 13.6569 2.34315L11.5355 4.46447C13.4882 6.41709 13.4882 9.58291 11.5355 11.5355C9.58291 13.4882 6.41709 13.4882 4.46447 11.5355Z" fill={color} />
  </Svg>
);

// Social Media Icons
const FacebookIcon = ({ size = 20, color = '#1877F2' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/>
  </Svg>
);

const InstagramIcon = ({ size = 20, color = '#E4405F' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </Svg>
);

const LinkedInIcon = ({ size = 20, color = '#0A66C2' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.25h-2.667v-8.59h2.56v1.174h.036c.358-.675 1.228-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.71z"/>
  </Svg>
);

const XIcon = ({ size = 20, color = '#000000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </Svg>
);

type SettingsNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsHome'>;

export const SettingsIndex = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation<SettingsNavigationProp>();
  const { signOut, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const settingsSections = [
    { id: 'orderHistory', title: 'Order History', icon: '📦' },
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
      profile: 'SettingsProfile',
      orderHistory: 'OrderHistory',
      wishlist: 'Wishlist',
      addresses: 'Addresses',
      preferences: 'Preferences',
      notifications: 'Notifications',
      generalInfo: 'GeneralInfo',
      helpSupport: 'HelpSupport',
      socialMedia: 'SocialMedia',
    };

    // Prevent navigation for 'socialMedia' (Follow Us) option
    if (sectionId === 'socialMedia') {
      return;
    }

    const target = navigationMap[sectionId];
    if (target) {
      navigation.navigate(target as any);
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
        <TouchableOpacity onPress={() => navigation.navigate('Home' as any)}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.header, { color: theme.colors.text }]}>Profile</Text>
        <TouchableOpacity 
          style={styles.optionsButton}
          onPress={() => setShowOptionsMenu(true)}
        >
          <Text style={[styles.optionsIcon, { color: theme.colors.text }]}>⋮</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Profile Section with Circular Photo */}
        <View style={styles.profileSection}>
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
                    borderBottomWidth: 0, // Remove the horizontal lines
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
                  {/* Show chevron icon for all sections except 'socialMedia' (Follow Us) */}
                  {section.id !== 'socialMedia' && (
                    <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>›</Text>
                  )}
                  {/* Show social media icons for 'socialMedia' (Follow Us) option */}
                  {section.id === 'socialMedia' && (
                    <View style={styles.socialMediaIconsContainer}>
                      <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/people/corpeas/61576978934184/?rdid=78kqkjGofPh8JUkz&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Bk5KGjtdw%2F')}>
                        <FacebookIcon size={34} color="#1877F2" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/corpeas/?igsh=MXVuMjl6MnEzZmM4OA%3D%3D#')}>
                        <InstagramIcon size={28} color="#E4405F" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/corp-eas-3b8b0436a/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app')}>
                        <LinkedInIcon size={32} color="#0A66C2" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => Linking.openURL('https://x.com/corpeas2025?t=na7NIMbY-gvM20tDAfgFlg&s=09')}>
                        <XIcon size={26} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Options Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOptionsMenu}
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <View 
          style={styles.modalOverlay}
          onStartShouldSetResponder={() => true}
          onResponderRelease={() => setShowOptionsMenu(false)}
        >
          <View style={[styles.optionsMenu, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={[styles.optionItem, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border }]}
              onPress={() => {
                setShowOptionsMenu(false);
                handleNavigate('profile');
              }}
            >
              <EditProfileIcon size={20} color={theme.colors.text} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsMenu(false);
                confirmLogout();
              }}
            >
              <LogoutIcon size={20} color={theme.colors.text} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
  },
  profileSection: {
    marginVertical: 10,
    alignItems: 'center',
    paddingVertical: 20,
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
    marginTop: 4,
    marginBottom: 0,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
  socialMediaIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // Increased gap from 16 to 20 for even more spacing
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