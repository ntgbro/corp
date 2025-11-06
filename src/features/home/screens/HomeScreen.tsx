import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaWrapper } from '../../../components/layout';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useRestaurants, useServices } from '../hooks/useHomeData';
import { usePromotions } from '../hooks/usePromotions';
import RestaurantCard from '../components/RestaurantCard';
// import ServiceCard from '../components/ServiceCard';
import UnifiedHeader from '../../../components/layout/UnifiedHeader';
import Typography from '../../../components/common/Typography';
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
  const { promotions, loading: promotionsLoading } = usePromotions(1); // Get only the top priority promotion
  const {
    currentLocation,
    loading: locationLoading,
    error: locationError,
  } = useLocationContext();

  // Automatically get GPS location on app start
  useEffect(() => {
    const getLocation = async () => {
      try {
        await dispatch(detectCurrentLocation()).unwrap();
      } catch (error) {
        console.log('Could not get location on app start:', error);
      }
    };

    // Only get location if we don't already have one
    if (!currentLocation) {
      getLocation();
    }
  }, [currentLocation, dispatch]);

  // Calculate card width for edge-to-edge layout (assuming 1.8 cards visible for narrower cards)
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 30) / 1.8; // ✅ Decreased width by increasing divisor from 1.5 to 1.8 and increasing margin

  const handleSearch = (query: string) => {
    if (query.trim().length > 0) {
      // Navigate to search results through Product stack
      (navigation as any).navigate('Product', {
        screen: 'SearchResults',
        params: { searchQuery: query.trim() }
      });
    }
  };

  const handleLocationChange = () => {
    // Simplified location change - directly use current location without dialog
    const getLocation = async () => {
      try {
        await dispatch(detectCurrentLocation()).unwrap();
      } catch (error) {
        Alert.alert('Location Error', 'Unable to detect your location. Please check your permissions and try again.');
      }
    };
    
    getLocation();
  };

  const handleNotificationPress = () => {
    // Navigate directly to Notifications screen using nested navigation through Profile tab
    (navigation as any).navigate('Profile', {
      screen: 'Notifications'
    });
  };

  const handlePromotionPress = (promotion: any) => {
    // Handle promotion press - could navigate to a promotion details screen or specific offer
    console.log('Promotion pressed:', promotion);
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
          paddingHorizontal: 16, // ✅ Added padding to both side edges
        }}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {/* Promotions Banner */}
        {!promotionsLoading && promotions.length > 0 && (
          <View style={styles.promotionBannerContainer}>
            <TouchableOpacity 
              style={styles.promotionBanner}
              onPress={() => handlePromotionPress(promotions[0])}
            >
              {promotions[0].bannerImage ? (
                <Image 
                  source={{ uri: promotions[0].bannerImage }} 
                  style={styles.promotionImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.promotionPlaceholder, { backgroundColor: theme.colors.surface }]}>
                  <Typography variant="body1" color="text">
                    {promotions[0].title}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    {promotions[0].description}
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

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
                <View style={{ marginHorizontal: 4 }}> {/* ✅ Decreased horizontal margin from 8 to 4 for closer spacing between cards */}
                  <RestaurantCard
                    restaurant={restaurant}
                    width={cardWidth}
                    onPress={() => (navigation as any).navigate('Product', { screen: 'RestaurantDetails', params: { restaurantId: restaurant.restaurantId } })}
                  />
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  promotionBannerContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promotionBanner: {
    height: 150,
    borderRadius: 12,
  },
  promotionImage: {
    width: '100%',
    height: '100%',
  },
  promotionPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
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