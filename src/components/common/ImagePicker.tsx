import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, ViewStyle, Alert } from 'react-native';
import { useTheme } from '../../config';

export interface ImagePickerProps {
  onImageSelected: (imageUri: string) => void;
  placeholder?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onImageSelected,
  placeholder,
  style,
  disabled = false,
}) => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePick = () => {
    if (disabled) return;

    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => handleCamera() },
        { text: 'Gallery', onPress: () => handleGallery() },
      ]
    );
  };

  const handleCamera = () => {
    // TODO: Implement camera functionality
    Alert.alert('Camera', 'Camera functionality to be implemented');
  };

  const handleGallery = () => {
    // TODO: Implement gallery functionality
    Alert.alert('Gallery', 'Gallery functionality to be implemented');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onImageSelected('');
  };

  return (
    <TouchableOpacity
      onPress={handleImagePick}
      disabled={disabled}
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity
            onPress={handleRemoveImage}
            style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
          >
            <Text style={[styles.removeText, { color: theme.colors.white }]}>×</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholder}>
          {placeholder || (
            <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
              Tap to select image
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ImagePicker;
