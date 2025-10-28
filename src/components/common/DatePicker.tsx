import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: ViewStyle;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  style,
  disabled = false,
}) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateSelect = (date: Date) => {
    if (disabled) return;
    onChange(date);
    setShowPicker(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(!showPicker)}
        disabled={disabled}
        style={[
          styles.display,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        <Text style={[styles.dateText, { color: theme.colors.text }]}>
          {formatDate(value)}
        </Text>
        <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>
          ▼
        </Text>
      </TouchableOpacity>

      {showPicker && !disabled && (
        <View style={[styles.picker, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.pickerTitle, { color: theme.colors.textSecondary }]}>
            Select Date
          </Text>
          <TouchableOpacity
            onPress={() => handleDateSelect(new Date())}
            style={[styles.pickerItem, { borderBottomColor: theme.colors.border }]}
          >
            <Text style={[styles.pickerItemText, { color: theme.colors.text }]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDateSelect(new Date(Date.now() + 24 * 60 * 60 * 1000))}
            style={[styles.pickerItem, { borderBottomColor: theme.colors.border }]}
          >
            <Text style={[styles.pickerItemText, { color: theme.colors.text }]}>
              Tomorrow
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPicker(false)}
            style={styles.pickerItem}
          >
            <Text style={[styles.pickerItemText, { color: theme.colors.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  display: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
  },
  picker: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 1000,
  },
  pickerTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default DatePicker;
