import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocationData {
  id: string;
  label: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault?: boolean;
  type: 'current' | 'saved' | 'manual';
}

interface LocationState {
  currentLocation: LocationData | null;
  savedAddresses: LocationData[];
  loading: boolean;
  error: string | null;
  permissionStatus: 'unknown' | 'granted' | 'denied' | 'blocked';
}

const initialState: LocationState = {
  currentLocation: null,
  savedAddresses: [],
  loading: false,
  error: null,
  permissionStatus: 'unknown',
};

// Enhanced geocoding service using only OpenStreetMap (free)
const reverseGeocodeWithFallback = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const result = await reverseGeocodeOpenStreetMap(latitude, longitude);
    if (result && result.length > 10) {
      console.log('Successfully geocoded with OpenStreetMap:', result);
      return result;
    }
  } catch (error) {
    console.log('OpenStreetMap geocoding failed:', error);
  }

  // Final fallback to coordinates
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

// Enhanced reverse geocoding function using OpenStreetMap Nominatim API
const reverseGeocodeOpenStreetMap = async (latitude: number, longitude: number): Promise<string> => {
  try {
    // Use OpenStreetMap Nominatim API with detailed address components
    await new Promise(resolve => setTimeout(resolve, 100));

    // Try multiple zoom levels and parameters for better accuracy
    const zoomLevels = [18, 16, 14]; // Higher zoom = more detail
    let bestResult = '';
    let allAvailableComponents: string[] = [];

    for (const zoom of zoomLevels) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=${zoom}&addressdetails=1&extratags=1&namedetails=1`,
          {
            headers: {
              'User-Agent': 'Corpease-Delivery-App/1.0',
            },
          }
        );

        if (!response.ok) continue;

        const data = await response.json();
        console.log(`OpenStreetMap Response (zoom ${zoom}):`, JSON.stringify(data, null, 2));

        if (data && data.address) {
          const address = data.address;
          const components = [];

          // Log all available address fields for debugging
          console.log('All available address fields:', Object.keys(address));
          console.log('Full address object:', JSON.stringify(address, null, 2));

          // Check for namedetails which might have local names
          if (data.namedetails) {
            console.log('Available namedetails:', JSON.stringify(data.namedetails, null, 2));
          }

          // Check for extratags which might have additional info
          if (data.extratags) {
            console.log('Available extratags:', JSON.stringify(data.extratags, null, 2));
          }

          // Enhanced street name extraction - try multiple field names
          let streetName = '';
          let houseNumber = '';

          // Try different variations of street/road names
          streetName = address.road ||
                      address.pedestrian ||
                      address.street ||
                      address.residential ||
                      address.highway ||
                      address.path ||
                      address.cycleway ||
                      address.footway ||
                      address.name || // Generic name field
                      '';

          // Try different variations of house numbers
          houseNumber = address.house_number ||
                       address.housenumber ||
                       address['addr:housenumber'] || // OSM tag format
                       '';

          // Try to get detailed location info
          if (houseNumber && streetName) {
            components.push(`${houseNumber} ${streetName}`);
            console.log('Found house number and street:', `${houseNumber} ${streetName}`);
          } else if (streetName) {
            components.push(streetName);
            console.log('Found street name:', streetName);
          } else if (address.name) {
            components.push(address.name);
            console.log('Using generic name field:', address.name);
          }

          // ADD ALL AVAILABLE AREA INFORMATION - Complete location hierarchy
          // Most specific to least specific areas

          // Most specific neighborhood/area names
          if (address.neighbourhood) {
            components.push(address.neighbourhood);
          }
          if (address.suburb) {
            components.push(address.suburb);
          }
          if (address.hamlet) {
            components.push(address.hamlet);
          }
          if (address.village) {
            components.push(address.village);
          }

          // Administrative areas
          if (address.city_district) {
            components.push(address.city_district);
          }
          if (address.district) {
            components.push(address.district);
          }
          if (address.county) {
            components.push(address.county);
          }

          // City/Town level
          if (address.city) {
            components.push(address.city);
          }
          if (address.town) {
            components.push(address.town);
          }
          if (address.municipality) {
            components.push(address.municipality);
          }

          // State/Region level
          if (address.state) {
            components.push(address.state);
          }
          if (address.region) {
            components.push(address.region);
          }

          // Country level (usually filtered out, but keeping for completeness)
          if (address.country) {
            // Don't add country to avoid redundancy
          }

          // Postal codes
          if (address.postcode) {
            components.push(address.postcode);
          }

          const currentResult = components.join(', ');
          console.log(`Components found at zoom ${zoom}:`, components);
          console.log(`Full address object keys:`, Object.keys(address));

          // Keep track of all available components
          if (components.length > allAvailableComponents.length) {
            allAvailableComponents = components;
            bestResult = currentResult;
          }

          // If we found any components, use this result
          if (components.length > 0) {
            console.log(`Using result from zoom ${zoom}:`, currentResult);
          }
        }
      } catch (error) {
        console.log(`Zoom level ${zoom} failed:`, error);
        continue;
      }
    }

    // Clean up the address
    if (bestResult) {
      bestResult = bestResult.replace(', India', '').replace(', United States', '');
      console.log('Final formatted address:', bestResult);
      console.log('All available components:', allAvailableComponents);
      return bestResult;
    }

    // Fallback to display_name if no good components found (often more readable)
    const fallbackResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'Corpease-Delivery-App/1.0',
        },
      }
    );

    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.display_name) {
        const cleanDisplayName = fallbackData.display_name.replace(', India', '').replace(', United States', '');
        console.log('Using display_name fallback:', cleanDisplayName);
        return cleanDisplayName;
      }
    }

    // Final fallback to coordinates
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};
export const requestLocationPermission = createAsyncThunk(
  'location/requestPermission',
  async (_, { rejectWithValue }) => {
    try {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        return auth === 'granted';
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show nearby restaurants and deliver to your address.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      return rejectWithValue('Failed to request location permission');
    }
  }
);

export const detectCurrentLocation = createAsyncThunk(
  'location/detectCurrent',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const hasPermission = await dispatch(requestLocationPermission()).unwrap();

      if (!hasPermission) {
        return rejectWithValue('Location permission denied');
      }

      return new Promise<LocationData>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Get human-readable address using enhanced geocoding
              const readableAddress = await reverseGeocodeWithFallback(
                position.coords.latitude,
                position.coords.longitude
              );

              const locationData: LocationData = {
                id: `current-${Date.now()}`,
                label: 'Current Location',
                address: readableAddress,
                coordinates: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
                type: 'current',
              };
              resolve(locationData);
            } catch (error) {
              // Fallback to coordinates if reverse geocoding fails
              const locationData: LocationData = {
                id: `current-${Date.now()}`,
                label: 'Current Location',
                address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
                coordinates: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
                type: 'current',
              };
              resolve(locationData);
            }
          },
          (error) => {
            let errorMessage = 'Unable to detect location';
            switch (error.code) {
              case 1: errorMessage = 'Location permission denied'; break;
              case 2: errorMessage = 'Location unavailable'; break;
              case 3: errorMessage = 'Location request timed out'; break;
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      });
    } catch (error) {
      return rejectWithValue('Failed to detect location');
    }
  }
);

export const detectHighAccuracyLocation = createAsyncThunk(
  'location/detectHighAccuracy',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const hasPermission = await dispatch(requestLocationPermission()).unwrap();

      if (!hasPermission) {
        return rejectWithValue('Location permission denied');
      }

      return new Promise<LocationData>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Get high-precision address using enhanced geocoding
              const readableAddress = await reverseGeocodeWithFallback(
                position.coords.latitude,
                position.coords.longitude
              );

              const locationData: LocationData = {
                id: `high-acc-${Date.now()}`,
                label: 'Precise Location',
                address: readableAddress,
                coordinates: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
                type: 'current',
              };
              resolve(locationData);
            } catch (error) {
              // Fallback to coordinates if reverse geocoding fails
              const locationData: LocationData = {
                id: `high-acc-${Date.now()}`,
                label: 'Precise Location',
                address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
                coordinates: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
                type: 'current',
              };
              resolve(locationData);
            }
          },
          (error) => {
            let errorMessage = 'Unable to detect precise location';
            switch (error.code) {
              case 1: errorMessage = 'Location permission denied'; break;
              case 2: errorMessage = 'High accuracy location unavailable'; break;
              case 3: errorMessage = 'Location request timed out'; break;
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 5000,
          }
        );
      });
    } catch (error) {
      return rejectWithValue('Failed to detect high accuracy location');
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<LocationData>) => {
      state.currentLocation = action.payload;
    },
    setManualLocation: (state, action: PayloadAction<{ address: string; label?: string }>) => {
      const { address, label = 'Custom Address' } = action.payload;
      state.currentLocation = {
        id: `manual-${Date.now()}`,
        label,
        address: address.trim(),
        type: 'manual',
      };
    },
    addSavedAddress: (state, action: PayloadAction<LocationData>) => {
      state.savedAddresses.push(action.payload);
    },
    removeSavedAddress: (state, action: PayloadAction<string>) => {
      state.savedAddresses = state.savedAddresses.filter(addr => addr.id !== action.payload);
    },
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      const address = state.savedAddresses.find(addr => addr.id === action.payload);
      if (address) {
        state.currentLocation = { ...address, isDefault: true };
        state.savedAddresses = state.savedAddresses.map(addr =>
          addr.id === action.payload ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
        );
      }
    },
    clearCurrentLocation: (state) => {
      state.currentLocation = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPermissionStatus: (state, action: PayloadAction<'unknown' | 'granted' | 'denied' | 'blocked'>) => {
      state.permissionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectCurrentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
        state.error = null;
      })
      .addCase(detectCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(detectHighAccuracyLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectHighAccuracyLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
        state.error = null;
      })
      .addCase(detectHighAccuracyLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(requestLocationPermission.fulfilled, (state, action) => {
        state.permissionStatus = action.payload ? 'granted' : 'denied';
      })
      .addCase(requestLocationPermission.rejected, (state) => {
        state.permissionStatus = 'denied';
      });
  },
});

export const {
  setCurrentLocation,
  setManualLocation,
  addSavedAddress,
  removeSavedAddress,
  setDefaultAddress,
  clearCurrentLocation,
  setLoading,
  setError,
  setPermissionStatus,
} = locationSlice.actions;

// Selectors
export const selectCurrentLocation = (state: { location: LocationState }) => state.location.currentLocation;
export const selectSavedAddresses = (state: { location: LocationState }) => state.location.savedAddresses;
export const selectLocationLoading = (state: { location: LocationState }) => state.location.loading;
export const selectLocationError = (state: { location: LocationState }) => state.location.error;
export const selectPermissionStatus = (state: { location: LocationState }) => state.location.permissionStatus;

export default locationSlice.reducer;
