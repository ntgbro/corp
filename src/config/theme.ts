import { useColorScheme } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    white: string;
    black: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
      variable: string;
      italicVariable: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#754C29',        // Changed from '#3b82f6' (Royal Blue) to '#754C29'
    secondary: '#10b981',      // Sage Green - Accent color
    background: '#fefefe',     // Warm White - Container background
    surface: '#f8fafc',        // Light Gray - Card backgrounds
    text: '#1f2937',           // Charcoal - Primary text
    textSecondary: '#6b7280',  // Medium Gray - Secondary text
    border: '#e5e7eb',         // Light Border - Section dividers
    error: '#ef4444',          // Red - Error states
    success: '#10b981',        // Sage Green - Success states
    warning: '#f59e0b',        // Orange - Warning states
    white: '#ffffff',          // Pure White
    black: '#000000',          // Pure Black
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semibold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
      variable: 'Inter-Variable',
      italicVariable: 'Inter-Italic-Variable',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
  },
};

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export { lightTheme, darkTheme };
export default lightTheme;
