import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface TimePickerProps {
  value: string; // HH:MM format
  onChange: (time: string) => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  style,
  disabled = false,
}) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const [selectedHour, selectedMinute] = value.split(':');

  const handleTimeSelect = (hour: string, minute: string) => {
    onChange(`${hour}:${minute}`);
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
        <Text style={[styles.timeText, { color: theme.colors.text }]}>
          {value}
        </Text>
        <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>
          ▼
        </Text>
      </TouchableOpacity>

      {showPicker && !disabled && (
        <View style={[styles.picker, { backgroundColor: theme.colors.background }]}>
          <View style={styles.pickerRow}>
            <View style={styles.column}>
              <Text style={[styles.columnTitle, { color: theme.colors.textSecondary }]}>Hour</Text>
              {hours.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  onPress={() => handleTimeSelect(hour, selectedMinute)}
                  style={[
                    styles.pickerItem,
                    selectedHour === hour && { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      {
                        color: selectedHour === hour ? theme.colors.white : theme.colors.text,
                      },
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.column}>
              <Text style={[styles.columnTitle, { color: theme.colors.textSecondary }]}>Minute</Text>
              {minutes.map((minute) => (
                <TouchableOpacity
                  key={minute}
                  onPress={() => handleTimeSelect(selectedHour, minute)}
                  style={[
                    styles.pickerItem,
                    selectedMinute === minute && { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      {
                        color: selectedMinute === minute ? theme.colors.white : theme.colors.text,
                      },
                    ]}
                  >
                    {minute}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  timeText: {
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
    maxHeight: 200,
    zIndex: 1000,
  },
  pickerRow: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    maxHeight: 200,
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TimePicker;
