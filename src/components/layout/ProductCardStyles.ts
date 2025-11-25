import { StyleSheet } from 'react-native';
import { SPACING, BORDERS, SHADOWS, CARD_DIMENSIONS } from '../../constants/ui';

// Product Card Dimensions Configuration
export const PRODUCT_CARD_DIMENSIONS = {
  // Vertical list dimensions (standard grid)
  VERTICAL: {
    width: 160,
    imageWidth: 160,
    imageHeight: 100, // Restored to 100px as requested
    borderRadius: BORDERS.radius.medium,
    padding: SPACING.content.small,
  },
  
  // Horizontal list dimensions (for ProductScreen)
  HORIZONTAL: {
    width: 140,
    imageWidth: 140,
    imageHeight: 100, // Restored to 100px as requested
    borderRadius: BORDERS.radius.medium,
    padding: SPACING.content.small,
  },
};
export default StyleSheet.create({
  // Standard card container with consistent styling
  cardContainer: {
    width: PRODUCT_CARD_DIMENSIONS.VERTICAL.width,
    height: 200, // Fixed height for consistent card size
    borderRadius: PRODUCT_CARD_DIMENSIONS.VERTICAL.borderRadius,
    borderWidth: BORDERS.width.medium,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    ...SHADOWS.medium,
    // Removed marginHorizontal for edge-to-edge layout
  },

  // Image container with consistent styling
  imageContainer: {
    width: '100%',
    height: PRODUCT_CARD_DIMENSIONS.VERTICAL.imageHeight,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },

  // Image styling
  image: {
    width: '100%',
    height: '100%',
  },

  // Info container with consistent padding
  infoContainer: {
    padding: PRODUCT_CARD_DIMENSIONS.VERTICAL.padding,
    justifyContent: 'flex-start', // Changed from space-between to flex-start
    height: 100, // Adjusted for 100px image height (200 card height - 100 image height - 16 padding * 2)
    // Removed paddingBottom since add to cart button is now in the row
  },

  // Add to cart button
  addToCartButton: {
    backgroundColor: '#f1ede9', // Updated to match specification
    borderRadius: 24, // Increased border radius for more rounded appearance
    paddingHorizontal: SPACING.content.large, // Increased horizontal padding
    paddingVertical: SPACING.content.medium, // Increased vertical padding
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    minHeight: 40, // Maintaining minimum height at 40px
    minWidth: 48, // Increased minimum width from 44px to 48px
  },

  addToCartText: {
    fontSize: 22, // Further increased from 18 to 22 for better visibility
    fontWeight: '600',
    color: '#754C29', // Updated to match specification
  },
});

// Restaurant card styles for consistency
export const RestaurantCardStyles = StyleSheet.create({
  cardContainer: {
    width: CARD_DIMENSIONS.restaurant.width,
    height: CARD_DIMENSIONS.restaurant.height,
    borderRadius: CARD_DIMENSIONS.restaurant.borderRadius,
    borderWidth: BORDERS.width.medium,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    ...SHADOWS.medium,
    // Removed marginHorizontal for edge-to-edge layout
  },

  imageContainer: {
    width: '100%',
    height: CARD_DIMENSIONS.restaurant.imageHeight,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  infoContainer: {
    // Removed flex: 1 to prevent height variation
    height: 48, // Fixed height: cardHeight(200) - imageHeight(140) - padding(12)
    padding: CARD_DIMENSIONS.restaurant.padding,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: SPACING.content.small,
  },

  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: SPACING.content.small,
  },

  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});