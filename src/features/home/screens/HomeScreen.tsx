import React, { useEffect, useRef, useState } from 'react';
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
  Linking,
} from 'react-native';
import { Svg, Rect, LinearGradient, Stop } from 'react-native-svg';
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
  const { promotions, loading: promotionsLoading } = usePromotions(5); // Get up to 5 promotions for carousel
  const {
    currentLocation,
    loading: locationLoading,
    error: locationError,
  } = useLocationContext();
  
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

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

  // Automatically scroll through promotions
  useEffect(() => {
    console.log('Promotions fetched:', promotions.length);
    console.log('Promotion data:', promotions);
    if (promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % promotions.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // Change promotion every 3 seconds

    return () => clearInterval(interval);
  }, [promotions.length, promotions]);

  // Calculate card width for edge-to-edge layout (assuming 1.8 cards visible for narrower cards)
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
    // Handle promotion press - navigate to bannerImageURL if it exists
    console.log('Promotion pressed:', promotion);
    if (promotion.bannerImageURL) {
      // Open the URL in browser
      Linking.openURL(promotion.bannerImageURL).catch((err: any) => {
        console.error('Failed to open URL:', err);
        Alert.alert('Error', 'Unable to open the link. Please try again later.');
      });
    }
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
          paddingTop: 5, // Reduced padding at the top for better spacing
        }}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {/* Redesigned Promotions Section with Horizontal Carousel */}
        {!promotionsLoading && promotions.length > 0 && (
          <View style={styles.promotionCarouselContainer}>
            <FlatList
              ref={flatListRef}
              data={promotions}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.promotionId}
              onScrollToIndexFailed={(info) => {
                console.log('Scroll to index failed', info);
              }}
              onViewableItemsChanged={({ viewableItems }) => {
                if (viewableItems.length > 0) {
                  setCurrentIndex(viewableItems[0].index || 0);
                }
              }}
              renderItem={({ item: promotion, index }) => {
                console.log('Rendering promotion item:', {
                  title: promotion.title,
                  index: index,
                  promotionId: promotion.promotionId
                });
                return (
                <View style={styles.promotionSlide}>
                  <View style={[styles.promotionContainer, { width: screenWidth - 32 }]}>
                    <TouchableOpacity 
                      style={[styles.promotionCard, { backgroundColor: theme.colors.surface }]}
                      onPress={() => handlePromotionPress(promotion)}
                      activeOpacity={1}
                    >
                      {/* Gradient Background */}
                      <Svg height="100%" width="100%" style={styles.gradientBackground}>
                        <LinearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <Stop offset="0%" stopColor={
                            index % 6 === 0 ? "#754C29" : 
                            index % 6 === 1 ? "#10b981" : 
                            index % 6 === 2 ? "#f59e0b" :
                            index % 6 === 3 ? "#ff69b4" :
                            index % 6 === 4 ? "#ffa500" :
                            "#800080"
                          } stopOpacity="0.4" />
                          <Stop offset="50%" stopColor={
                            index % 6 === 0 ? "#754C29" : 
                            index % 6 === 1 ? "#10b981" : 
                            index % 6 === 2 ? "#f59e0b" :
                            index % 6 === 3 ? "#ff69b4" :
                            index % 6 === 4 ? "#ffa500" :
                            "#800080"
                          } stopOpacity="0.2" />
                          <Stop offset="100%" stopColor="white" stopOpacity="0.1" />
                        </LinearGradient>
                        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#grad-${index})`} />
                      </Svg>
                      <View style={styles.promotionContent}>
                        <View style={styles.promotionTextContainer}>
                          <Typography variant="h6" color="text" style={styles.promotionTitle}>
                            {promotion.title}
                          </Typography>
                          <Typography variant="body2" color="secondary" style={styles.promotionDescription}>
                            {promotion.description}
                          </Typography>
                        </View>
                        <View style={styles.promotionImageContainer}>
                          {promotion.bannerImage ? (
                            <Image 
                              source={{ uri: promotion.bannerImage }} 
                              style={styles.promotionImageSmall}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={[styles.promotionImagePlaceholder, { backgroundColor: theme.colors.surface }]}>
                              <Typography variant="caption" color="secondary">
                                No Image
                              </Typography>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                );
              }}
            />
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
  promotionCarouselContainer: {
    height: 180, // Decreased height from 200 to 180
    marginBottom: 16,
  },
  promotionSlide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  promotionContainer: {
    marginBottom: 16,
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promotionCard: {
    backgroundColor: '#fefefe',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  promotionContent: {
    flexDirection: 'row',
    padding: 8,
    position: 'relative',
  },
  promotionTextContainer: {
    flex: 1,
    paddingRight: 8,
    justifyContent: 'center',
  },
  promotionTitle: {
    marginBottom: 8,
  },
  promotionDescription: {
    marginBottom: 16,
  },
  promotionImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
  },
  promotionImageSmall: {
    width: '100%',
    height: '100%',
  },
  promotionImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
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