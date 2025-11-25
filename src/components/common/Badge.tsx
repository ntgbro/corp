import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  style,
}) => {
  const { theme } = useThemeContext();

  const getVariantStyles = () => {
    const variants = {
      primary: { backgroundColor: theme.colors.primary },
      secondary: { backgroundColor: theme.colors.border },
      success: { backgroundColor: theme.colors.success },
      warning: { backgroundColor: theme.colors.warning },
      error: { backgroundColor: theme.colors.error },
    };
    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      small: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 },
      medium: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
      large: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
    };
    return sizes[size];
  };

  return (
    <View style={[styles.badge, getVariantStyles(), getSizeStyles(), style]}>
      <Text style={[styles.text, { color: theme.colors.white, fontSize: getSizeStyles().fontSize }]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    height: 'auto',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Badge;