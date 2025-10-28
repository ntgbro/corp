import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle, Text } from 'react-native';
import { useTheme } from '../../config/theme';

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  onClear?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onSubmitEditing,
  onClear,
  style,
  disabled = false,
}) => {
  const theme = useTheme();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: 'transparent',
          },
        ]}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        editable={!disabled}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          disabled={disabled}
        >
          <Text style={[styles.clearIcon, { color: theme.colors.textSecondary }]}>
            ×
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.searchIcon}>
        <Text style={[styles.searchIconText, { color: theme.colors.textSecondary }]}>
          🔍
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchIconText: {
    fontSize: 16,
  },
});

export default SearchInput;
