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
import { Button, Card } from '../../../components/common';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useCart } from '../../../contexts/CartContext';

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

export const CartScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();

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

  const renderCartFooter = () => (
    <Card style={styles.cartSummary}>
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
          Subtotal ({state.totalItems} items)
        </Text>
        <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
          {formatPrice(state.totalAmount)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
          Delivery Fee
        </Text>
        <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
          {formatPrice(40)}
        </Text>
      </View>

      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
          Total
        </Text>
        <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
          {formatPrice(state.totalAmount + 40)}
        </Text>
      </View>

      <Button
        title="Proceed to Checkout"
        onPress={handleCheckout}
        style={styles.checkoutButton}
        disabled={state.items.length === 0}
      />

      {state.items.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCart}
        >
          <Text style={[styles.clearButtonText, { color: theme.colors.error }]}>
            Clear Cart
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  return (
    <SafeAreaWrapper style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {state.items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={state.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            )}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderCartFooter}
          />
        </>
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
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
  cartSummary: {
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
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
