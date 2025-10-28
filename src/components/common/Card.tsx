import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: boolean;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  shadow = true,
  variant = 'default',
  padding = 'medium'
}) => {
  const theme = useTheme();

  const getCardStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      marginVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      elevated: {
        backgroundColor: theme.colors.surface,
        shadowColor: theme.colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
      },
    };

    const paddingStyles = {
      none: {},
      small: { padding: theme.spacing.sm },
      medium: { padding: theme.spacing.md },
      large: { padding: theme.spacing.lg },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...style,
    };
  };

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
};

export default Card;
