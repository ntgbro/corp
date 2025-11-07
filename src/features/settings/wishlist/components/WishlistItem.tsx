import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { WishlistButton } from './WishlistButton';

interface WishlistItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export const WishlistItem: React.FC<WishlistItemProps> = ({
  id,
  name,
  price,
  image,
  onRemove,
  onAddToCart,
}) => {
  const { theme } = useThemeContext();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 16 - 8) / 2; // Increased from (screenWidth - 32 - 12) / 2

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FBF5EB', borderColor: theme.colors.border, width: cardWidth }]}>
      {/* Favorite Icon at top-right */}
      <TouchableOpacity style={styles.favoriteButton} onPress={() => onRemove(id)}>
        <Text style={styles.favoriteIcon}>❤️</Text>
      </TouchableOpacity>
      
      {/* Product Image at top */}
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Product Name below image */}
      <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
        {name}
      </Text>
      
      {/* Spacer to push price and button to the bottom */}
      <View style={styles.spacer} />
      
      {/* Price and Add to Cart Button at the bottom */}
      <View style={styles.bottomRow}>
        <Text style={[styles.price, { color: theme.colors.primary }]}>{formatPrice(price)}</Text>
        <WishlistButton
          title="Add to Cart"
          onPress={() => onAddToCart(id)}
          size="small"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    margin: 4, // Decreased from 6 to 4
    position: 'relative',
    flexDirection: 'column',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12, // Adjusted to match padding
    right: 12, // Adjusted to match padding
    zIndex: 1,
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 12, // Keep some space below image
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12, // Keep some space below name
  },
  spacer: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default WishlistItem;