import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useLocationContext } from '../../contexts/LocationContext';

interface ScrollableLocationHeaderProps {
  showBackButton?: boolean;
  showLocation?: boolean;
  onBackPress?: () => void;
  onLocationChange?: () => void;
  rightComponent?: React.ReactNode;
}

export const ScrollableLocationHeader: React.FC<ScrollableLocationHeaderProps> = ({
  showBackButton = false,
  showLocation = false,
  onBackPress,
  onLocationChange,
  rightComponent,
}) => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const { currentLocation, loading: locationLoading } = useLocationContext();

  const handleLocationChangePress = () => {
    if (onLocationChange) {
      onLocationChange();
    }
  };

  // Format location address to show specific OSM components only
  const formatLocationAddress = (address: string): { display: string } => {
    if (!address) return { display: '' };

    // If address contains coordinates, return as-is
    if (address.includes('.') && address.includes(',')) {
      return { display: address };
    }

    const parts = address.split(', ');

    // Extract only the specific components we want: neighbourhood, suburb, postcode
    const essentialParts = [];

    // Find neighbourhood
    const neighbourhoodIndex = parts.findIndex(part =>
      part.toLowerCase().includes('kuvempu') ||
      part.toLowerCase().includes('nagar') ||
      part.toLowerCase().includes('layout') ||
      part.toLowerCase().includes('colony') ||
      part.toLowerCase().includes('extension') ||
      part.toLowerCase().includes('block')
    );

    // Find suburb
    const suburbIndex = parts.findIndex(part =>
      part.toLowerCase().includes('btm') ||
      part.toLowerCase().includes('layout') ||
      part.toLowerCase().includes('south') ||
      part.toLowerCase().includes('north') ||
      part.toLowerCase().includes('east') ||
      part.toLowerCase().includes('west')
    );

    // Find postal code (6-digit number)
    const postalIndex = parts.findIndex(part =>
      /^\d{6}$/.test(part.trim()) // Exactly 6 digits
    );

    // Add neighbourhood if found
    if (neighbourhoodIndex !== -1) {
      essentialParts.push(parts[neighbourhoodIndex]);
    }

    // Add suburb if found and different from neighbourhood
    if (suburbIndex !== -1 && suburbIndex !== neighbourhoodIndex) {
      essentialParts.push(parts[suburbIndex]);
    }

    // Add postal code if found
    if (postalIndex !== -1) {
      essentialParts.push(parts[postalIndex]);
    }

    // If no specific components found, use first part
    if (essentialParts.length === 0 && parts.length > 0) {
      essentialParts.push(parts[0]);
    }

    return {
      display: essentialParts.join(', ')
    };
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.headerContent}>
        {/* Back Button */}
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={{ fontSize: 18, color: theme.colors.white }}>←</Text>
          </TouchableOpacity>
        )}

        {/* Spacer for center alignment */}
        <View style={styles.titleSpacer} />

        {/* Right Component */}
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>

      {/* Location Section - This will scroll with content */}
      {showLocation && (
        <View style={styles.locationSection}>
          <View style={styles.locationInfo}>
            <View style={styles.addressBox}>
              {/* Simplified Address Display */}
              <Text style={styles.addressText}>
                {currentLocation?.address ? formatLocationAddress(currentLocation.address).display : 'Set Location'}
              </Text>
            </View>

            {/* Change Location Button */}
            <TouchableOpacity
              onPress={handleLocationChangePress}
              style={styles.locationPinContainer}
              activeOpacity={1.0} // No opacity change to prevent shifting
              disabled={locationLoading} // Disable when loading
            >
              <Text style={[
                styles.locationPinText,
                locationLoading && styles.locationPinLoading // Add loading animation style
              ]}>
                📍
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

interface FixedSearchHeaderProps {
  showSearch?: boolean;
  showNotificationBell?: boolean;
  onSearch?: (query: string) => void;
  onNotificationPress?: () => void;
}

export const FixedSearchHeader: React.FC<FixedSearchHeaderProps> = ({
  showSearch = false,
  showNotificationBell = false,
  onSearch,
  onNotificationPress,
}) => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Don't trigger search on every keystroke
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        // Fallback to local implementation
        (navigation as any).navigate('Product', {
          screen: 'Products',
          params: { searchQuery: searchQuery.trim() }
        });
      }
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  // Only render if search is enabled
  if (!showSearch) return null;

  return (
    <View style={[styles.fixedSearchHeaderAbsolute, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search for restaurants, food..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchIconButton}>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>🔍</Text>
            </TouchableOpacity>
          </View>
          {/* Notification Bell - OUTSIDE search container */}
          {showNotificationBell && (
            <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
              <Text style={{ fontSize: 20, color: theme.colors.white }}>🔔</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

interface UnifiedHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showLocation?: boolean;
  showSearch?: boolean;
  showNotificationBell?: boolean;
  onBackPress?: () => void;
  onLocationChange?: () => void;
  onSearch?: (query: string) => void;
  onNotificationPress?: () => void;
  rightComponent?: React.ReactNode;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  title,
  showLocation = false,
  showSearch = false,
  showBackButton = false,
  showNotificationBell = false,
  onBackPress,
  onLocationChange,
  onSearch,
  onNotificationPress,
  rightComponent,
}) => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const { currentLocation, loading: locationLoading } = useLocationContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Don't trigger search on every keystroke
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        // Fallback to local implementation
        (navigation as any).navigate('Product', {
          screen: 'Products',
          params: { searchQuery: searchQuery.trim() }
        });
      }
    }
  };

  const handleLocationChangePress = () => {
    if (onLocationChange) {
      onLocationChange();
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  // Format location address to show specific OSM components only
  const formatLocationAddress = (address: string): { display: string } => {
    if (!address) return { display: '' };

    // If address contains coordinates, return as-is
    if (address.includes('.') && address.includes(',')) {
      return { display: address };
    }

    const parts = address.split(', ');

    // Extract only the specific components we want: neighbourhood, suburb, postcode
    const essentialParts = [];

    // Find neighbourhood
    const neighbourhoodIndex = parts.findIndex(part =>
      part.toLowerCase().includes('kuvempu') ||
      part.toLowerCase().includes('nagar') ||
      part.toLowerCase().includes('layout') ||
      part.toLowerCase().includes('colony') ||
      part.toLowerCase().includes('extension') ||
      part.toLowerCase().includes('block')
    );

    // Find suburb
    const suburbIndex = parts.findIndex(part =>
      part.toLowerCase().includes('btm') ||
      part.toLowerCase().includes('layout') ||
      part.toLowerCase().includes('south') ||
      part.toLowerCase().includes('north') ||
      part.toLowerCase().includes('east') ||
      part.toLowerCase().includes('west')
    );

    // Find postal code (6-digit number)
    const postalIndex = parts.findIndex(part =>
      /^\d{6}$/.test(part.trim()) // Exactly 6 digits
    );

    // Add neighbourhood if found
    if (neighbourhoodIndex !== -1) {
      essentialParts.push(parts[neighbourhoodIndex]);
    }

    // Add suburb if found and different from neighbourhood
    if (suburbIndex !== -1 && suburbIndex !== neighbourhoodIndex) {
      essentialParts.push(parts[suburbIndex]);
    }

    // Add postal code if found
    if (postalIndex !== -1) {
      essentialParts.push(parts[postalIndex]);
    }

    // If no specific components found, use first part
    if (essentialParts.length === 0 && parts.length > 0) {
      essentialParts.push(parts[0]);
    }

    return {
      display: essentialParts.join(', ')
    };
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.headerContent}>
        {/* Back Button */}
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={{ fontSize: 18, color: theme.colors.white }}>←</Text>
          </TouchableOpacity>
        )}

        {/* Spacer for center alignment when no title */}
        {!title && <View style={styles.titleSpacer} />}

        {/* Title */}
        {title && (
          <Text style={styles.title}>{title}</Text>
        )}

        {/* Right Component */}
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>

      {/* Location Section */}
      {showLocation && (
        <View style={styles.locationSection}>
          <View style={styles.locationInfo}>
            <View style={styles.addressBox}>
              {/* Simplified Address Display */}
              <Text style={styles.addressText}>
                {currentLocation?.address ? formatLocationAddress(currentLocation.address).display : 'Set Location'}
              </Text>
            </View>

            {/* Change Location Button */}
            <TouchableOpacity
              onPress={handleLocationChangePress}
              style={styles.locationPinContainer}
              activeOpacity={1.0} // No opacity change to prevent shifting
              disabled={locationLoading} // Disable when loading
            >
              <Text style={[
                styles.locationPinText,
                locationLoading && styles.locationPinLoading // Add loading animation style
              ]}>
                📍
              </Text>
            </TouchableOpacity>
          </View>

          {/* Removed loading text section */}
        </View>
      )}

      {/* Search Section with Notification Bell */}
      {showSearch && (
        <View style={styles.searchSection}>
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                placeholder="Search for restaurants, food..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={handleSearch}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchIconButton}>
                <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>🔍</Text>
              </TouchableOpacity>
            </View>
            {/* Notification Bell - OUTSIDE search container */}
            {showNotificationBell && (
              <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
                <Text style={{ fontSize: 20, color: theme.colors.white }}>🔔</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  fixedSearchHeaderAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    color: 'white',
  },
  titleSpacer: {
    flex: 1,
  },
  rightContainer: {
    width: 32,
    alignItems: 'flex-end',
  },
  notificationButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    minHeight: 40,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressBox: {
    flex: 1,
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 36,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    lineHeight: 18,
    textAlign: 'left',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  changeLocation: {
    fontSize: 11,
  },
  locationPinContainer: {
    padding: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
    backgroundColor: 'transparent', // Prevent any background changes
  },
  locationPinText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false, // Prevent font padding issues
    textShadowColor: 'transparent', // Prevent text shadow effects
  },
  locationPinLoading: {
    transform: [{ scale: 1.2 }], // Slightly larger when loading
    opacity: 0.8, // Slightly transparent when loading
  },
  searchSection: {
    marginBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIconButton: {
    padding: 4,
    marginLeft: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
});

export default UnifiedHeader;
