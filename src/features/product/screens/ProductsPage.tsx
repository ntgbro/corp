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
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const { category } = route.params as RouteParams;
  const { theme } = useThemeContext();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Get all products for this category from all restaurants
  const { products, loading, error } = useProductsByCategory('fresh', category, 100);

  const handleProductPress = (product: any) => {
    (navigation as any).navigate('Product', { screen: 'ProductDetails', params: { menuItemId: product.id } });
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
          style={[styles.seeAllButton, { backgroundColor: '#f1ede9' }]}
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
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => handleAddToCart(product)} // Add onPress handler
                >
                  <Typography style={styles.addButtonText}>+</Typography>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const handleAddToCart = (product: any) => {
    // Add item to cart using cart context
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageURL || 'https://via.placeholder.com/150',
      chefId: product.restaurantId || '',
      chefName: 'Restaurant',
    });
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <FlatList
        data={restaurantGroups}
        keyExtractor={(group) => group.restaurantId}
        renderItem={renderRestaurantGroup}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: SPACING.screen }} // ✅ Proper screen edge padding
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
    flex: 1,
    justifyContent: 'space-between',
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
    backgroundColor: '#f1ede9',
    borderRadius: 22, // Half of 44px for circular shape
    width: 44, // Fixed width
    height: 44, // Fixed height (same as width for square shape)
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20, // Increased from 16 to 20 for better visibility
    fontWeight: '600',
    color: '#754C29',
    textAlign: 'center',
    lineHeight: 24, // Adjusted to match new font size for perfect vertical centering
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.section.large,
  },
});

export default ProductsPage;