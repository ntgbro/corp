import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';

export interface BottomNavBarProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  children,
  style,
}) => {
  const { theme } = useThemeContext();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default BottomNavBar;