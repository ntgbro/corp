import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';
import { reverseGeocodeWithFallback } from '../../../../utils/locationHelpers';

interface AddressFormProps {
  initialData?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    geoPoint?: {
      latitude: number;
      longitude: number;
    };
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
    line1: initialData.line1 || '',
    line2: initialData.line2 || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || '',
    phone: initialData.phone || '',
    geoPoint: initialData.geoPoint || { latitude: 0, longitude: 0 },
  });
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    setFormData({
      name: initialData.name || '',
      line1: initialData.line1 || '',
      line2: initialData.line2 || '',
      city: initialData.city || '',
      state: initialData.state || '',
      zipCode: initialData.zipCode || '',
      phone: initialData.phone || '',
      geoPoint: initialData.geoPoint || { latitude: 0, longitude: 0 },
    });
  }, [initialData]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to save accurate delivery addresses.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  const detectCurrentLocation = async () => {
    setDetectingLocation(true);
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required to detect your current location.');
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Get human-readable address using reverse geocoding
            const readableAddress = await reverseGeocodeWithFallback(latitude, longitude);
            
            // Update form data with detected location
            setFormData(prev => ({
              ...prev,
              line1: readableAddress,
              geoPoint: {
                latitude,
                longitude,
              }
            }));
            
            Alert.alert('Success', 'Your current location has been detected and added to the address form.');
          } catch (error) {
            console.error('Error getting readable address:', error);
            // Still update with coordinates even if reverse geocoding fails
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({
              ...prev,
              geoPoint: {
                latitude,
                longitude,
              }
            }));
            Alert.alert('Partial Success', 'Location detected but address could not be resolved. Coordinates saved.');
          }
        },
        (error) => {
          console.error('Location error:', error);
          let errorMessage = 'Unable to detect location';
          switch (error.code) {
            case 1: errorMessage = 'Location permission denied'; break;
            case 2: errorMessage = 'Location unavailable'; break;
            case 3: errorMessage = 'Location request timed out'; break;
          }
          Alert.alert('Error', errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission');
    } finally {
      setDetectingLocation(false);
    }
  };

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
        <Text style={[styles.label, { color: theme.colors.text }]}>Address Line 1</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={formData.line1}
          onChangeText={(text) => setFormData({ ...formData, line1: text })}
          placeholder="Address line 1"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Address Line 2 (Optional)</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          }]}
          value={formData.line2}
          onChangeText={(text) => setFormData({ ...formData, line2: text })}
          placeholder="Address line 2 (Apartment, suite, etc.)"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={2}
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
        style={[styles.locationButton, { backgroundColor: theme.colors.secondary }]}
        onPress={detectCurrentLocation}
        disabled={detectingLocation}
      >
        <Text style={[styles.locationButtonText, { color: theme.colors.white }]}>
          {detectingLocation ? 'Detecting Location...' : 'Detect Current Location'}
        </Text>
      </TouchableOpacity>

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
  locationButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '600',
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