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
      backgroundColor: '#FBF5EB', // ✅ Changed background color from theme.colors.surface to #FBF5EB
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      width,
      height: 300, // ✅ Increased height from 250 to 300 for more content visibility
      justifyContent: 'space-between'
    }}>
      <Image
        source={{ uri: restaurant.logoURL || restaurant.bannerURL || 'https://via.placeholder.com/150' }}
        style={{ width: '100%', height: 160, borderRadius: 8, marginBottom: 6 }} // ✅ Decreased marginBottom from 10 to 6 to reduce padding between image and content
      />
      <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: 'bold', marginBottom: 6 }} numberOfLines={1} ellipsizeMode="tail">
        {restaurant.name}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginBottom: 8 }} numberOfLines={4} ellipsizeMode="tail">
        📍 {restaurant.address?.line1 || ''} {restaurant.address?.city || 'City'}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: 'bold' }}>
          {restaurant.priceRange || '₹₹'}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 11 }}>
          {restaurant.avgDeliveryTime || '30-45 min'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;