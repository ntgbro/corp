import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'button';
  color?: 'primary' | 'secondary' | 'text' | 'error' | 'success' | 'warning' | string;
  style?: any;
  fontFamily?: 'regular' | 'medium' | 'semibold' | 'bold' | 'variable' | 'italicVariable';
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = 'text',
  style,
  fontFamily = 'regular',
}) => {
  const { theme } = useThemeContext();

  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize.xxl,
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: 40,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          lineHeight: 32,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.semibold,
          lineHeight: 28,
        };
      case 'h4':
        return {
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.medium,
          lineHeight: 24,
        };
      case 'h5':
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.semibold,
          lineHeight: 22,
        };
      case 'h6':
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.medium,
          lineHeight: 20,
        };
      case 'body1':
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: 24,
        };
      case 'body2':
        return {
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: 20,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: 16,
        };
      case 'button':
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.medium,
          lineHeight: 20,
        };
      default:
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: 24,
        };
    }
  };

  const getColor = () => {
    switch (color) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.textSecondary;
      case 'text': return theme.colors.text;
      case 'error': return theme.colors.error;
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.text;
    }
  };

  const variantStyles = getVariantStyles();
  const selectedFontFamily = fontFamily !== 'regular' ? theme.typography.fontFamily[fontFamily] : theme.typography.fontFamily.regular;

  return (
    <Text
      style={[
        styles.text,
        {
          ...variantStyles,
          color: getColor(),
          fontFamily: selectedFontFamily,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default Typography;