import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  color,
  backgroundColor,
  style,
}) => {
  const theme = useTheme();

  const progressWidth = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: backgroundColor || theme.colors.border,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: `${progressWidth}%`,
            height,
            backgroundColor: color || theme.colors.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 2,
  },
});

export default ProgressBar;
