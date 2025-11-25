import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';

interface AddToCartButtonProps {
  onPress: () => void;
  disabled?: boolean;
  size?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onPress, disabled = false, size = 40 }) => {
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: disabled ? '#ccc' : '#f1ede9',
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: '#754C29', fontSize: size / 2 }]}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

export default AddToCartButton;
