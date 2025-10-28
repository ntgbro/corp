import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../config/theme';

interface CartSummaryBarProps {
  itemCount: number;
  totalAmount: number;
  currency?: string;
  onPress?: () => void;
  style?: ViewStyle;
  showItemCount?: boolean;
  showTotal?: boolean;
  buttonText?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'expanded';
}

export const CartSummaryBar: React.FC<CartSummaryBarProps> = ({
  itemCount,
  totalAmount,
  currency = '₹',
  onPress,
  style,
  showItemCount = true,
  showTotal = true,
  buttonText = 'View Cart',
  loading = false,
  disabled = false,
  variant = 'default',
}) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          height: 48,
          fontSize: 12,
        };
      case 'expanded':
        return {
          paddingVertical: 16,
          paddingHorizontal: 20,
          height: 72,
          fontSize: 16,
        };
      default: // default
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          height: 56,
          fontSize: 14,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const formatPrice = (price: number) => {
    return `${currency}${price.toFixed(2)}`;
  };

  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: disabled || loading ? theme.colors.border : theme.colors.primary,
      paddingVertical: variantStyles.paddingVertical,
      paddingHorizontal: variantStyles.paddingHorizontal,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 100,
    };

    return baseStyle;
  };

  const getButtonTextStyle = () => {
    return {
      color: theme.colors.white,
      fontSize: variantStyles.fontSize,
      fontWeight: '600' as const,
    };
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        style,
      ]}
    >
      {/* Summary Info */}
      {(showItemCount || showTotal) && (
        <View style={styles.summaryInfo}>
          {showItemCount && (
            <Text style={[styles.itemCount, { color: theme.colors.textSecondary }]}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Text>
          )}

          {showTotal && (
            <Text style={[styles.totalAmount, { color: theme.colors.text, fontSize: variantStyles.fontSize + 2 }]}>
              {formatPrice(totalAmount)}
            </Text>
          )}
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <Text style={getButtonTextStyle()}>
          {loading ? 'Loading...' : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  summaryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 16,
  },
  itemCount: {
    fontSize: 14,
  },
  totalAmount: {
    fontWeight: 'bold',
  },
});

export default CartSummaryBar;
