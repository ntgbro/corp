import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
  TextInput,
  Text,
} from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';
import { ScrollableLocationHeader, FixedSearchHeader } from './UnifiedHeader';

interface DualHeaderLayoutProps extends ScrollViewProps {
  children: React.ReactNode;
  // Scrollable header props (location section)
  showLocation?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onLocationChange?: () => void;
  rightComponent?: React.ReactNode;
  // Fixed header props (search & notifications)
  showSearch?: boolean;
  showNotificationBell?: boolean;
  onSearch?: (query: string) => void;
  onNotificationPress?: () => void;
  // Layout styling
  containerStyle?: ViewStyle;
  scrollViewStyle?: ViewStyle;
  headerHeight?: number; // Height of the fixed header for padding
}

export const DualHeaderLayout: React.FC<DualHeaderLayoutProps> = ({
  children,
  // Scrollable header props
  showLocation = false,
  showBackButton = false,
  onBackPress,
  onLocationChange,
  rightComponent,
  // Fixed header props
  showSearch = false,
  showNotificationBell = false,
  onSearch,
  onNotificationPress,
  // Layout props
  containerStyle,
  scrollViewStyle,
  headerHeight = 100, // Height of search header
  ...scrollViewProps
}) => {
  const { theme } = useThemeContext();
  const [scrollY, setScrollY] = useState(0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, containerStyle]}>
      {/* Fixed Search Header - Shows when location header is scrolled away */}
      {showSearch && scrollY > 60 && (
        <FixedSearchHeader
          showSearch={showSearch}
          showNotificationBell={showNotificationBell}
          onSearch={onSearch}
          onNotificationPress={onNotificationPress}
        />
      )}

      {/* Scrollable Content with Both Headers Initially */}
      <ScrollView
        style={[styles.scrollView, scrollViewStyle]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: showSearch && scrollY > 60 ? headerHeight : 0 }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        {...scrollViewProps}
      >
        {/* Scrollable Location Header - Address & Location Pin (scrolls up first) */}
        <ScrollableLocationHeader
          showLocation={showLocation}
          showBackButton={showBackButton}
          onBackPress={onBackPress}
          onLocationChange={onLocationChange}
          rightComponent={rightComponent}
        />

        {/* Search Header - Initially visible, becomes fixed when location scrolls away */}
        {showSearch && scrollY <= 60 && (
          <View style={[styles.searchHeaderContainer, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.searchSection}>
              <View style={styles.searchRow}>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder="Search for restaurants, food..."
                    placeholderTextColor={theme.colors.textSecondary}
                    editable={false} // Non-functional initially
                  />
                  <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>🔍</Text>
                </View>
                {/* Notification Bell - OUTSIDE search container */}
                {showNotificationBell && (
                  <View style={styles.notificationButton}>
                    <Text style={{ fontSize: 20, color: theme.colors.white }}>🔔</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Main Content */}
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  searchHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
  notificationButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DualHeaderLayout;
