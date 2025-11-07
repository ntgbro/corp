import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface WishlistButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 24 : 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled || loading ? 0.6 : 1,
      minHeight: size === 'small' ? 32 : size === 'large' ? 56 : 44,
      ...(fullWidth && { width: '100%' }),
    };

    const variantStyles = {
      primary: {
        backgroundColor: '#754C29', // Custom primary color for wishlist
      },
      secondary: {
        backgroundColor: '#FBF5EB', // Light background
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#754C29',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 14 : size === 'large' ? 16 : 15,
      fontWeight: '600',
      textAlign: 'center',
    };

    const variantTextStyles = {
      primary: { color: '#FFFFFF' }, // White text for primary
      secondary: { color: '#754C29' }, // Brown text for secondary
      outline: { color: '#754C29' }, // Brown text for outline
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  const getLoadingColor = () => {
    return variant === 'outline' ? '#754C29' : '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={getLoadingColor()}
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default WishlistButton;