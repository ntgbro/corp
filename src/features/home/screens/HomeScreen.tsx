import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaWrapper } from '../../../components/layout';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useRestaurants, useServices } from '../hooks/useHomeData';
import { useCategories } from '../../product/hooks';
import RestaurantCard from '../components/RestaurantCard';
// import ServiceCard from '../components/ServiceCard';
import UnifiedHeader from '../../../components/layout/UnifiedHeader';
import Typography from '../../../components/common/Typography';
import CategorySections from '../../../components/layout/CategorySections';
import { useLocationContext } from '../../../contexts/LocationContext';
import { AppDispatch, RootState } from '../../../store';
import {
  detectCurrentLocation,
  detectHighAccuracyLocation,
  setManualLocation,
} from '../../../store/slices/locationSlice';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useThemeContext();
  const { user } = useAuth();
  const { restaurants, loading: restaurantsLoading } = useRestaurants(5);
  // const { services, loading: servicesLoading } = useServices();
  const { categories, loading: categoriesLoading } = useCategories('fresh');
  const {
    currentLocation,
    loading: locationLoading,
    error: locationError,
  } = useLocationContext();

  // Calculate card width for edge-to-edge layout (assuming 1.5 cards visible)
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 20) / 1.5; // Account for small margins

  const handleSearch = (query: string) => {
    if (query.trim().length > 0) {
      // Navigate to search results only when Enter is pressed
      (navigation as any).navigate('Product', {
        screen: 'Products',
        params: { searchQuery: query.trim() }
      });
    }
  };

  const handleCategoryPress = (category: { id: string; name: string }) => {
    (navigation as any).navigate('Product', {
      screen: 'ProductsPage',
      params: { category: category.id }
    });
  };

  const handleLocationChange = () => {
    Alert.alert(
      'Set Delivery Location',
      'How would you like to set your location?',
      [
        {
          text: '📍 Use Current Location',
          onPress: async () => {
            try {
              await dispatch(detectCurrentLocation()).unwrap();
            } catch (error) {
              Alert.alert('Location Error', 'Unable to detect your location. Please check your permissions and try again.');
            }
          },
        },
        {
          text: '🎯 High Accuracy Location',
          onPress: async () => {
            try {
              await dispatch(detectHighAccuracyLocation()).unwrap();
            } catch (error) {
              Alert.alert('Location Error', 'Unable to detect precise location. Please check your permissions and try again.');
            }
          },
        },
        {
          text: '✏️ Enter Address Manually',
          onPress: () => {
            Alert.prompt(
              'Enter Delivery Address',
              'Please enter your delivery address:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Set Location',
                  onPress: async (address: string | undefined) => {
                    if (address && address.trim().length > 0) {
                      dispatch(setManualLocation({ address: address.trim() }));
                    }
                  }
                }
              ],
              'plain-text'
            );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleNotificationPress = () => {
    Alert.alert(
      'Notifications',
      'You have no new notifications!',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <UnifiedHeader
        title=""
        showLocation={true}
        showSearch={true}
        showNotificationBell={true}
        onLocationChange={handleLocationChange}
        onSearch={handleSearch}
        onNotificationPress={handleNotificationPress}
      />
      <ScrollView
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          paddingBottom: 80, // Space for bottom navigation (60px + extra padding)
        }}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {/* Services Section - Currently Commented Out */}
        {/*
        <View style={styles.compactSectionContainer}>
          <View style={styles.compactTitleContainer}>
            <Typography variant="h5" color="text">Our Services</Typography>
          </View>
          {servicesLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={services}
              keyExtractor={(service) => service.serviceId}
              horizontal
              nestedScrollEnabled={true}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              renderItem={({ item: service }) => (
                <View style={{ marginHorizontal: 10 }}>
                  <ServiceCard
                    service={service}
                    onPress={() => (navigation as any).navigate('ServiceScreen', { serviceId: service.serviceId })}
                  />
                </View>
              )}
            />
          )}
        </View>
        */}

        {/* Restaurants Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.titleContainer}>
            <Typography variant="h5" color="text">Featured Restaurants</Typography>
          </View>
          {restaurantsLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={restaurants}
              keyExtractor={(restaurant) => restaurant.restaurantId}
              horizontal
              nestedScrollEnabled={true}
              contentContainerStyle={{
                // Removed paddingHorizontal for edge-to-edge layout
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: restaurant }: { item: any }) => (
                <RestaurantCard
                  restaurant={restaurant}
                  width={cardWidth}
                  onPress={() => (navigation as any).navigate('Product', { screen: 'RestaurantDetails', params: { restaurantId: restaurant.restaurantId } })}
                />
              )}
            />
          )}
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.titleContainer}>
            <Typography variant="h5" color="text">Categories</Typography>
          </View>
          {categoriesLoading ? (
            <ActivityIndicator />
          ) : categories.length > 0 ? (
            <CategorySections
              categories={categories}
              onCategoryPress={handleCategoryPress}
              variant="grid4"
              showIcons={false}
            />
          ) : (
            <Typography variant="body2" color="secondary" style={{ textAlign: 'center' }}>
              No categories available
            </Typography>
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  compactSectionContainer: {
    marginBottom: 0,
    marginTop: 1,
    // Removed paddingHorizontal for edge-to-edge layout
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Light border
    backgroundColor: '#fefefe',   // Warm White
  },
  compactTitleContainer: {
    // Removed paddingHorizontal for edge-to-edge layout
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Light border
    marginBottom: 1,
    backgroundColor: '#fefefe',   // Warm White
  },
  sectionContainer: {
    marginBottom: 0,
    // Removed paddingHorizontal for edge-to-edge layout
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Light border
    backgroundColor: '#fefefe',   // Warm White
  },
  titleContainer: {
    // Removed paddingHorizontal for edge-to-edge layout
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Light border
    marginBottom: 12,
    backgroundColor: '#fefefe',   // Warm White
  },
  section: {
    flex: 1,
  },
});

export default HomeScreen;
