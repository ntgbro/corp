import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'destructive';
  style?: ViewStyle;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  style,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View style={[styles.overlay, style]}>
      <View style={[styles.dialog, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Text
              style={[styles.cancelText, { color: theme.colors.textSecondary }]}
              onPress={onCancel}
            >
              {cancelText}
            </Text>
          </View>
          <View style={styles.button}>
            <Text
              style={[
                styles.confirmText,
                {
                  color: variant === 'destructive' ? theme.colors.error : theme.colors.primary,
                },
              ]}
              onPress={onConfirm}
            >
              {confirmText}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialog: {
    width: '80%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConfirmationDialog;
