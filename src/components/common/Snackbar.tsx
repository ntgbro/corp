import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
  onDismiss?: () => void;
  variant?: 'success' | 'error' | 'warning' | 'info';
  style?: ViewStyle;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  action,
  duration = 4000,
  onDismiss,
  variant = 'info',
  style,
}) => {
  const theme = useTheme();
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hideSnackbar();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideSnackbar();
    }
  }, [visible, duration]);

  const hideSnackbar = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss?.();
    });
  };

  const getVariantStyles = () => {
    const variants = {
      success: { backgroundColor: theme.colors.success },
      error: { backgroundColor: theme.colors.error },
      warning: { backgroundColor: theme.colors.warning },
      info: { backgroundColor: theme.colors.primary },
    };
    return variants[variant];
  };

  if (!visible && (animation as any).__getValue() === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        getVariantStyles(),
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        },
        style,
      ]}
    >
      <Text style={[styles.message, { color: theme.colors.white }]}>
        {message}
      </Text>

      {action && (
        <TouchableOpacity onPress={action.onPress} style={styles.action}>
          <Text style={[styles.actionText, { color: theme.colors.white }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  action: {
    marginLeft: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default Snackbar;
