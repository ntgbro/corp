import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../config/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  showBackButton?: boolean;
  onBackPress?: () => void;
  variant?: 'default' | 'primary' | 'transparent';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  style,
  titleStyle,
  subtitleStyle,
  showBackButton = false,
  onBackPress,
  variant = 'default',
}) => {
  const theme = useTheme();

  const getHeaderStyle = () => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 56,
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      },
      primary: {
        backgroundColor: theme.colors.primary,
        borderBottomWidth: 0,
      },
      transparent: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTitleStyle = () => {
    const baseStyle: TextStyle = {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '600' as const,
      textAlign: 'center',
    };

    const variantTextStyles = {
      default: { color: theme.colors.text },
      primary: { color: theme.colors.white },
      transparent: { color: theme.colors.text },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
      ...titleStyle,
    };
  };

  const getSubtitleStyle = () => {
    const baseStyle: TextStyle = {
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
      marginTop: 2,
    };

    const variantTextStyles = {
      default: { color: theme.colors.textSecondary },
      primary: { color: `${theme.colors.white}CC` },
      transparent: { color: theme.colors.textSecondary },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
      ...subtitleStyle,
    };
  };

  const getBackButtonStyle = () => {
    return {
      color: variant === 'primary' ? theme.colors.white : theme.colors.primary,
      fontSize: theme.typography.fontSize.md,
    };
  };

  return (
    <View style={getHeaderStyle()}>
      <View style={styles.leftContainer}>
        {leftComponent}
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={getBackButtonStyle()}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        {title && (
          <Text style={getTitleStyle()}>{title}</Text>
        )}
        {subtitle && (
          <Text style={getSubtitleStyle()}>{subtitle}</Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
});

export default Header;
