import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { EditProfileForm } from '../components/EditProfileForm';
import { useProfile } from '../hooks/useProfile';

export const ProfileScreen = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const { profile, loading, saving, updateProfile, uploadProfilePhoto } = useProfile();

  const handleSave = async (data: any) => {
    try {
      // If there's a new profile photo, upload it first
      if (data.profilePhotoURL && data.profilePhotoURL.startsWith('file://')) {
        const downloadURL = await uploadProfilePhoto(data.profilePhotoURL);
        data.profilePhotoURL = downloadURL;
      }
      
      await updateProfile(data);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          {loading ? (
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading profile...
            </Text>
          ) : (
            <EditProfileForm
              initialData={profile}
              onSave={handleSave}
              saving={saving}
            />
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
  card: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
  },
});

export default ProfileScreen;