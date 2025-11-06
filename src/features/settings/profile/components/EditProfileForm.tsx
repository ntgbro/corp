import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';

interface EditProfileFormProps {
  initialData?: {
    displayName?: string;
    email?: string;
    phone?: string;
    profilePhotoURL?: string;
  };
  onSave: (data: any) => void;
  saving?: boolean;
  onPhotoChange?: (photoURL: string) => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData = {},
  onSave,
  saving = false,
  onPhotoChange,
}) => {
  const { theme } = useThemeContext();
  const [formData, setFormData] = useState({
    displayName: initialData.displayName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    profilePhotoURL: initialData.profilePhotoURL || '',
  });

  useEffect(() => {
    setFormData({
      displayName: initialData.displayName || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      profilePhotoURL: initialData.profilePhotoURL || '',
    });
  }, [initialData]);

  const handleSave = () => {
    onSave(formData);
  };

  const selectProfilePhoto = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorCode) {
        console.log('User cancelled image picker or error occurred');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setFormData({ ...formData, profilePhotoURL: imageUri });
          if (onPhotoChange) {
            onPhotoChange(imageUri);
          }
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Profile Photo Section */}
      <View style={styles.photoSection}>
        <TouchableOpacity onPress={selectProfilePhoto}>
          {formData.profilePhotoURL ? (
            <Image 
              source={{ uri: formData.profilePhotoURL }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
                Add Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.changePhotoButton, { backgroundColor: theme.colors.primary }]}
          onPress={selectProfilePhoto}
        >
          <Text style={[styles.changePhotoText, { color: theme.colors.white }]}>
            Change Photo
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={formData.displayName}
          onChangeText={(text) => setFormData({ ...formData, displayName: text })}
          placeholder="Enter your full name"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter your email"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="email-address"
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Phone</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter your phone number"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={[styles.saveButtonText, { color: theme.colors.white }]}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  changePhotoButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileForm;