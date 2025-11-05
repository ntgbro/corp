import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
          {name}
        </Text>
        <Text style={[styles.price, { color: theme.colors.primary }]}>{formatPrice(price)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => onRemove(id)}
        >
          <Text style={[styles.actionText, { color: theme.colors.white }]}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => onAddToCart(id)}
        >
          <Text style={[styles.actionText, { color: theme.colors.white }]}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  actionButton: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default WishlistItem;