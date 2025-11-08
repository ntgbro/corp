import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../config/theme';
import Icon from 'react-native-vector-icons/Ionicons';

interface OrderItem {
  id: string;
  orderId: string;
  date: string;
  status: string;
  amount: number;
  restaurantName?: string;
  deliveryAddress?: string;
}

interface OrderListProps {
  orders: OrderItem[];
  onOrderPress: (orderId: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onOrderPress }) => {
  const theme = useTheme();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return theme.colors.success;
      case 'out_for_delivery':
        return theme.colors.primary;
      case 'confirmed':
      case 'preparing':
      case 'ready':
        return theme.colors.warning;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'checkmark-circle';
      case 'out_for_delivery':
        return 'bicycle';
      case 'confirmed':
        return 'checkmark';
      case 'preparing':
        return 'restaurant';
      case 'ready':
        return 'fast-food';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <TouchableOpacity
      style={[styles.orderItem, { backgroundColor: '#FBF5EB', borderColor: '#754C29' }]}
      onPress={() => onOrderPress(item.id)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, { color: theme.colors.text }]}>{item.orderId}</Text>
          <View style={styles.statusContainer}>
            <Icon 
              name={getStatusIcon(item.status)} 
              size={14} 
              color={getStatusColor(item.status)} 
            />
            <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </View>
      
      {item.restaurantName && (
        <Text style={[styles.restaurantName, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {item.restaurantName}
        </Text>
      )}
      
      <View style={styles.orderDetails}>
        <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
        <Text style={[styles.orderAmount, { color: theme.colors.text }]}>{formatPrice(item.amount)}</Text>
      </View>
      
      {item.deliveryAddress && (
        <Text style={[styles.deliveryAddress, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          <Icon name="location" size={12} color={theme.colors.textSecondary} />
          {' '}{item.deliveryAddress}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No orders found
            </Text>
          </View>
        }
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  restaurantName: {
    fontSize: 13,
    marginBottom: 4,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryAddress: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default OrderList;