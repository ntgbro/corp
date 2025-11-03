// src/constants/ui.ts
// Consistent spacing and sizing system for the entire app

export const SPACING = {
  // Base spacing units (multiples of 4 for consistency)
  xs: 4,   // 4px
  sm: 8,   // 8px
  md: 12,  // 12px
  lg: 16,  // 16px
  xl: 20,  // 20px
  xxl: 24, // 24px
  xxxl: 32, // 32px

  // Screen padding (edge-to-edge)
  screen: 16, // 16px horizontal padding for all screens

  // Card spacing
  card: {
    horizontal: 4,  // ✅ Decreased from 6 to 4 for tighter card spacing
    vertical: 8,    // Between card rows
  },

  // Section spacing
  section: {
    small: 12,  // Between small sections
    medium: 20, // Between main sections
    large: 32,  // Between major sections
  },

  // Content spacing
  content: {
    small: 8,   // Small gaps
    medium: 12, // Medium gaps
    large: 16,  // Large gaps
  }
} as const;

export const CARD_DIMENSIONS = {
  // Standard card sizes across all screens
  product: {
    width: 120,
    height: 200,
    imageHeight: 100, // ✅ Increased from 90 to 100 for better image visibility
    borderRadius: 12,
    padding: 8,
  },
  restaurant: {
    width: 280,
    height: 200,
    imageHeight: 140,
    borderRadius: 12,
    padding: 12,
  },
  menuItem: {
    width: 140,
    height: 200,
    imageHeight: 110,
    borderRadius: 8,
    padding: 8,
  },
  // Edge-to-edge card dimensions (calculated based on screen width)
  productEdgeToEdge: {
    width: 0, // Will be calculated dynamically
    height: 240,
    imageHeight: 110,
    borderRadius: 12,
    padding: 8,
  },
  category: {
    width: 80,
    height: 80,
    borderRadius: 12,
    padding: 8,
  }
} as const;

export const TYPOGRAPHY = {
  // Consistent font sizes
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 28,
  },

  // Font weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  }
} as const;

export const BORDERS = {
  radius: {
    small: 6,
    medium: 8,
    large: 12,
    round: 50, // For circular elements
  },
  width: {
    thin: 0.5,
    medium: 1,
    thick: 2,
  }
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  }
} as const;