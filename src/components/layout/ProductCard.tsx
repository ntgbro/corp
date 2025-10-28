import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../config/theme';
import { useCart } from '../../contexts/CartContext';
import { ProductCardStyles, PRODUCT_CARD_DIMENSIONS } from './ProductCardStyles';
import { SPACING, BORDERS, CARD_DIMENSIONS } from '../../constants/ui';

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
}

export interface ProductCardProps {
  product: ProductData;
  onPress?: () => void;
  onAddToCart?: () => void;
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
  const theme = useTheme();
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
          width: hasCustomWidth ? style?.width : PRODUCT_CARD_DIMENSIONS.STANDARD.width,
          height: PRODUCT_CARD_DIMENSIONS.STANDARD.height,
          borderRadius: PRODUCT_CARD_DIMENSIONS.STANDARD.borderRadius,
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
    if (isAddingToCart || !product.isAvailable) return;

    setIsAddingToCart(true);

    try {
      // Create cart item matching CartContext interface
      const cartItem = {
        id: `${product.id}_${Date.now()}`, // Unique cart item ID
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        chefId: 'default-chef', // This should come from product data
        chefName: 'Default Chef', // This should come from product data
      };

      addToCart(cartItem);

      // Show brief success feedback
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

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
            ProductCardStyles.title,
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

        {/* Price */}
        <Text
          style={[
            ProductCardStyles.price,
            {
              color: theme.colors.primary,
              fontSize: fontSizes.price,
            }
          ]}
        >
          {formatPrice(product.price)}
        </Text>

        {/* Rating */}
        {showRating && product.rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Text style={[ProductCardStyles.rating, { color: '#FFD700' }]}>
              {renderStars(product.rating)}
            </Text>
            {product.reviewCount !== undefined && (
              <Text style={[ProductCardStyles.reviewCount, { color: theme.colors.textSecondary }]}>
                ({product.reviewCount})
              </Text>
            )}
          </View>
        )}

        {/* Add to Cart Button - Always visible */}
        <TouchableOpacity
          style={[
            ProductCardStyles.addToCartButton,
            {
              backgroundColor: product.isAvailable ? theme.colors.primary : theme.colors.border,
              opacity: isAddingToCart ? 0.7 : 1,
            },
          ]}
          onPress={handleAddToCart}
          disabled={isAddingToCart || !product.isAvailable}
        >
          <Text style={[ProductCardStyles.addToCartText, { color: theme.colors.white }]}>
            {isAddingToCart ? 'Adding...' : product.isAvailable ? '+' : 'Out'}
          </Text>
        </TouchableOpacity>
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Removed marginBottom to fit within fixed height container
  },
  stars: {
    fontSize: 12,
    marginRight: SPACING.content.small,
    color: '#FFD700',
  },
});

export default ProductCard;
