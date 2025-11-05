import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

interface PreferencesFormProps {
  initialData?: {
    notifications?: {
      orderUpdates?: boolean;
      promotions?: boolean;
      offers?: boolean;
    };
    darkMode?: boolean;
    locationAccess?: boolean;
  };
  onSave: (data: any) => void;
  saving?: boolean;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({
  initialData = {},
  onSave,
  saving = false,
}) => {
  const { theme } = useThemeContext();
  const [formData, setFormData] = useState({
    notifications: {
      orderUpdates: initialData.notifications?.orderUpdates ?? true,
      promotions: initialData.notifications?.promotions ?? true,
      offers: initialData.notifications?.offers ?? true,
    },
    darkMode: initialData.darkMode ?? false,
    locationAccess: initialData.locationAccess ?? true,
  });

  // Debug: Log form data
  useEffect(() => {
    console.log('PreferencesForm initialData:', initialData);
    console.log('PreferencesForm formData:', formData);
  }, [initialData, formData]);

  useEffect(() => {
    setFormData({
      notifications: {
        orderUpdates: initialData.notifications?.orderUpdates ?? true,
        promotions: initialData.notifications?.promotions ?? true,
        offers: initialData.notifications?.offers ?? true,
      },
      darkMode: initialData.darkMode ?? false,
      locationAccess: initialData.locationAccess ?? true,
    });
  }, [initialData]);

  const handleSave = () => {
    onSave(formData);
  };

  const toggleNotification = (key: keyof typeof formData.notifications) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: !formData.notifications[key],
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
        <View style={styles.preferenceItem}>
          <Text style={[styles.preferenceLabel, { color: theme.colors.text }]}>Order Updates</Text>
          <Switch
            value={formData.notifications.orderUpdates}
            onValueChange={() => toggleNotification('orderUpdates')}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="white"
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text style={[styles.preferenceLabel, { color: theme.colors.text }]}>Promotions</Text>
          <Switch
            value={formData.notifications.promotions}
            onValueChange={() => toggleNotification('promotions')}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="white"
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text style={[styles.preferenceLabel, { color: theme.colors.text }]}>Special Offers</Text>
          <Switch
            value={formData.notifications.offers}
            onValueChange={() => toggleNotification('offers')}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="white"
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App Preferences</Text>
        <View style={styles.preferenceItem}>
          <Text style={[styles.preferenceLabel, { color: theme.colors.text }]}>Dark Mode</Text>
          <Switch
            value={formData.darkMode}
            onValueChange={(value) => setFormData({ ...formData, darkMode: value })}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="white"
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text style={[styles.preferenceLabel, { color: theme.colors.text }]}>Location Access</Text>
          <Switch
            value={formData.locationAccess}
            onValueChange={(value) => setFormData({ ...formData, locationAccess: value })}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor="white"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={[styles.saveButtonText, { color: theme.colors.white }]}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
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

export default PreferencesForm;