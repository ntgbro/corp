import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface HomeHeaderProps {
  onLocationChange?: () => void;
  onSearch?: (query: string) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onLocationChange, onSearch }) => {
  const { theme } = useThemeContext();

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.locationSection}>
          <Text style={[styles.locationText, { color: theme.colors.white }]}>
            📍 Deliver to: Home
          </Text>
          <TouchableOpacity onPress={onLocationChange}>
            <Text style={[styles.changeLocation, { color: theme.colors.white }]}>
              Change
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchSection}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
            placeholder="Search for restaurants, food..."
            placeholderTextColor={theme.colors.textSecondary}
            onChangeText={onSearch}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={{ color: theme.colors.primary }}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    gap: 10,
  },
  locationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  changeLocation: {
    fontSize: 12,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 5,
  },
});

export default HomeHeader;
