import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StickyFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  variant?: 'default' | 'elevated' | 'transparent';
  showBorder?: boolean;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
  children,
  style,
  backgroundColor,
  variant = 'default',
  showBorder = true,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const getVariantStyles = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: backgroundColor || theme.colors.surface,
      paddingBottom: insets.bottom,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor: theme.colors.black,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        };
      case 'transparent':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return {
          ...baseStyle,
          borderTopWidth: showBorder ? 1 : 0,
          borderTopColor: theme.colors.border,
        };
    }
  };

  return (
    <View
      style={[
        styles.container,
        getVariantStyles(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export default StickyFooter;
