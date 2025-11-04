import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../contexts/ThemeContext';

interface OrderItem {
  id: string;
  orderId: string;
  date: string;
  status: string;
  amount: number;
}

interface OrderListProps {
  orders: OrderItem[];
  onOrderPress: (orderId: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onOrderPress }) => {
  const { theme } = useThemeContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <TouchableOpacity
      style={[styles.orderItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => onOrderPress(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: theme.colors.text }]}>{item.orderId}</Text>
        <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
      </View>
      <View style={styles.orderFooter}>
        <Text style={[styles.orderStatus, { color: theme.colors.primary }]}>{item.status}</Text>
        <Text style={[styles.orderAmount, { color: theme.colors.text }]}>{formatPrice(item.amount)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderList;