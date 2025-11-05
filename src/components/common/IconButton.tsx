import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    const sizes = {
      small: 32,
      medium: 40,
      large: 48,
    };
    return sizes[size];
  };

  const getVariantStyles = (): ViewStyle => {
    const size = getSize();
    const baseStyles: ViewStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.border,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.textSecondary;

    switch (variant) {
      case 'primary':
        return theme.colors.white;
      case 'secondary':
        return theme.colors.textSecondary;
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.primary;
    }
  };

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <Text style={[styles.iconText, { color: getIconColor(), fontSize: getSize() * 0.5 }]}>
          {icon}
        </Text>
      );
    }

    // Handle React elements (like vector icons)
    if (React.isValidElement(icon)) {
      // Try to pass color and size props, but don't force them if they don't exist
      const iconProps: any = {
        color: getIconColor(),
        size: getSize() * 0.5,
      };
      
      return React.cloneElement(icon, iconProps);
    }

    return icon;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        getVariantStyles(),
        {
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default IconButton;