import { StyleSheet } from 'react-native';
import { CARD_DIMENSIONS, SPACING, BORDERS, SHADOWS } from '../../constants/ui';

// Shared product card dimensions for consistency across screens
export const PRODUCT_CARD_DIMENSIONS = {
  // ProductCard standard size (for ProductScreen grid)
  STANDARD: {
    width: CARD_DIMENSIONS.product.width,
    height: CARD_DIMENSIONS.product.height,
    imageHeight: CARD_DIMENSIONS.product.imageHeight,
    borderRadius: CARD_DIMENSIONS.product.borderRadius,
    padding: CARD_DIMENSIONS.product.padding,
  },
  // Horizontal list dimensions (for ProductsPage)
  HORIZONTAL: {
    width: CARD_DIMENSIONS.product.width,
    imageWidth: CARD_DIMENSIONS.product.width,
    imageHeight: CARD_DIMENSIONS.product.imageHeight,
    borderRadius: CARD_DIMENSIONS.product.borderRadius,
    padding: CARD_DIMENSIONS.product.padding,
  },
} as const;

export const ProductCardStyles = StyleSheet.create({
  // Standard card container with consistent styling
  cardContainer: {
    width: PRODUCT_CARD_DIMENSIONS.STANDARD.width,
    borderRadius: PRODUCT_CARD_DIMENSIONS.STANDARD.borderRadius,
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
    height: PRODUCT_CARD_DIMENSIONS.STANDARD.imageHeight,
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
    // Removed fixed height to allow responsive sizing
    padding: PRODUCT_CARD_DIMENSIONS.STANDARD.padding,
    justifyContent: 'space-between',
    minHeight: 94, // Updated from 114 to match new dimensions (cardHeight(200) - imageHeight(90) - padding(16))
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
    alignSelf: 'flex-end',
  },

  addToCartText: {
    fontSize: 18, // Reduced font size for better fit in circular button
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
