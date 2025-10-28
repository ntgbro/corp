import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  const handleDecrease = () => {
    if (disabled) return;
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    if (disabled) return;
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleDecrease}
        disabled={disabled || value <= min}
        style={[
          styles.button,
          {
            backgroundColor: disabled || value <= min ? theme.colors.border : theme.colors.primary,
            opacity: disabled || value <= min ? 0.6 : 1,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.colors.white }]}>−</Text>
      </TouchableOpacity>

      <View style={[styles.valueContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.valueText, { color: theme.colors.text }]}>
          {value}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleIncrease}
        disabled={disabled || value >= max}
        style={[
          styles.button,
          {
            backgroundColor: disabled || value >= max ? theme.colors.border : theme.colors.primary,
            opacity: disabled || value >= max ? 0.6 : 1,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.colors.white }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  valueContainer: {
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuantityStepper;
