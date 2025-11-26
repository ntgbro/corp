import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Product } from '../../../types/firestore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  width?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, width = 160 }) => {
  const { theme } = useThemeContext();
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <TouchableOpacity onPress={onPress} style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 10,
      width,
      // Removed any horizontal margins for edge-to-edge layout
    }}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageURL }} style={styles.image} />
        <TouchableOpacity 
          style={styles.heartIconContainer}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        />
      </View>
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: 'bold' }}>{product.name}</Text>
      <Text style={{ color: theme.colors.textSecondary }}>{product.description}</Text>
      <Text style={{ color: theme.colors.primary }}>${product.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});

export default ProductCard;