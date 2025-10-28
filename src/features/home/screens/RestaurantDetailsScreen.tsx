import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../components/layout';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Typography from '../../../components/common/Typography';
import { useRestaurantDetails } from '../hooks/useHomeData';
import MenuItemCard from '../components/MenuItemCard';
import { SPACING, BORDERS, SHADOWS } from '../../../constants/ui';

interface RouteParams {
  restaurantId: string;
}

const { width } = Dimensions.get('window');

const RestaurantDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurantId } = route.params as RouteParams;
  const { theme } = useThemeContext();
  const { restaurant, menuItems, loading, error } = useRestaurantDetails(restaurantId);

  const handleMenuItemPress = (menuItemId: string) => {
    console.log('Navigator state:', navigation.getState());
    console.log('Attempting to navigate to ProductDetails with menuItemId:', menuItemId);
    (navigation as any).navigate('ProductDetails', { menuItemId });
  };

  const handleSeeAllPress = (category: string) => {
    // Navigate to products page with the specific category and restaurant
    (navigation as any).navigate('Product', {
      screen: 'Products', // ✅ Changed from 'ProductScreen' to 'Products'
      params: {
        category,
        restaurantId: restaurantId
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.textSecondary, marginTop: 10 }}>Loading restaurant details...</Text>
      </SafeAreaWrapper>
    );
  }

  if (error || !restaurant) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.error }}>Error loading restaurant details.</Text>
      </SafeAreaWrapper>
    );
  }

  console.log('RestaurantDetailsScreen rendering with restaurant:', restaurant);

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc: Record<string, typeof menuItems>, item: any) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const categories = Object.keys(groupedItems);

  const renderMenuItem = ({ item }: { item: any }) => (
    <MenuItemCard
      menuItem={item}
      onPress={() => handleMenuItemPress(item.menuItemId)}
      onAddToCart={() => console.log('Add to cart', item.menuItemId)}
    />
  );

  const renderCategory = ({ item: category }: { item: string }) => (
    <View style={styles.section}>
      <View style={styles.categoryHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{category}</Text>
        <TouchableOpacity
          style={[styles.seeAllButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => handleSeeAllPress(category)}
        >
          <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={groupedItems[category]}
        keyExtractor={(item) => item.menuItemId}
        renderItem={renderMenuItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 1, // 1px between items
        }}
      />
    </View>
  );

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{
        // Removed paddingHorizontal for edge-to-edge layout
      }}>
        {/* Restaurant Hero Section with Banner */}
        <View style={styles.heroSection}>
          {restaurant.bannerURL ? (
            <Image
              source={{ uri: restaurant.bannerURL }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.bannerImage, styles.bannerPlaceholder, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="body1" color="secondary">
                Restaurant Banner
              </Typography>
            </View>
          )}

          {/* Restaurant Logo Overlay */}
          <View style={styles.logoOverlay}>
            {restaurant.logoURL ? (
              <Image
                source={{ uri: restaurant.logoURL }}
                style={styles.logoImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.logoImage, styles.logoPlaceholder, { backgroundColor: theme.colors.surface }]}>
                <Typography variant="body1" color="secondary">
                  Logo
                </Typography>
              </View>
            )}
          </View>
        </View>

        {/* Restaurant Info Section */}
        <View style={styles.infoSection}>
          <Typography variant="h4" color="text" style={styles.name}>
            {restaurant.name}
          </Typography>
          <View style={styles.ratingContainer}>
            <Typography variant="body1" color="primary" style={styles.rating}>
              ⭐ {restaurant.avgRating || 'N/A'}
            </Typography>
            <Typography variant="body2" color="secondary" style={styles.reviewCount}>
              ({restaurant.totalRatings || 0} reviews)
            </Typography>
          </View>
          <Typography variant="body1" color="secondary" style={styles.description}>
            {restaurant.description}
          </Typography>

          {/* Restaurant Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="caption" color="secondary" style={styles.detailLabel}>📍 Address</Typography>
              <Typography variant="body2" color="text" style={styles.detailValue}>
                {restaurant.address ? `${restaurant.address.line1}, ${restaurant.address.city}` : 'Not available'}
              </Typography>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="caption" color="secondary" style={styles.detailLabel}>📞 Phone</Typography>
              <Typography variant="body2" color="text" style={styles.detailValue}>{restaurant.phone}</Typography>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="caption" color="secondary" style={styles.detailLabel}>⏱️ Delivery</Typography>
              <Typography variant="body2" color="text" style={styles.detailValue}>
                {restaurant.avgDeliveryTime || 'Not specified'}
              </Typography>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="caption" color="secondary" style={styles.detailLabel}>💰 Min Order</Typography>
              <Typography variant="body2" color="text" style={styles.detailValue}>
                ₹{restaurant.minOrderAmount || 'Not specified'}
              </Typography>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="caption" color="secondary" style={styles.detailLabel}>🚚 Delivery Fee</Typography>
              <Typography variant="body2" color="text" style={styles.detailValue}>
                ₹{restaurant.deliveryCharges || 'Free'}
              </Typography>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="caption" color="secondary" style={styles.detailLabel}>🎯 Price Range</Typography>
              <Typography variant="body2" color="text" style={styles.detailValue}>
                {restaurant.priceRange || 'Not specified'}
              </Typography>
            </View>

            {/* Enhanced Details */}
            {restaurant.maxDeliveryRadius && (
              <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
                <Typography variant="caption" color="secondary" style={styles.detailLabel}>📏 Delivery Radius</Typography>
                <Typography variant="body2" color="text" style={styles.detailValue}>
                  {restaurant.maxDeliveryRadius} km
                </Typography>
              </View>
            )}

            {restaurant.freeDeliveryAbove && (
              <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
                <Typography variant="caption" color="secondary" style={styles.detailLabel}>🎁 Free Delivery</Typography>
                <Typography variant="body2" color="text" style={styles.detailValue}>
                  Above ₹{restaurant.freeDeliveryAbove}
                </Typography>
              </View>
            )}

            {/* Payment Methods */}
            <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="caption" color="secondary" style={styles.detailLabel}>💳 Payment</Typography>
              <Typography variant="body2" color="text" style={styles.detailValue}>
                {restaurant.hasOnlinePayment && restaurant.hasCashOnDelivery
                  ? 'Online + Cash'
                  : restaurant.hasOnlinePayment
                  ? 'Online Only'
                  : restaurant.hasCashOnDelivery
                  ? 'Cash Only'
                  : 'Not specified'}
              </Typography>
            </View>

            {/* Veg/Non-Veg */}
            <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
              <Typography variant="caption" color="secondary" style={styles.detailLabel}>🥗 Type</Typography>
              <Typography variant="body2" color="text" style={styles.detailValue}>
                {restaurant.isPureVeg ? 'Pure Veg' : 'Veg & Non-Veg'}
              </Typography>
            </View>

            {/* Services */}
            {restaurant.serviceIds && restaurant.serviceIds.length > 0 && (
              <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
                <Typography variant="caption" color="secondary" style={styles.detailLabel}>🏪 Services</Typography>
                <Typography variant="body2" color="text" style={styles.detailValue}>
                  {restaurant.serviceIds.join(', ')}
                </Typography>
              </View>
            )}

            {/* Setup Status */}
            {restaurant.needsSetup !== undefined && (
              <View style={[styles.detailItem, { backgroundColor: theme.colors.surface }]}>
                <Typography variant="caption" color="secondary" style={styles.detailLabel}>⚙️ Status</Typography>
                <Typography variant="body2" color={restaurant.needsSetup ? "error" : "success"} style={styles.detailValue}>
                  {restaurant.needsSetup ? 'Setup Required' : 'Ready'}
                </Typography>
              </View>
            )}
          </View>

          {/* Operating Hours */}
          {restaurant.openHours && (
            <View style={styles.hoursSection}>
              <Typography variant="h6" color="text" style={styles.sectionTitle}>Operating Hours</Typography>
              <View style={styles.hoursGrid}>
                {Object.entries(restaurant.openHours).map(([day, hours]) => (
                  <View key={day} style={[styles.hourItem, { backgroundColor: theme.colors.surface }]}>
                    <Typography variant="caption" color="secondary" style={styles.dayLabel}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text" style={styles.hourValue}>
                      {hours.open} - {hours.close}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Delivery Locations */}
          {restaurant.deliveryLocations && restaurant.deliveryLocations.length > 0 && (
            <View style={styles.deliverySection}>
              <Typography variant="h6" color="text" style={styles.sectionTitle}>Delivery Areas</Typography>
              <View style={styles.deliveryGrid}>
                {restaurant.deliveryLocations.map((location, index) => (
                  <View key={index} style={[styles.deliveryItem, { backgroundColor: theme.colors.surface }]}>
                    <Typography variant="body2" color="text" style={styles.deliveryCity}>
                      {location.cityName}
                    </Typography>
                    <Typography variant="caption" color="secondary" style={styles.deliveryPincode}>
                      {location.pincodeName} ({location.pincodeCode})
                    </Typography>
                    <Typography variant="caption" color={location.isDeliverable ? "success" : "error"} style={styles.deliveryStatus}>
                      {location.isDeliverable ? '✓ Available' : '✗ Not Available'}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Typography variant="h6" color="text" style={styles.menuTitle}>Menu</Typography>
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={renderCategory}
            ListEmptyComponent={
              <Typography variant="body2" color="secondary" style={{ textAlign: 'center', padding: SPACING.content.large }}>
                No menu items available.
              </Typography>
            }
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    position: 'relative',
    height: 200,
    marginBottom: SPACING.section.medium,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDERS.radius.large,
  },
  bannerPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoOverlay: {
    position: 'absolute',
    bottom: -30,
    left: 16, // Fixed position from left edge instead of SPACING.screen
    borderRadius: BORDERS.radius.round,
    padding: SPACING.content.small,
    ...SHADOWS.large,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: BORDERS.radius.large,
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoSection: {
    // Removed paddingHorizontal for edge-to-edge layout
    marginBottom: SPACING.section.medium,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.content.small,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.content.medium,
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: SPACING.content.small,
  },
  reviewCount: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.section.medium,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.section.medium,
  },
  detailItem: {
    width: '48%',
    padding: SPACING.content.medium,
    borderRadius: BORDERS.radius.medium,
    marginBottom: SPACING.content.medium,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: SPACING.content.small,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  gallerySection: {
    marginBottom: SPACING.section.medium,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: BORDERS.radius.medium,
    // Removed marginRight for edge-to-edge layout
  },
  menuSection: {
    // Removed paddingHorizontal for edge-to-edge layout
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: SPACING.content.large,
    paddingHorizontal: 5, // 5px horizontal padding for menu names only
  },
  section: {
    marginBottom: SPACING.section.medium,
    // Removed paddingHorizontal for edge-to-edge layout
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.content.medium,
    paddingHorizontal: 5, // 5px horizontal padding for section titles only
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.content.medium,
  },
  seeAllButton: {
    paddingHorizontal: SPACING.content.small,
    paddingVertical: SPACING.content.small,
    borderRadius: BORDERS.radius.medium,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hoursSection: {
    marginBottom: SPACING.section.medium,
    // Removed paddingHorizontal for edge-to-edge layout
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hourItem: {
    width: '48%',
    padding: SPACING.content.medium,
    borderRadius: BORDERS.radius.medium,
    marginBottom: SPACING.content.small,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: SPACING.content.small,
  },
  hourValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  deliverySection: {
    marginBottom: SPACING.section.medium,
    // Removed paddingHorizontal for edge-to-edge layout
  },
  deliveryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deliveryItem: {
    width: '48%',
    padding: SPACING.content.medium,
    borderRadius: BORDERS.radius.medium,
    marginBottom: SPACING.content.small,
  },
  deliveryCity: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.content.small,
  },
  deliveryPincode: {
    fontSize: 12,
    marginBottom: SPACING.content.small,
  },
  deliveryStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default RestaurantDetailsScreen;
