import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../components/layout';
import { Button, Card, TextInput } from '../../../components/common';
import { useTheme } from '@react-navigation/native';
import { useCart } from '../../../contexts/CartContext';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Coupon } from '../../../types/coupon';

interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { theme } = useThemeContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <Card style={styles.cartItem}>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.itemImage, styles.placeholderImage]}>
          <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
            No Image
          </Text>
        </View>
      )}

      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
          {formatPrice(item.price)}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { borderColor: theme.colors.border }]}
            onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={[styles.quantityButtonText, { color: theme.colors.primary }]}>−</Text>
          </TouchableOpacity>

          <Text style={[styles.quantityText, { color: theme.colors.text }]}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            style={[styles.quantityButton, { borderColor: theme.colors.border }]}
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={[styles.quantityButtonText, { color: theme.colors.primary }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
        onPress={() => onRemove(item.id)}
      >
        <Text style={[styles.removeButtonText, { color: theme.colors.white }]}>×</Text>
      </TouchableOpacity>
    </Card>
  );
};

export const CartScreen = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const { 
    state: { items, totalItems, subtotal, discount, totalAmount, appliedCoupon }, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    applyCoupon, 
    removeCoupon 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(id) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your entire cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      'Checkout functionality will be implemented soon!',
      [{ text: 'OK' }]
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      setApplyingCoupon(true);
      setCouponError('');
      
      // In a real app, you would validate the coupon with your backend
      // For now, we'll just show a success message if the code is not empty
      const tempCoupon: Coupon = {
        id: 'temp-id',
        code: couponCode,
        name: 'Temporary Coupon',
        title: `${couponCode} Discount`,
        description: 'Temporary discount coupon',
        discountType: 'percentage',
        discountValue: 10, // 10% off as an example
        validFrom: new Date(),
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        isStackable: false,
        minOrderAmount: 0,
        minOrderCount: 1,
        usedCount: 0,
        maxUses: 1000,
      };
      
      await applyCoupon(tempCoupon);
      
      setCouponCode('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply coupon';
      setCouponError(errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const renderCouponSection = () => (
    <View style={styles.couponSection}>
      <View style={styles.couponHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Apply Coupon
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Coupons' as never)}
          style={styles.viewCouponsButton}
        >
          <Text style={{ color: theme.colors.primary }}>View Coupons</Text>
        </TouchableOpacity>
      </View>
      
      {appliedCoupon ? (
        <View style={styles.appliedCoupon}>
          <Text style={{ color: theme.colors.success, flex: 1 }}>
            Applied: {appliedCoupon.code} (-{appliedCoupon.discountValue}%)
          </Text>
          <TouchableOpacity onPress={removeCoupon}>
            <Text style={{ color: theme.colors.error }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.couponInputContainer}>
          <TextInput
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            style={[styles.input, { flex: 1 }]}
            containerStyle={{ flex: 1 }}
          />
          <Button
            title="Apply"
            onPress={handleApplyCoupon}
            style={styles.applyButton}
            textStyle={styles.applyButtonText}
            disabled={!couponCode.trim() || applyingCoupon}
          />
        </View>
      )}
      {couponError ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {couponError}
        </Text>
      ) : null}
    </View>
  );

  const renderEmptyCart = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.emptyIcon, { fontSize: 64 }]}>🛒</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Your cart is empty
      </Text>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        Add some delicious items to get started!
      </Text>
      <Button
        title="Continue Shopping"
        onPress={() => navigation.navigate('Home' as never)}
        style={styles.continueButton}
      />
    </View>
  );

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {items.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.cartList}
              ListHeaderComponent={
                <>
                  {renderCouponSection()}
                  <View style={styles.divider} />
                </>
              }
              ListFooterComponent={
                <Button
                  title="Clear Cart"
                  onPress={handleClearCart}
                  variant="outline"
                  style={styles.clearButton}
                  textStyle={{ color: theme.colors.error }}
                />
              }
            />
            <View style={[styles.summary, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Subtotal:
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {formatPrice(subtotal)}
                </Text>
              </View>
              
              {appliedCoupon && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Discount ({appliedCoupon.code}):
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                    -{formatPrice(discount)}
                  </Text>
                </View>
              )}
              
              <View style={[styles.divider, { marginVertical: 8 }]} />
              
              <View style={[styles.summaryRow, { marginTop: 4 }]}>
                <Text style={[styles.summaryLabel, { 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  color: theme.colors.text 
                }]}>
                  Total:
                </Text>
                <Text style={[styles.summaryValue, { 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  color: theme.colors.primary 
                }]}>
                  {formatPrice(totalAmount)}
                </Text>
              </View>
              
              <Button
                title="Proceed to Checkout"
                onPress={handleCheckout}
                style={styles.checkoutButton}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  couponSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewCouponsButton: {
    padding: 8,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  applyButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
  },
  appliedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  checkoutButton: {
    marginTop: 16,
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 12,
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  couponButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  couponButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  continueButton: {
    minWidth: 160,
  },
});

export default CartScreen;
