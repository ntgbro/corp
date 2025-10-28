import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { useTheme } from '../../config/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  style?: ViewStyle;
  disabled?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = '+',
  text,
  size = 'medium',
  variant = 'primary',
  position = 'bottom-right',
  style,
  disabled = false,
  showBadge = false,
  badgeCount = 0,
}) => {
  const theme = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
        };
      case 'large':
        return {
          width: 72,
          height: 72,
          borderRadius: 36,
        };
      default: // medium
        return {
          width: 56,
          height: 56,
          borderRadius: 28,
        };
    }
  };

  const getVariantStyles = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.success,
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.error,
        };
    }
  };

  const getPositionStyles = () => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      zIndex: 1000,
    };

    switch (position) {
      case 'bottom-right':
        return {
          ...baseStyle,
          bottom: 24,
          right: 24,
        };
      case 'bottom-left':
        return {
          ...baseStyle,
          bottom: 24,
          left: 24,
        };
      case 'top-right':
        return {
          ...baseStyle,
          top: 24,
          right: 24,
        };
      case 'top-left':
        return {
          ...baseStyle,
          top: 24,
          left: 24,
        };
    }
  };

  const getFontSizes = () => {
    switch (size) {
      case 'small':
        return {
          icon: 20,
          text: 12,
        };
      case 'large':
        return {
          icon: 32,
          text: 16,
        };
      default: // medium
        return {
          icon: 24,
          text: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();
  const positionStyles = getPositionStyles();
  const fontSizes = getFontSizes();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        sizeStyles,
        variantStyles,
        positionStyles,
        {
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {text ? (
        <Text style={[styles.text, { color: theme.colors.white, fontSize: fontSizes.text }]}>
          {text}
        </Text>
      ) : (
        <Text style={[styles.icon, { color: theme.colors.white, fontSize: fontSizes.icon }]}>
          {icon}
        </Text>
      )}

      {showBadge && badgeCount > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
          <Text style={[styles.badgeText, { color: theme.colors.white }]}>
            {badgeCount > 99 ? '99+' : badgeCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  text: {
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default FloatingActionButton;
