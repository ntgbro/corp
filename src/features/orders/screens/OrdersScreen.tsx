import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../../../config/theme';
import { useNavigation } from '@react-navigation/native';
import { Card, EmptyState, Loader } from '../../../components/common';
import { SectionHeader } from '../../../components/layout';
import { SafeAreaWrapper } from '../../../components/layout';

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total: number;
  items: string[];
  chefName: string;
  createdAt: string;
  estimatedTime?: string;
}

const OrdersScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock orders data
      const mockOrders: Order[] = [
        {
          id: '1',
          status: 'delivered',
          total: 450,
          items: ['Butter Chicken', 'Naan'],
          chefName: 'Chef Rajesh',
          createdAt: '2024-01-15',
          estimatedTime: 'Delivered',
        },
        {
          id: '2',
          status: 'out_for_delivery',
          total: 320,
          items: ['Paneer Tikka', 'Rice'],
          chefName: 'Chef Priya',
          createdAt: '2024-01-14',
          estimatedTime: '15 mins',
        },
        {
          id: '3',
          status: 'confirmed',
          total: 280,
          items: ['Dal Makhani', 'Roti'],
          chefName: 'Chef Amit',
          createdAt: '2024-01-14',
          estimatedTime: '25 mins',
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
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

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, { color: theme.colors.text }]}>
            Order #{item.id}
          </Text>
          <Text style={[styles.chefName, { color: theme.colors.textSecondary }]}>
            {item.chefName}
          </Text>
        </View>
        <View style={[styles.statusContainer, { borderColor: getStatusColor(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={[styles.items, { color: theme.colors.textSecondary }]}>
          {item.items.join(', ')}
        </Text>
        <Text style={[styles.total, { color: theme.colors.text }]}>
          ₹{item.total}
        </Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
          {item.createdAt}
        </Text>
        {item.estimatedTime && (
          <Text style={[styles.estimatedTime, { color: theme.colors.primary }]}>
            {item.estimatedTime}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.viewButton, { borderColor: theme.colors.primary }]}
        onPress={() => {
          // Navigate to order details
          console.log('View order:', item.id);
        }}
      >
        <Text style={[styles.viewButtonText, { color: theme.colors.primary }]}>
          View Details
        </Text>
      </TouchableOpacity>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
        <Loader />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <SectionHeader
        title="My Orders"
        subtitle={`${orders.length} orders`}
        style={styles.header}
      />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your order history will appear here"
          icon={
            <Text style={{ fontSize: 64 }}>📋</Text>
          }
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  ordersList: {
    padding: 16,
    paddingBottom: 80, // Space for bottom navigation
  },
  orderCard: {
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chefName: {
    fontSize: 14,
  },
  statusContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  items: {
    fontSize: 14,
    flex: 1,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
  },
  estimatedTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default OrdersScreen;
