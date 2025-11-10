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
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaWrapper } from '../../../components/layout';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useCart } from '../../../contexts/CartContext';
import Typography from '../../../components/common/Typography';
import FavoriteButton from '../../../components/common/FavoriteButton';
import { useProductsByCategory } from '../hooks/useProducts';
import { ProductData } from '../../../services/firebase/firestore/productService';
import { HomeService } from '../../home/services/homeService';
import { PRODUCT_CARD_DIMENSIONS } from '../../../components/layout/ProductCardStyles';
import { SPACING, BORDERS, SHADOWS } from '../../../constants/ui';
import { RootState } from '../../../store';
import { useWishlist } from '../../home/hooks/useWishlist';

interface RouteParams {
  category: string;
  service?: 'fresh' | 'fmcg' | 'supplies';
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

// For warehouse products
interface WarehouseGroup {
  warehouseId: string;
  warehouseName: string;
  logoURL?: string;
  products: ProductData[];
  warehouse?: any; // Enhanced warehouse data
}

const ProductsPage: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const { category, service = 'fresh' } = route.params as RouteParams;
  const { theme } = useThemeContext();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  console.log('[NAVIGATION] ProductsPage rendered with params:', route.params);

  // Get all products for this category from all restaurants/warehouses
  const { products, loading, error } = useProductsByCategory(service, category, 100);

  const handleProductPress = (product: any) => {
    console.log('[NAVIGATION] Product pressed:', product);
    (navigation as any).navigate('Product', { screen: 'ProductDetails', params: { menuItemId: product.id } });
  };

  const handleSeeAllPress = (entityId: string, entityName: string) => {
    console.log('[NAVIGATION] See all pressed for entity:', { entityId, entityName, service });
    (navigation as any).navigate('Product', {
      screen: 'Products',
      params: { 
        [service === 'fresh' ? 'restaurantId' : 'warehouseId']: entityId, 
        category,
        service
      }
    });
  };

  // Group products by restaurant/warehouse and fetch entity data
  const [entityGroups, setEntityGroups] = React.useState<(RestaurantGroup | WarehouseGroup)[]>([]);

