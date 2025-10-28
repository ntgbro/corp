import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../config/theme';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  variant?: 'default' | 'outlined' | 'filled';
}

export const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(
  (
    {
      label,
      error,
      helperText,
      containerStyle,
      labelStyle,
      inputStyle,
      style,
      variant = 'outlined',
      ...props
    },
    ref
  ) => {
    const theme = useTheme();

    const getInputStyle = () => {
      const baseStyle: TextStyle = {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
      };

      const variantStyles = {
        default: {
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        outlined: {
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        filled: {
          borderWidth: 1,
          borderColor: 'transparent',
          backgroundColor: error ? `${theme.colors.error}15` : theme.colors.surface,
        },
      };

      return {
        ...baseStyle,
        ...variantStyles[variant],
        ...(inputStyle || {}),
        ...(style || {}),
      } as TextStyle;
    };

    const getLabelStyle = (): TextStyle => {
      return {
        fontSize: theme.typography.fontSize.md,
        fontWeight: '500' as const,
        color: error ? theme.colors.error : theme.colors.text,
        marginBottom: theme.spacing.sm,
        ...(labelStyle || {}),
      } as TextStyle;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={getLabelStyle()}>{label}</Text>
        )}
        <RNTextInput
          ref={ref}
          style={getInputStyle()}
          placeholderTextColor={theme.colors.textSecondary}
          {...props}
        />
        {error && (
          <Text style={[
            styles.errorText,
            { color: theme.colors.error }
          ]}>
            {error}
          </Text>
        )}
        {helperText && !error && (
          <Text style={[
            styles.helperText,
            { color: theme.colors.textSecondary }
          ]}>
            {helperText}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

TextInput.displayName = 'TextInput';

export default TextInput;
