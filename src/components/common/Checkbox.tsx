import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    const sizes = {
      small: { checkboxSize: 16, iconSize: 12, labelSize: 14 },
      medium: { checkboxSize: 20, iconSize: 16, labelSize: 16 },
      large: { checkboxSize: 24, iconSize: 18, labelSize: 18 },
    };
    return sizes[size];
  };

  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const checkboxSize = getSize().checkboxSize;
  const iconSize = getSize().iconSize;
  const labelSize = getSize().labelSize;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, style]}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.checkbox,
          {
            width: checkboxSize,
            height: checkboxSize,
            borderColor: checked ? theme.colors.primary : theme.colors.border,
            backgroundColor: checked ? theme.colors.primary : 'transparent',
          },
        ]}
      >
        {checked && (
          <Text style={[styles.checkIcon, { fontSize: iconSize, color: theme.colors.white }]}>
            ✓
          </Text>
        )}
      </TouchableOpacity>

      {label && (
        <Text
          style={[
            styles.label,
            {
              fontSize: labelSize,
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
  checkbox: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    flex: 1,
  },
});

export default Checkbox;
