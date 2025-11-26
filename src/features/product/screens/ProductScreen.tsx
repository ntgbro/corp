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
import { useProductsByCategory, useProductSearch, useProductsByRestaurantAndCategory } from '../hooks/useProducts';
import { ProductGrid } from '../../../components/layout';
import Typography from '../../../components/common/Typography';
import { useCart } from '../../../contexts/CartContext';
import { HomeService } from '../../home/services/homeService';

interface RouteParams {
  category?: string;
  restaurantId?: string;
  warehouseId?: string;
  service?: 'fresh' | 'fmcg' | 'supplies';
  searchQuery?: string;
}

const ProductScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const category = (route.params as RouteParams)?.category || 'salads';
  const restaurantId = (route.params as RouteParams)?.restaurantId;
  const warehouseId = (route.params as RouteParams)?.warehouseId;
  const service = (route.params as RouteParams)?.service || 'fresh';
  const searchQuery = (route.params as RouteParams)?.searchQuery;
  const { theme } = useThemeContext();
  const { addToCart } = useCart();
  
  // console.log('[NAVIGATION] ProductScreen rendered with params:', route.params);

  // Use appropriate hook based on whether we have a search query
  const { products: searchProducts, loading: searchLoading, error: searchError } = useProductSearch(searchQuery || '', service);
  
  // Use the new hook when we have both restaurantId and category
  const { products: restaurantProducts, loading: restaurantLoading, error: restaurantError } = useProductsByRestaurantAndCategory(restaurantId || '', category, 50);
  
  // Use the existing hook for category-based fetching (when no restaurantId)
  const { products: categoryProducts, loading: categoryLoading, error: categoryError } = useProductsByCategory(service, category, restaurantId || warehouseId ? 100 : 50);

  // Determine which products to display based on searchQuery and entityId
  const products = searchQuery 
    ? searchProducts 
    : (restaurantId || warehouseId)
      ? (restaurantId 
          ? restaurantProducts  // Use restaurant-specific products when restaurantId is provided
          : categoryProducts.filter(product => 
              (restaurantId && product.restaurantId === restaurantId) || 
              (warehouseId && product.warehouseId === warehouseId)
            ))
      : categoryProducts;

  const loading = searchQuery ? searchLoading : 
    (restaurantId ? restaurantLoading : 
      (warehouseId ? categoryLoading : categoryLoading));
      
  const error = searchQuery ? searchError : 
    (restaurantId ? restaurantError : 
      (warehouseId ? categoryError : categoryError));

  const [entity, setEntity] = React.useState<any>(null);

  React.useEffect(() => {
    if (restaurantId) {
      HomeService.getRestaurantById(restaurantId).then(setEntity).catch(console.error);
    }
    // For warehouseId, we would need a similar service call
  }, [restaurantId, warehouseId]);

  const handleProductPress = (product: any) => {
    (navigation as any).navigate('Product', { screen: 'ProductDetails', params: { menuItemId: product.id } });
  };

  const handleAddToCart = async (product: any) => {
    await addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://via.placeholder.com/150',
      chefId: product.restaurantId || product.warehouseId || '',
      chefName: restaurantId ? 'Restaurant' : (warehouseId ? 'Warehouse' : 'Provider'),
      // Set serviceId based on product type
      serviceId: service || (restaurantId ? 'fresh' : 'fmcg'), // Use provided service or default based on entity type
      // Set warehouseId specifically for warehouse products
      warehouseId: product.warehouseId || '',
      // Set restaurantId specifically for restaurant products
      restaurantId: product.restaurantId || '',
    });
  };

  const handleRefresh = () => {
    // Refresh will be handled by the hooks
  };

  // Determine the header title based on parameters
  const getHeaderTitle = () => {
    if (restaurantId || warehouseId) {
      const entityName = entity?.name || (restaurantId ? 'Restaurant' : 'Warehouse') + ' Items';
      return `${category} - ${entityName}`;
    }
    return category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Products';
  };

  // Get entity type for display
  const getEntityType = () => {
    if (service === 'fresh') return 'Restaurant';
    return 'Warehouse';
  };

  if (loading) {
    // console.log('[NAVIGATION] ProductScreen loading');
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
    // console.log('[NAVIGATION] ProductScreen error:', error);
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="error">
          Error loading products: {error}
        </Typography>
      </SafeAreaWrapper>
    );
  }

  // console.log('[NAVIGATION] ProductScreen rendering content with products:', products.length);
  
  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      {/* Only show restaurant/warehouse header when we have a specific entity ID and we're not coming from categories screen */}
      {(restaurantId || warehouseId) && entity && !searchQuery && (
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <View style={styles.logoContainer}>
              {entity.logoURL ? (
                <Image
                  source={{ uri: entity.logoURL }}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              ) : (
                <Typography variant="body1" color="primary">
                  {restaurantId ? '🏪' : '📦'}
                </Typography>
              )}
            </View>
            <View>
              <Typography variant="h6" color="text">
                {entity.name}
              </Typography>
              {restaurantId && (
                <>
                  <Typography variant="body2" color="secondary">
                    ⭐ {entity.avgRating || 'N/A'} • {entity.totalRatings || 0} reviews
                  </Typography>
                  {entity.avgDeliveryTime && (
                    <Typography variant="caption" color="secondary">
                      🚚 {entity.avgDeliveryTime}
                    </Typography>
                  )}
                  {entity.deliveryCharges !== undefined && (
                    <Typography variant="caption" color="secondary">
                      • 💰 ₹{entity.deliveryCharges} delivery
                    </Typography>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      )}
      <ProductGrid
        products={products}
        onProductPress={handleProductPress}
        onAddToCart={handleAddToCart}
        onRefresh={handleRefresh}
        refreshing={loading}
        numColumns={2}
        showRating={true}
        showCategory={false}
        emptyMessage={(restaurantId || warehouseId)
          ? `No ${category} items found for this ${getEntityType().toLowerCase()}`
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