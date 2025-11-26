import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import ProductCardStyles, { PRODUCT_CARD_DIMENSIONS } from './ProductCardStyles';
import { SPACING, BORDERS, CARD_DIMENSIONS, SHADOWS } from '../../constants/ui';
import FavoriteButton from '../../components/common/FavoriteButton';
import { useDispatch, useSelector } from 'react-redux';
import { toggleProductFavorite } from '../../store/slices/productsSlice';
import { RootState } from '../../store';
import { useWishlist } from '../../features/home/hooks/useWishlist';

export interface ProductData {
  id: string;
  name: string;
  price: number;
  image?: string;
  imageURL?: string;
  rating?: number;
  reviewCount?: number;
  isAvailable?: boolean;
  category?: string;
  description?: string;
  restaurantId?: string;
  warehouseId?: string;
}

export interface ProductCardProps {
  product: ProductData;
  onPress?: () => void;
  onAddToCart?: (product: ProductData) => void;
  size?: 'small' | 'medium' | 'large';
  style?: any;
  showRating?: boolean;
  showCategory?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  style,
  showRating = true,
  showCategory = false,
  size = 'medium',
}) => {
  const { theme } = useThemeContext();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Check if product is in wishlist
  const isFavorited = isInWishlist(product.id);

  const Container = onPress ? TouchableOpacity : View;

  const getSizeStyles = () => {
    // Check if width is provided via style prop (from FlatList grid)
    const hasCustomWidth = style?.width !== undefined;

    switch (size) {
      case 'small':
        return {
          width: hasCustomWidth ? style?.width : CARD_DIMENSIONS.menuItem.width,
          height: CARD_DIMENSIONS.menuItem.height,
          borderRadius: CARD_DIMENSIONS.menuItem.borderRadius,
        } as const;
      case 'large':
        return {
          width: hasCustomWidth ? style?.width : '100%',
          height: 280,
          borderRadius: BORDERS.radius.large,
        } as const;
      default: // medium - standard product card
        return {
          width: hasCustomWidth ? style?.width : PRODUCT_CARD_DIMENSIONS.VERTICAL.width,
          height: 200, // Fixed height for consistency
          borderRadius: PRODUCT_CARD_DIMENSIONS.VERTICAL.borderRadius,
        } as const;
    }
  };

  const getFontSizes = () => {
    switch (size) {
      case 'small':
        return {
          title: 11,
          price: 13,
          rating: 10,
        };
      case 'large':
        return {
          title: 16,
          price: 18,
          rating: 12,
        };
      default: // medium
        return {
          title: 13,
          price: 15,
          rating: 11,
        };
    }
  };

  const fontSizes = getFontSizes();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }

    if (hasHalfStar) {
      stars.push('☆');
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push('☆');
    }

    return stars.join('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleAddToCart = async () => {
    // Use the passed onAddToCart function if provided, otherwise use the local implementation
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }
    
    if (isAddingToCart || !product.isAvailable) return;

    setIsAddingToCart(true);

    try {
      // Create cart item matching CartContext interface
      const cartItem = {
        id: product.id, // Use product ID directly for proper quantity management
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.imageURL || '',
        chefId: product.restaurantId || product.warehouseId || 'default-chef',
        chefName: product.restaurantId ? 'Restaurant' : (product.warehouseId ? 'Warehouse' : 'Default Chef'),
        // Set serviceId based on product type
        serviceId: product.restaurantId ? 'fresh' : 'fmcg', // Default service IDs
        // Set warehouseId specifically for warehouse products
        warehouseId: product.warehouseId || '',
        // Set restaurantId specifically for restaurant products
        restaurantId: product.restaurantId || '',
      };

      await addToCart(cartItem);

      // Show brief success feedback
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      if (isFavorited) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id, {
          name: product.name,
          price: product.price,
          image: product.image || product.imageURL || '',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Debug log to see what product data is being passed
  React.useEffect(() => {
    // console.log('ProductCard: received product data', {
    //   productId: product.id,
    //   productName: product.name,
    //   isAvailable: product.isAvailable,
    //   hasImage: !!(product.image || product.imageURL),
    //   onAddToCart: !!onAddToCart
    // });
  }, [product, onAddToCart]);

  return (
    <Container
      onPress={onPress}
      style={[
        ProductCardStyles.cardContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...getSizeStyles(),
        },
        style,
      ]}
    >
      {/* Product Image */}
      <View style={ProductCardStyles.imageContainer}>
        {product.image || product.imageURL ? (
          <Image
            source={{ uri: product.image || product.imageURL }}
            style={ProductCardStyles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[ProductCardStyles.image, styles.placeholderImage]}>
            <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
              📷
            </Text>
          </View>
        )}
        <FavoriteButton
          isFavorited={isFavorited}
          onPress={handleToggleFavorite}
          size={20}
          style={styles.favoriteButton}
        />
        {/* Availability Badge */}
        {!product.isAvailable && (
          <View style={[styles.badge, styles.unavailableBadge, { backgroundColor: theme.colors.error }]}>
            <Text style={[styles.badgeText, { color: theme.colors.white }]}>
              Out of Stock
            </Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={ProductCardStyles.infoContainer}>
        {/* Product Name */}
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              fontSize: fontSizes.title,
            }
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>
        
        {/* Price, Rating, and Add to Cart Section */}
        <View style={styles.bottomSection}>
          <View style={styles.priceRatingContainer}>
            <View style={styles.priceContainer}>
              {/* Price - Blue color */}
              <Text
                style={[
                  styles.price,
                  {
                    color: '#3b82f6', // Blue color as requested
                    fontSize: fontSizes.price,
                  }
                ]}
              >
                {formatPrice(product.price)}
              </Text>
            </View>
            
            {/* Rating */}
            {showRating && product.rating !== undefined && (
              <View style={styles.ratingContainer}>
                <Text style={[styles.rating, { color: '#FFD700' }]}>
                  {renderStars(product.rating)}
                </Text>
                {product.reviewCount !== undefined && (
                  <Text style={[styles.reviewCount, { color: theme.colors.textSecondary }]}>
                    ({product.reviewCount})
                  </Text>
                )}
              </View>
            )}
          </View>
          
          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: '#f1ede9' }]}
            onPress={handleAddToCart}
            disabled={isAddingToCart || !product.isAvailable}
          >
            <Text style={[ProductCardStyles.addToCartText, { color: '#754C29' }]}>
              {isAddingToCart ? '...' : product.isAvailable ? '+' : 'Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#999',
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
  badge: {
    position: 'absolute',
    top: SPACING.content.small,
    right: SPACING.content.small,
    paddingHorizontal: SPACING.content.small,
    paddingVertical: 4,
    borderRadius: BORDERS.radius.small,
  },
  unavailableBadge: {
    backgroundColor: '#FF3B30',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  infoContainer: {
    padding: PRODUCT_CARD_DIMENSIONS.VERTICAL.padding,
    justifyContent: 'flex-start',
    height: 100, // Adjusted for 100px image height (200 card height - 100 image height - 16 padding * 2)
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
    color: '#333',
    // Removed fixed height to allow flexible sizing
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3b82f6', // Blue color as requested
    // Removed marginBottom to fit within fixed height container
  },
  rating: {
    fontSize: 22, // Further increased from 20 to 22 for better visibility
    color: '#FFD700',
    marginRight: SPACING.content.small,
  },
  reviewCount: {
    fontSize: 18, // Further increased from 16 to 18 for better visibility
    color: '#666',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Push to the end of the container
  },
  priceRatingContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1, // Allow it to take available space
  },
  priceContainer: {
    marginBottom: 0, // Removed padding between price and rating
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  stars: {
    fontSize: 12,
    marginRight: SPACING.content.small,
    color: '#FFD700',
  },
  addToCartButton: {
    width: 45, // Increased from 40 to 45 for better visibility
    height: 45, // Increased from 40 to 45 for better visibility
    borderRadius: 22.5, // Increased from 20 to 22.5 to maintain round shape (half of height/width)
    backgroundColor: '#f1ede9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ProductCard;