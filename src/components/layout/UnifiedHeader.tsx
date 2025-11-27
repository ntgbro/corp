import React, { useState, useEffect, useRef } from 'react';
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
import LocationIcon from '../common/LocationIcon';
import NotificationIcon from '../common/NotificationIcon';
import { logPrimitiveChildren } from '../../utils/debugPrimitiveChildren';

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
  const [isLocationIconActive, setIsLocationIconActive] = useState(false);

  // quick runtime diagnostics in dev only
  useEffect(() => {
    if (__DEV__) {
      logPrimitiveChildren(rightComponent, 'UnifiedHeader.rightComponent');
    }
  }, [rightComponent]);

  const handleLocationChangePress = () => {
    setIsLocationIconActive(true);
    if (onLocationChange) {
      onLocationChange();
    }
  };

  // Defensive renderer: wrap primitive (string/number) children in <Text>
  const renderNode = (node: React.ReactNode) => {
    if (node === null || node === undefined) return null;
    if (typeof node === 'string' || typeof node === 'number') {
      return <Text style={{ color: theme.colors.text }}>{String(node)}</Text>;
    }
    if (Array.isArray(node)) {
      return node.map((n, i) => <React.Fragment key={i}>{renderNode(n)}</React.Fragment>);
    }
    // Handle special cases for objects that might contain text
    if (typeof node === 'object' && node !== null) {
      // If it's already a valid React element, return as-is
      if (React.isValidElement(node)) {
        return node;
      }
    }
    return node;
  };

  const formatLocationAddress = (address: string): { line1: string, line2: string } => {
    if (!address) return { line1: 'Set Location', line2: '' };
    if (address.includes('.') && address.includes(',')) {
      return { line1: address, line2: '' };
    }
    const parts = address.split(', ');
    let line1 = '';
    const roadIndex = parts.findIndex(part =>
      part.toLowerCase().includes('road') ||
      part.toLowerCase().includes('street') ||
      part.toLowerCase().includes('layout') ||
      part.toLowerCase().includes('nagar') ||
      part.toLowerCase().includes('cross') ||
      part.toLowerCase().includes('main')
    );
    if (roadIndex !== -1) {
      line1 = parts[roadIndex];
    }
    const essentialParts: string[] = [];
    const neighbourhoodIndex = parts.findIndex(part =>
      part.toLowerCase().includes('layout') ||
      part.toLowerCase().includes('nagar') ||
      part.toLowerCase().includes('colony') ||
      part.toLowerCase().includes('block') ||
      part.toLowerCase().includes('area') ||
      part.toLowerCase().includes('kuvempu')
    );
    const suburbIndex = parts.findIndex(part =>
      part.toLowerCase().includes('btm') ||
      part.toLowerCase().includes('stage') ||
      part.toLowerCase().includes('extension')
    );
    const cityIndex = parts.findIndex(part =>
      part.toLowerCase().includes('bengaluru') ||
      part.toLowerCase().includes('bangalore')
    );
    const stateIndex = parts.findIndex(part =>
      part.toLowerCase().includes('karnataka')
    );
    const postalIndex = parts.findIndex(part =>
      /^\d{6}$/.test(part.trim())
    );
    if (neighbourhoodIndex !== -1 && neighbourhoodIndex !== roadIndex) {
      essentialParts.push(parts[neighbourhoodIndex]);
    }
    if (suburbIndex !== -1 && suburbIndex !== neighbourhoodIndex && suburbIndex !== roadIndex) {
      essentialParts.push(parts[suburbIndex]);
    }
    if (cityIndex !== -1) {
      essentialParts.push(parts[cityIndex]);
    }
    if (stateIndex !== -1 && stateIndex !== cityIndex) {
      essentialParts.push(parts[stateIndex]);
    }
    if (postalIndex !== -1) {
      essentialParts.push(parts[postalIndex]);
    }
    if (essentialParts.length === 0) {
      const remainingParts = parts.filter((_, index) => index !== roadIndex);
      essentialParts.push(...remainingParts.slice(0, 3));
    }
    const line2 = essentialParts.join(', ');
    if (!line1 && essentialParts.length > 0) {
      line1 = essentialParts.shift() || '';
      return { line1, line2: essentialParts.join(', ') };
    }
    if (!line1 && !line2) {
      return { line1: address, line2: '' };
    }
    return { line1, line2 };
  };

  useEffect(() => {
    if (currentLocation && !locationLoading) {
      setIsLocationIconActive(false);
    }
  }, [currentLocation, locationLoading]);

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={{ fontSize: 18, color: theme.colors.white }}>←</Text>
          </TouchableOpacity>
        )}

        <View style={styles.titleSpacer} />

        <View style={styles.rightContainer}>
          {renderNode(rightComponent)}
        </View>
      </View>

      {showLocation && (
        <View style={styles.locationSection}>
          <View style={styles.locationInfo}>
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressLine1} numberOfLines={1}>
                {currentLocation?.address ? formatLocationAddress(currentLocation.address).line1 : 'Set Location'}
              </Text>
              {currentLocation?.address && formatLocationAddress(currentLocation.address).line2 ? (
                <Text style={styles.addressLine2} numberOfLines={1}>
                  {formatLocationAddress(currentLocation.address).line2}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleLocationChangePress}
              style={styles.locationPinContainer}
              activeOpacity={1.0}
              disabled={locationLoading}
            >
              <LocationIcon
                size={30}
                color={isLocationIconActive ? '#754C29' : 'black'}
                style={[
                  locationLoading && styles.locationPinLoading
                ]}
              />
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
  const [isNotificationIconActive, setIsNotificationIconActive] = useState(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        (navigation as any).navigate('Product', {
          screen: 'SearchResults',
          params: { searchQuery: searchQuery.trim() }
        });
      }
    }
  };

  const handleNotificationPress = () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setIsNotificationIconActive(true);
    notificationTimeoutRef.current = setTimeout(() => {
      setIsNotificationIconActive(false);
      notificationTimeoutRef.current = null;
    }, 2000);
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      (navigation as any).navigate('Profile', {
        screen: 'Notifications'
      });
    }
  };

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

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
          {showNotificationBell && (
            <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
              <NotificationIcon
                size={30}
                color={isNotificationIconActive ? '#754C29' : 'black'}
              />
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
  const [isLocationIconActive, setIsLocationIconActive] = useState(false);
  const [isNotificationIconActive, setIsNotificationIconActive] = useState(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        if (__DEV__) {
          console.log('[NAVIGATION] UnifiedHeader search submitted:', searchQuery);
        }
        (navigation as any).navigate('Product', {
          screen: 'SearchResults',
          params: { searchQuery: searchQuery.trim() }
        });
      }
    }
  };

  const handleLocationChangePress = () => {
    if (__DEV__) {
      console.log('[NAVIGATION] UnifiedHeader location change pressed');
    }
    setIsLocationIconActive(true);
    if (onLocationChange) {
      onLocationChange();
    }
  };

  const handleNotificationPress = () => {
    if (__DEV__) {
      console.log('[NAVIGATION] UnifiedHeader notification pressed');
    }
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setIsNotificationIconActive(true);
    notificationTimeoutRef.current = setTimeout(() => {
      setIsNotificationIconActive(false);
      notificationTimeoutRef.current = null;
    }, 2000);
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      (navigation as any).navigate('Profile', {
        screen: 'Notifications'
      });
    }
  };

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const formatLocationAddress = (address: string): { line1: string, line2: string } => {
    if (!address) return { line1: 'Set Location', line2: '' };
    if (address.includes('.') && address.includes(',')) {
      return { line1: address, line2: '' };
    }
    const parts = address.split(', ');
    let line1 = '';
    const roadIndex = parts.findIndex(part =>
      part.toLowerCase().includes('road') ||
      part.toLowerCase().includes('street') ||
      part.toLowerCase().includes('layout') ||
      part.toLowerCase().includes('nagar') ||
      part.toLowerCase().includes('cross') ||
      part.toLowerCase().includes('main')
    );
    if (roadIndex !== -1) {
      line1 = parts[roadIndex];
    }
    const essentialParts: string[] = [];
    const neighbourhoodIndex = parts.findIndex(part =>
      part.toLowerCase().includes('layout') ||
      part.toLowerCase().includes('nagar') ||
      part.toLowerCase().includes('colony') ||
      part.toLowerCase().includes('block') ||
      part.toLowerCase().includes('area') ||
      part.toLowerCase().includes('kuvempu')
    );
    const suburbIndex = parts.findIndex(part =>
      part.toLowerCase().includes('btm') ||
      part.toLowerCase().includes('stage') ||
      part.toLowerCase().includes('extension')
    );
    const cityIndex = parts.findIndex(part =>
      part.toLowerCase().includes('bengaluru') ||
      part.toLowerCase().includes('bangalore')
    );
    const stateIndex = parts.findIndex(part =>
      part.toLowerCase().includes('karnataka')
    );
    const postalIndex = parts.findIndex(part =>
      /^\d{6}$/.test(part.trim())
    );
    if (neighbourhoodIndex !== -1 && neighbourhoodIndex !== roadIndex) {
      essentialParts.push(parts[neighbourhoodIndex]);
    }
    if (suburbIndex !== -1 && suburbIndex !== neighbourhoodIndex && suburbIndex !== roadIndex) {
      essentialParts.push(parts[suburbIndex]);
    }
    if (cityIndex !== -1) {
      essentialParts.push(parts[cityIndex]);
    }
    if (stateIndex !== -1 && stateIndex !== cityIndex) {
      essentialParts.push(parts[stateIndex]);
    }
    if (postalIndex !== -1) {
      essentialParts.push(parts[postalIndex]);
    }
    if (essentialParts.length === 0) {
      const remainingParts = parts.filter((_, index) => index !== roadIndex);
      essentialParts.push(...remainingParts.slice(0, 3));
    }
    const line2 = essentialParts.join(', ');
    if (!line1 && essentialParts.length > 0) {
      line1 = essentialParts.shift() || '';
      return { line1, line2: essentialParts.join(', ') };
    }
    if (!line1 && !line2) {
      return { line1: address, line2: '' };
    }
    return { line1, line2 };
  };

  useEffect(() => {
    if (currentLocation && !locationLoading) {
      setIsLocationIconActive(false);
    }
  }, [currentLocation, locationLoading]);

  // Defensive renderer for rightComponent in this header as well
  const renderNode = (node: React.ReactNode) => {
    if (node === null || node === undefined) return null;
    if (typeof node === 'string' || typeof node === 'number') {
      return <Text style={{ color: theme.colors.text }}>{String(node)}</Text>;
    }
    if (Array.isArray(node)) {
      return node.map((n, i) => <React.Fragment key={i}>{renderNode(n)}</React.Fragment>);
    }
    // Handle special cases for objects that might contain text
    if (typeof node === 'object' && node !== null) {
      // If it's already a valid React element, return as-is
      if (React.isValidElement(node)) {
        return node;
      }
    }
    return node;
  };

  useEffect(() => {
    console.log('[NAVIGATION] UnifiedHeader rendered with props:', {
      title,
      showBackButton,
      showLocation,
      showSearch,
      showNotificationBell
    });
  }, [title, showBackButton, showLocation, showSearch, showNotificationBell]);

  return (
    <View style={[styles.header, { backgroundColor: '#F5DEB3' }]}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => {
              if (__DEV__) {
                console.log('[NAVIGATION] UnifiedHeader back button pressed');
              }
              if (onBackPress) {
                onBackPress();
              }
            }}
            style={styles.backButton}
          >
            <Text style={{ fontSize: 18, color: theme.colors.text }}>←</Text>
          </TouchableOpacity>
        )}

        {!title && <View style={styles.titleSpacer} />}

        {title && (
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        )}

        <View style={styles.rightContainer}>
          {renderNode(rightComponent)}
        </View>
      </View>

      {showLocation && (
        <View style={styles.locationSection}>
          <View style={styles.locationInfo}>
            <View style={styles.addressTextContainerNoCard}>
              <Text style={styles.addressLine1NoCard} numberOfLines={1}>
                {currentLocation?.address ? formatLocationAddress(currentLocation.address).line1 : 'Set Location'}
              </Text>
              {currentLocation?.address && formatLocationAddress(currentLocation.address).line2 ? (
                <Text style={styles.addressLine2NoCard} numberOfLines={1}>
                  {formatLocationAddress(currentLocation.address).line2}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleLocationChangePress}
              style={styles.locationPinContainer}
              activeOpacity={1.0}
              disabled={locationLoading}
            >
              <LocationIcon
                size={30}
                color={isLocationIconActive ? '#754C29' : 'black'}
                style={[
                  locationLoading && styles.locationPinLoading
                ]}
              />
            </TouchableOpacity>

          </View>
        </View>
      )}

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
            {showNotificationBell && (
              <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
                <NotificationIcon
                  size={30}
                  color={isNotificationIconActive ? '#754C29' : 'black'}
                />
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    marginBottom: 3,
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
    marginBottom: 3,
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
  addressTextNoCard: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
    lineHeight: 18,
    textAlign: 'left',
    flex: 1,
    marginLeft: 8,
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
    backgroundColor: 'transparent',
  },
  locationPinText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    textShadowColor: 'transparent',
  },
  locationPinLoading: {
    transform: [{ scale: 1.2 }],
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
  addressTextContainer: {
    flex: 1,
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
  },
  addressLine1: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    lineHeight: 18,
  },
  addressLine2: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
  },
  addressTextContainerNoCard: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  addressLine1NoCard: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    lineHeight: 18,
  },
  addressLine2NoCard: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.8)',
    lineHeight: 16,
  },
});

export default React.memo(UnifiedHeader);
