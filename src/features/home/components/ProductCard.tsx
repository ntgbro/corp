import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Product } from '../../../types/firestore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  width?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, width = 160 }) => {
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity onPress={onPress} style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 10,
      width,
      // Removed any horizontal margins for edge-to-edge layout
    }}>
      <Image source={{ uri: product.imageURL }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: 'bold' }}>{product.name}</Text>
      <Text style={{ color: theme.colors.textSecondary }}>{product.description}</Text>
      <Text style={{ color: theme.colors.primary }}>${product.price}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;
