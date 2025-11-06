import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../components/layout';
import { PRODUCT_CARD_DIMENSIONS } from '../../../components/layout/ProductCardStyles';
import { SPACING, BORDERS, SHADOWS } from '../../../constants/ui';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useProductsByCategory, useProductSearch } from '../hooks/useProducts';
import { ProductGrid } from '../../../components/layout';
import Typography from '../../../components/common/Typography';
import { useCart } from '../../../contexts/CartContext';
import { HomeService } from '../../home/services/homeService';

interface RouteParams {
  category?: string;
  restaurantId?: string;
  searchQuery?: string;
}

const ProductScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const category = (route.params as RouteParams)?.category || 'salads';
  const restaurantId = (route.params as RouteParams)?.restaurantId;
  const searchQuery = (route.params as RouteParams)?.searchQuery;
  const { theme } = useThemeContext();
  const { addToCart } = useCart();

  // Use appropriate hook based on whether we have a search query
  const { products: searchProducts, loading: searchLoading, error: searchError } = useProductSearch(searchQuery || '', 'fresh');
  const { products: categoryProducts, loading: categoryLoading, error: categoryError } = useProductsByCategory('fresh', category, restaurantId ? 100 : 50);

  // Determine which products to display based on searchQuery
  const products = searchQuery 
    ? searchProducts 
    : restaurantId
      ? categoryProducts.filter(product => product.restaurantId === restaurantId)
      : categoryProducts;

  const loading = searchQuery ? searchLoading : categoryLoading;
  const error = searchQuery ? searchError : categoryError;

  const [restaurant, setRestaurant] = React.useState<any>(null);

  React.useEffect(() => {
    if (restaurantId) {
      HomeService.getRestaurantById(restaurantId).then(setRestaurant).catch(console.error);
    }
  }, [restaurantId]);

  const handleProductPress = (product: any) => {
    (navigation as any).navigate('ProductDetails', { menuItemId: product.id });
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://via.placeholder.com/150',
      chefId: product.restaurantId || '',
      chefName: 'Restaurant',
    });
  };

  const handleRefresh = () => {
    // Refresh will be handled by the hooks
    console.log('Refreshing products...');
  };

  // Determine the header title based on parameters
  const getHeaderTitle = () => {
    if (restaurantId) {
      return `${category} - ${restaurant?.name || 'Restaurant Items'}`;
    }
    return category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Products';
  };

  if (loading) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Typography variant="body2" color="secondary" style={{ marginTop: 10 }}>
          Loading {getHeaderTitle()}...
        </Typography>
      </SafeAreaWrapper>
    );
  }

  if (error) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="error">
          Error loading products: {error}
        </Typography>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      {restaurantId && restaurant && (
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <View style={styles.logoContainer}>
              {restaurant.logoURL ? (
                <Image
                  source={{ uri: restaurant.logoURL }}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              ) : (
                <Typography variant="body1" color="primary">
                  🏪
                </Typography>
              )}
            </View>
            <View>
              <Typography variant="h6" color="text">
                {restaurant.name}
              </Typography>
              <Typography variant="body2" color="secondary">
                ⭐ {restaurant.avgRating || 'N/A'} • {restaurant.totalRatings || 0} reviews
              </Typography>
              {restaurant.avgDeliveryTime && (
                <Typography variant="caption" color="secondary">
                  🚚 {restaurant.avgDeliveryTime}
                </Typography>
              )}
              {restaurant.deliveryCharges !== undefined && (
                <Typography variant="caption" color="secondary">
                  • 💰 ₹{restaurant.deliveryCharges} delivery
                </Typography>
              )}
            </View>
          </View>
        </View>
      )}
      <ProductGrid
        products={products}
        onProductPress={handleProductPress}
        onRefresh={handleRefresh}
        refreshing={loading}
        numColumns={2}
        showRating={true}
        showCategory={false}
        emptyMessage={restaurantId
          ? `No ${category} items found for this restaurant`
          : `No ${category} products found`
        }
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.section.medium,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.content.medium,
    // Removed paddingHorizontal for edge-to-edge layout
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDERS.radius.large,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.content.medium,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});

export default ProductScreen;
