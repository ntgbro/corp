import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface ChipProps {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  selected = false,
  onPress,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  const getSizeStyles = () => {
    const sizes = {
      small: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
      medium: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    if (variant === 'outlined') {
      return {
        backgroundColor: selected ? theme.colors.primary : 'transparent',
        borderColor: selected ? theme.colors.primary : theme.colors.border,
        borderWidth: 1,
      };
    }
    return {
      backgroundColor: selected ? theme.colors.primary : theme.colors.border,
    };
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textSecondary;
    if (variant === 'outlined') {
      return selected ? theme.colors.white : theme.colors.text;
    }
    return selected ? theme.colors.white : theme.colors.text;
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.chip,
        variantStyles,
        {
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Chip;
