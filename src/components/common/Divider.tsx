import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.divider,
        orientation === 'vertical' ? styles.vertical : styles.horizontal,
        { backgroundColor: theme.colors.border },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#E0E0E0',
  },
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
  },
});

export default Divider;
