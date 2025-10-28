import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Restaurant } from '../../../types/firestore';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  width?: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress, width = 160 }) => {
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity onPress={onPress} style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      width,
      height: 170, // ✅ Added fixed height for consistent grid alignment
      justifyContent: 'space-between'
    }}>
      <Image
        source={{ uri: restaurant.logoURL || restaurant.bannerURL || 'https://via.placeholder.com/150' }}
        style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 8 }}
      />
      <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: 'bold', marginBottom: 4 }} numberOfLines={1} ellipsizeMode="tail">
        {restaurant.name}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: 11, marginBottom: 4 }}>
        ⭐ {restaurant.avgRating || 'N/A'}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: 11, marginBottom: 8 }} numberOfLines={1} ellipsizeMode="tail">
        📍 {restaurant.address?.city || 'City'}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.primary, fontSize: 11, fontWeight: 'bold' }}>
          {restaurant.priceRange || '₹₹'}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 10 }}>
          {restaurant.avgDeliveryTime || '30-45 min'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
