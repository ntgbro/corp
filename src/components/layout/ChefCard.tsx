import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface ChefData {
  id: string;
  name: string;
  image?: string;
  rating: number;
  reviewCount: number;
  specialty?: string;
  isAvailable: boolean;
  distance?: number;
  cuisineType?: string;
}

interface ChefCardProps {
  chef: ChefData;
  onPress?: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  showRating?: boolean;
  showDistance?: boolean;
}

export const ChefCard: React.FC<ChefCardProps> = ({
  chef,
  onPress,
  style,
  size = 'medium',
  showRating = true,
  showDistance = false,
}) => {
  const theme = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 140,
          height: 160,
          imageSize: 60,
          titleSize: 14,
          subtitleSize: 12,
        };
      case 'large':
        return {
          width: 200,
          height: 220,
          imageSize: 80,
          titleSize: 18,
          subtitleSize: 14,
        };
      default: // medium
        return {
          width: 160,
          height: 180,
          imageSize: 70,
          titleSize: 16,
          subtitleSize: 13,
        };
    }
  };

  const sizeStyles = getSizeStyles();

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

  const getAvailabilityColor = () => {
    return chef.isAvailable ? theme.colors.success : theme.colors.error;
  };

  const getAvailabilityText = () => {
    return chef.isAvailable ? 'Available' : 'Busy';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: sizeStyles.width,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Chef Image */}
      <View style={styles.imageContainer}>
        {chef.image ? (
          <Image
            source={{ uri: chef.image }}
            style={[
              styles.image,
              { width: sizeStyles.imageSize, height: sizeStyles.imageSize }
            ]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.image,
              styles.placeholderImage,
              {
                width: sizeStyles.imageSize,
                height: sizeStyles.imageSize,
                backgroundColor: theme.colors.border
              }
            ]}
          >
            <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
              {chef.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Availability Badge */}
        <View
          style={[
            styles.badge,
            { backgroundColor: getAvailabilityColor() }
          ]}
        >
          <Text style={[styles.badgeText, { color: theme.colors.white }]}>
            {getAvailabilityText()}
          </Text>
        </View>
      </View>

      {/* Chef Info */}
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.name,
            {
              color: theme.colors.text,
              fontSize: sizeStyles.titleSize,
            }
          ]}
          numberOfLines={1}
        >
          {chef.name}
        </Text>

        {chef.specialty && (
          <Text
            style={[
              styles.specialty,
              {
                color: theme.colors.textSecondary,
                fontSize: sizeStyles.subtitleSize,
              }
            ]}
            numberOfLines={1}
          >
            {chef.specialty}
          </Text>
        )}

        {chef.cuisineType && (
          <Text
            style={[
              styles.cuisine,
              {
                color: theme.colors.primary,
                fontSize: sizeStyles.subtitleSize - 1,
              }
            ]}
          >
            {chef.cuisineType}
          </Text>
        )}

        {/* Rating and Distance Row */}
        <View style={styles.bottomRow}>
          {showRating && (
            <View style={styles.ratingContainer}>
              <Text style={[styles.stars, { color: '#FFD700' }]}>
                {renderStars(chef.rating)}
              </Text>
              <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                ({chef.reviewCount})
              </Text>
            </View>
          )}

          {showDistance && chef.distance && (
            <View style={styles.distanceContainer}>
              <Text style={[styles.distanceText, { color: theme.colors.textSecondary }]}>
                {chef.distance}km
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 16,
  },
  image: {
    borderRadius: 35,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '600',
    marginBottom: 4,
  },
  specialty: {
    marginBottom: 2,
  },
  cuisine: {
    fontWeight: '500',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ChefCard;
