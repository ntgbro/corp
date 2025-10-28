import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export interface SpacerProps {
  width?: number;
  height?: number;
  flex?: number;
  style?: ViewStyle;
}

export const Spacer: React.FC<SpacerProps> = ({
  width,
  height,
  flex,
  style,
}) => {
  return (
    <View
      style={[
        styles.spacer,
        width !== undefined && { width },
        height !== undefined && { height },
        flex !== undefined && { flex },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  spacer: {
    // Default spacer has no size, but can be configured via props
  },
});

export default Spacer;
