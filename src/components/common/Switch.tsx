import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { useTheme } from '../../config/theme';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    const sizes = {
      small: { width: 44, height: 24, thumbSize: 18, padding: 3 },
      medium: { width: 52, height: 28, thumbSize: 22, padding: 3 },
      large: { width: 60, height: 32, thumbSize: 26, padding: 3 },
    };
    return sizes[size];
  };

  const sizeData = getSize();

  const toggleSwitch = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const thumbPosition = value ? sizeData.width - sizeData.thumbSize - sizeData.padding * 2 : sizeData.padding;

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      disabled={disabled}
      style={[
        styles.container,
        {
          width: sizeData.width,
          height: sizeData.height,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: value ? theme.colors.primary : theme.colors.border,
            borderRadius: sizeData.height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.thumb,
            {
              width: sizeData.thumbSize,
              height: sizeData.thumbSize,
              borderRadius: sizeData.thumbSize / 2,
              backgroundColor: theme.colors.white,
              transform: [{ translateX: thumbPosition }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  thumb: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
});

export default Switch;
