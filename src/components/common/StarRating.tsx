import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  showValue?: boolean;
  style?: ViewStyle;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRatingChange,
  size = 'medium',
  readonly = false,
  showValue = false,
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    const sizes = {
      small: 16,
      medium: 20,
      large: 24,
    };
    return sizes[size];
  };

  const handleStarPress = (starRating: number) => {
    if (readonly || !onRatingChange) return;
    onRatingChange(starRating);
  };

  const renderStar = (starPosition: number) => {
    const filled = starPosition <= rating;
    const starSize = getSize();

    return (
      <TouchableOpacity
        key={starPosition}
        onPress={() => handleStarPress(starPosition)}
        disabled={readonly}
        style={styles.starContainer}
      >
        <Text
          style={[
            styles.star,
            {
              fontSize: starSize,
              color: filled ? theme.colors.warning : theme.colors.border,
            },
          ]}
        >
          ★
        </Text>
      </TouchableOpacity>
    );
  };

  const stars = Array.from({ length: maxRating }, (_, index) => index + 1);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {stars.map(renderStar)}
      </View>

      {showValue && (
        <Text style={[styles.ratingValue, { color: theme.colors.text }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    padding: 2,
  },
  star: {
    textAlign: 'center',
  },
  ratingValue: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StarRating;
