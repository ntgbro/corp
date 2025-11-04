import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

interface AddressFormProps {
  initialData?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
  };
  onSave: (data: any) => void;
  saving?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData = {},
  onSave,
  saving = false,
}) => {
  const { theme } = useThemeContext();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || '',
    phone: initialData.phone || '',
  });

  useEffect(() => {
    setFormData({
      name: initialData.name || '',
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      zipCode: initialData.zipCode || '',
      phone: initialData.phone || '',
    });
  }, [initialData]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter full name"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Address</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Street address"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flexOne]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>City</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }]}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="City"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={[styles.inputGroup, styles.flexOne, styles.marginLeft]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>State</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }]}
            value={formData.state}
            onChangeText={(text) => setFormData({ ...formData, state: text })}
            placeholder="State"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flexOne]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>ZIP Code</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }]}
            value={formData.zipCode}
            onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
            placeholder="ZIP code"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputGroup, styles.flexOne, styles.marginLeft]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Phone</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }]}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Phone number"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={[styles.saveButtonText, { color: theme.colors.white }]}>
          {saving ? 'Saving...' : 'Save Address'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 10,
  },
  saveButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressForm;