import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { MenuItem } from '../../../types/firestore';
import AddToCartButton from '../../../components/common/AddToCartButton';
import { useCart } from '../../../contexts/CartContext';
import { CARD_DIMENSIONS, SPACING, BORDERS, SHADOWS } from '../../../constants/ui';
import FavoriteButton from '../../../components/common/FavoriteButton';
import { useWishlist } from '../hooks/useWishlist';

interface MenuItemCardProps {
  menuItem: MenuItem;
  onPress: () => void;
  onAddToCart?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem, onPress, onAddToCart }) => {
  const { theme } = useThemeContext();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Check if menu item is in wishlist
  const isFavorited = isInWishlist(menuItem.menuItemId);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeFromWishlist(menuItem.menuItemId);
      } else {
        await addToWishlist(menuItem.menuItemId, {
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.mainImageURL || menuItem.imageURL || '',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = () => {
    // Add item to cart using cart context
    addToCart({
      id: menuItem.menuItemId,
      productId: menuItem.menuItemId,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.mainImageURL || menuItem.imageURL || 'https://via.placeholder.com/150',
      chefId: menuItem.restaurantId || '',
      chefName: 'Restaurant',
    });

    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]}
    >
      <View style={styles.imageContainer}>
        {menuItem.mainImageURL || menuItem.imageURL ? (
          <Image
            source={{ uri: menuItem.mainImageURL || menuItem.imageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={{ fontSize: 20, color: theme.colors.textSecondary }}>🍽️</Text>
          </View>
        )}
        <FavoriteButton
          isFavorited={isFavorited}
          onPress={handleToggleFavorite}
          size={20}
          style={styles.favoriteButton}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.title,
            { color: theme.colors.text }
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {menuItem.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[{ color: theme.colors.primary, fontSize: 16, fontWeight: 'bold' }]}>
            ₹{menuItem.price}
          </Text>
          <AddToCartButton onPress={handleAddToCart} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_DIMENSIONS.menuItem.width,
    height: CARD_DIMENSIONS.menuItem.height, // ✅ Added fixed height
    borderRadius: CARD_DIMENSIONS.menuItem.borderRadius,
    borderWidth: BORDERS.width.medium,
    overflow: 'hidden',
    ...SHADOWS.small,
    marginHorizontal: SPACING.card.horizontal, // Added margin between cards
  },
  imageContainer: {
    width: '100%',
    height: CARD_DIMENSIONS.menuItem.imageHeight,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  infoContainer: {
    // Removed flex-based layout to prevent height variation
    height: 74, // Fixed height: cardHeight(200) - imageHeight(110) - padding(16)
    padding: CARD_DIMENSIONS.menuItem.padding,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'left',
    // Removed marginBottom to fit within fixed height container
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Removed any margins to fit within fixed height container
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default MenuItemCard;