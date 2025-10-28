import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../components/layout';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Typography from '../../../components/common/Typography';
import { useProductsByCategory } from '../hooks/useProducts';
import { ProductData } from '../../../services/firebase/firestore/productService';
import { HomeService } from '../../home/services/homeService';
import { PRODUCT_CARD_DIMENSIONS } from '../../../components/layout/ProductCardStyles';
import { SPACING, BORDERS, SHADOWS } from '../../../constants/ui';

interface RouteParams {
  category: string;
  restaurantId?: string;
  restaurantName?: string;
}

interface RestaurantGroup {
  restaurantId: string;
  restaurantName: string;
  logoURL?: string;
  products: ProductData[];
  restaurant?: any; // Enhanced restaurant data
}

const ProductsPage: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params as RouteParams;
  const { theme } = useThemeContext();

  // Get all products for this category from all restaurants
  const { products, loading, error } = useProductsByCategory('fresh', category, 100);

  const handleProductPress = (product: any) => {
    (navigation as any).navigate('ProductDetails', { menuItemId: product.id });
  };

  const handleSeeAllPress = (restaurantId: string, restaurantName: string) => {
    (navigation as any).navigate('Product', {
      screen: 'Products',
      params: { restaurantId, category }
    });
  };

  // Group products by restaurant and fetch restaurant data
  const [restaurantGroups, setRestaurantGroups] = React.useState<RestaurantGroup[]>([]);

  React.useEffect(() => {
    const fetchRestaurantGroups = async () => {
      if (products.length === 0) return;

      const restaurantMap = new Map<string, ProductData[]>();

      products.forEach(product => {
        const restaurantId = product.restaurantId || 'unknown';
        if (!restaurantMap.has(restaurantId)) {
          restaurantMap.set(restaurantId, []);
        }
        restaurantMap.get(restaurantId)!.push(product);
      });

      // Fetch restaurant data for each restaurant
      const groups: RestaurantGroup[] = [];

      for (const [restaurantId, products] of restaurantMap) {
        const sortedProducts = products
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5);

        if (sortedProducts.length > 0) {
          try {
            const restaurantData = await HomeService.getRestaurantById(restaurantId);
            const restaurantName = restaurantData?.name || `Restaurant ${restaurantId.slice(0, 8)}`;

            groups.push({
              restaurantId,
              restaurantName,
              logoURL: restaurantData?.logoURL,
              restaurant: restaurantData,
              products: sortedProducts,
            });
          } catch (error) {
            console.error('Error fetching restaurant data:', error);
            // Fallback without restaurant data
            groups.push({
              restaurantId,
              restaurantName: `Restaurant ${restaurantId.slice(0, 8)}`,
              products: sortedProducts,
            });
          }
        }
      }

      setRestaurantGroups(groups);
    };

    fetchRestaurantGroups();
  }, [products, category]);

  if (loading) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Typography variant="body2" color="secondary" style={{ marginTop: 10 }}>
          Loading {category} restaurants...
        </Typography>
      </SafeAreaWrapper>
    );
  }

  if (error) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="error">
          Error loading restaurants: {error}
        </Typography>
      </SafeAreaWrapper>
    );
  }

  const renderRestaurantGroup = ({ item }: { item: RestaurantGroup }) => (
    <View style={styles.restaurantSection}>
      {/* Restaurant Header */}
      <View style={styles.restaurantHeader}>
        <View style={styles.restaurantInfo}>
          <View style={styles.logoContainer}>
            {item.logoURL ? (
              <Image
                source={{ uri: item.logoURL }}
                style={styles.logoImage}
                resizeMode="cover"
              />
            ) : (
              <Typography variant="body1" color="primary">
                🏪
              </Typography>
            )}
          </View>
          <Typography variant="h6" color="text" style={{ flex: 1 }}>
            {item.restaurantName}
          </Typography>
        </View>
        <TouchableOpacity
          style={[styles.seeAllButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => handleSeeAllPress(item.restaurantId, item.restaurantName)}
        >
          <Typography variant="body2" color="primary">
            See All
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Restaurant Info Row */}
      <View style={styles.restaurantInfoRow}>
        <Typography variant="caption" color="secondary">
          ⭐ {item.restaurant?.avgRating || 'N/A'} • {item.restaurant?.totalRatings || 0} reviews
        </Typography>
        {item.restaurant?.avgDeliveryTime && (
          <Typography variant="caption" color="secondary">
            🚚 {item.restaurant.avgDeliveryTime}
          </Typography>
        )}
        {item.restaurant?.deliveryCharges !== undefined && (
          <Typography variant="caption" color="secondary">
            💰 ₹{item.restaurant.deliveryCharges} delivery
          </Typography>
        )}
      </View>

      {/* Products Horizontal List */}
      <FlatList
        data={item.products}
        keyExtractor={(product) => product.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
        renderItem={({ item: product }) => (
          <TouchableOpacity
            style={styles.productCardContainer}
            onPress={() => handleProductPress(product)}
          >
            <View style={styles.productImageContainer}>
              {product.imageURL ? (
                <Image
                  source={{ uri: product.imageURL }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <Typography style={styles.productImageEmoji}>🍽️</Typography>
              )}
            </View>
            <View style={styles.productInfo}>
              <Typography
                variant="body2"
                color="text"
                style={styles.productName}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                style={styles.productPrice}
              >
                ₹{product.price}
              </Typography>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <FlatList
        data={restaurantGroups}
        keyExtractor={(group) => group.restaurantId}
        renderItem={renderRestaurantGroup}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body1" color="secondary">
              No restaurants found for {category}
            </Typography>
          </View>
        }
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  restaurantSection: {
    marginBottom: SPACING.section.medium,
    // Removed paddingHorizontal for edge-to-edge layout
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.content.medium,
    paddingVertical: SPACING.content.small,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDERS.radius.large,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.content.medium,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  seeAllButton: {
    paddingHorizontal: SPACING.content.medium,
    paddingVertical: SPACING.content.small,
    borderRadius: BORDERS.radius.large,
  },
  restaurantInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.content.medium,
    paddingHorizontal: SPACING.content.small,
    gap: SPACING.content.medium,
  },
  productsContainer: {
    // Removed paddingHorizontal for edge-to-edge layout
  },
  productCardContainer: {
    width: PRODUCT_CARD_DIMENSIONS.HORIZONTAL.width,
    // Removed marginHorizontal for edge-to-edge layout
    alignItems: 'center',
    borderWidth: BORDERS.width.medium,
    borderRadius: PRODUCT_CARD_DIMENSIONS.HORIZONTAL.borderRadius,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    ...SHADOWS.medium,
    paddingBottom: SPACING.content.small,
  },
  productImageContainer: {
    width: PRODUCT_CARD_DIMENSIONS.HORIZONTAL.imageWidth,
    height: PRODUCT_CARD_DIMENSIONS.HORIZONTAL.imageHeight,
    backgroundColor: '#f0f0f0',
    marginBottom: SPACING.content.small,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImageEmoji: {
    fontSize: 24,
  },
  productInfo: {
    padding: PRODUCT_CARD_DIMENSIONS.HORIZONTAL.padding,
    alignItems: 'center',
    width: '100%',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: SPACING.content.small,
    color: '#333',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.section.large,
  },
});

export default ProductsPage;