  React.useEffect(() => {
    const fetchEntityGroups = async () => {
      if (products.length === 0) return;

      const entityMap = new Map<string, ProductData[]>();

      products.forEach(product => {
        // For fresh service, group by restaurant; for fmcg/supplies, group by warehouse
        const entityId = service === 'fresh' 
          ? (product.restaurantId || 'unknown')
          : (product.warehouseId || 'unknown');
          
        if (!entityMap.has(entityId)) {
          entityMap.set(entityId, []);
        }
        entityMap.get(entityId)!.push(product);
      });

      // Fetch entity data for each entity
      const groups: (RestaurantGroup | WarehouseGroup)[] = [];

      for (const [entityId, products] of entityMap) {
        const sortedProducts = products
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5);

        if (sortedProducts.length > 0) {
          try {
            let entityData, entityName;
            
            if (service === 'fresh') {
              // For fresh service, fetch restaurant data
              entityData = await HomeService.getRestaurantById(entityId);
              entityName = entityData?.name || `Restaurant ${entityId.slice(0, 8)}`;
              
              groups.push({
                restaurantId: entityId,
                restaurantName: entityName,
                logoURL: entityData?.logoURL,
                restaurant: entityData,
                products: sortedProducts,
              } as RestaurantGroup);
            } else {
              // For fmcg/supplies, we would fetch warehouse data
              // For now, we'll use a placeholder since we don't have a warehouse service
              entityName = `Warehouse ${entityId.slice(0, 8)}`;
              
              groups.push({
                warehouseId: entityId,
                warehouseName: entityName,
                products: sortedProducts,
              } as WarehouseGroup);
            }
          } catch (error) {
            console.error('Error fetching entity data:', error);
            // Fallback without entity data
            if (service === 'fresh') {
              groups.push({
                restaurantId: entityId,
                restaurantName: `Restaurant ${entityId.slice(0, 8)}`,
                products: sortedProducts,
              } as RestaurantGroup);
            } else {
              groups.push({
                warehouseId: entityId,
                warehouseName: `Warehouse ${entityId.slice(0, 8)}`,
                products: sortedProducts,
              } as WarehouseGroup);
            }
          }
        }
      }

      setEntityGroups(groups);
    };

    fetchEntityGroups();
  }, [products, category, service]);

  if (loading) {
    console.log('[NAVIGATION] ProductsPage loading');
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Typography variant="body2" color="secondary" style={{ marginTop: 10 }}>
          Loading {category} {service === 'fresh' ? 'restaurants' : 'warehouses'}...
        </Typography>
      </SafeAreaWrapper>
    );
  }

  if (error) {
    console.log('[NAVIGATION] ProductsPage error:', error);
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="error">
          Error loading {service === 'fresh' ? 'restaurants' : 'warehouses'}: {error}
        </Typography>
      </SafeAreaWrapper>
    );
  }

  const renderEntityGroup = ({ item }: { item: RestaurantGroup | WarehouseGroup }) => {
    const isRestaurant = 'restaurantId' in item;
    const entityId = isRestaurant ? item.restaurantId : (item as WarehouseGroup).warehouseId;
    const entityName = isRestaurant ? item.restaurantName : (item as WarehouseGroup).warehouseName;
    const entityData = isRestaurant ? item.restaurant : (item as WarehouseGroup).warehouse;
    const logoURL = isRestaurant ? item.logoURL : undefined;

    return (
      <View style={styles.restaurantSection}>
        {/* Entity Header */}
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <View style={styles.logoContainer}>
              {logoURL ? (
                <Image
                  source={{ uri: logoURL }}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              ) : (
                <Typography variant="body1" color="primary">
                  {isRestaurant ? '🏪' : '📦'}
                </Typography>
              )}
            </View>
            <Typography variant="h6" color="text" style={{ flex: 1 }}>
              {entityName}
            </Typography>
          </View>
          <TouchableOpacity
            style={[styles.seeAllButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleSeeAllPress(entityId, entityName)}
          >
            <Typography variant="body2" color="primary">
              See All
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Entity Info Row */}
        {isRestaurant && entityData && (
          <View style={styles.restaurantInfoRow}>
            <Typography variant="caption" color="secondary">
              ⭐ {entityData?.avgRating || 'N/A'} • {entityData?.totalRatings || 0} reviews
            </Typography>
            {entityData?.avgDeliveryTime && (
              <Typography variant="caption" color="secondary">
                🚚 {entityData.avgDeliveryTime}
              </Typography>
            )}
            {entityData?.deliveryCharges !== undefined && (
              <Typography variant="caption" color="secondary">
                💰 ₹{entityData.deliveryCharges} delivery
              </Typography>
            )}
          </View>
        )}

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
                <FavoriteButton 
                  isFavorited={isInWishlist(product.id)}
                  onPress={async () => {
                    try {
                      if (isInWishlist(product.id)) {
                        await removeFromWishlist(product.id);
                      } else {
                        await addToWishlist(product.id, {
                          name: product.name,
                          price: product.price,
                          imageURL: product.imageURL || '',
                        });
                      }
                    } catch (error) {
                      console.error('Error toggling wishlist item:', error);
                    }
                  }}
                  size={20}
                  style={styles.favoriteButton}
                />
              </View>
              <View style={styles.productInfo}>
                <Typography
                  variant="body2"
                  color="text"
                  style={styles.productName}
                >
                  {product.name}
                </Typography>
                <View style={styles.priceAndButtonContainer}>
                  <Typography
                    variant="body2"
                    color="primary"
                    style={styles.productPrice}
                  >
                    ₹{product.price}
                  </Typography>
                  <TouchableOpacity style={styles.addButton}>
                    <Typography style={styles.addButtonText}>+</Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  console.log('[NAVIGATION] ProductsPage rendering content');
  
  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <FlatList
        data={entityGroups}
        keyExtractor={(group) => 'restaurantId' in group ? group.restaurantId : group.warehouseId}
        renderItem={renderEntityGroup}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: SPACING.screen }} // ✅ Proper screen edge padding
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body1" color="secondary">
              No {service === 'fresh' ? 'restaurants' : 'warehouses'} found for {category}
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
    // Removed duplicate paddingHorizontal to avoid double padding
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
    // Removed paddingHorizontal to avoid double padding with main FlatList
  },
  productCardContainer: {
    width: PRODUCT_CARD_DIMENSIONS.HORIZONTAL.width, // Explicitly set the width
    marginHorizontal: SPACING.card.horizontal, // ✅ Using standard card horizontal spacing
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    alignItems: 'flex-start',
    width: '100%',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'left',
    lineHeight: 16,
    marginBottom: SPACING.content.small,
    color: '#333',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#007AFF',
  },
  priceAndButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 24, // Increased significantly for a more rounded, pill-like appearance
    paddingHorizontal: SPACING.content.large,
    paddingVertical: SPACING.content.small,
    minWidth: 40,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.section.large,
  },
});

export default ProductsPage;