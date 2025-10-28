import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  onPress,
  label,
  disabled = false,
  size = 'medium',
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    const sizes = {
      small: { outerSize: 16, innerSize: 8, labelSize: 14 },
      medium: { outerSize: 20, innerSize: 10, labelSize: 16 },
      large: { outerSize: 24, innerSize: 12, labelSize: 18 },
    };
    return sizes[size];
  };

  const sizeData = getSize();

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      style={[styles.container, style]}
      disabled={disabled}
    >
      <View
        style={[
          styles.radio,
          {
            width: sizeData.outerSize,
            height: sizeData.outerSize,
            borderColor: selected ? theme.colors.primary : theme.colors.border,
            backgroundColor: selected ? theme.colors.primary : 'transparent',
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.radioInner,
              {
                width: sizeData.innerSize,
                height: sizeData.innerSize,
                backgroundColor: theme.colors.white,
              },
            ]}
          />
        )}
      </View>

      {label && (
        <Text
          style={[
            styles.label,
            {
              fontSize: sizeData.labelSize,
              color: disabled ? theme.colors.textSecondary : theme.colors.text,
              marginLeft: 8,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    borderRadius: 6,
  },
  label: {
    flex: 1,
  },
});

export default RadioButton;
