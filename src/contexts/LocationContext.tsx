import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  LocationData,
  selectCurrentLocation,
  selectSavedAddresses,
  selectLocationLoading,
  selectLocationError,
  selectPermissionStatus,
} from '../store/slices/locationSlice';

export interface LocationContextType {
  currentLocation: LocationData | null;
  savedAddresses: LocationData[];
  loading: boolean;
  error: string | null;
  permissionStatus: 'unknown' | 'granted' | 'denied' | 'blocked';
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const currentLocation = useSelector(selectCurrentLocation);
  const savedAddresses = useSelector(selectSavedAddresses);
  const loading = useSelector(selectLocationLoading);
  const error = useSelector(selectLocationError);
  const permissionStatus = useSelector(selectPermissionStatus);

  const value: LocationContextType = {
    currentLocation,
    savedAddresses,
    loading,
    error,
    permissionStatus,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
