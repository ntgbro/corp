import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface ErrorMessageProps {
  error: string | Error;
  style?: ViewStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  style,
}) => {
  const theme = useTheme();

  const errorText = error instanceof Error ? error.message : error;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, { color: theme.colors.error }]}>
        ⚠️ {errorText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#FF0000',
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default ErrorMessage;
