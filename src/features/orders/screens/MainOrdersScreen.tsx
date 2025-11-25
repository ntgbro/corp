import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { OrderList } from '../components/OrderList';
import { useMainOrders } from '../hooks/useMainOrders';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrdersStackParamList } from '../../../navigation/OrdersStackNavigator';

type MainOrdersScreenNavigationProp = StackNavigationProp<OrdersStackParamList, 'OrderDetails'>;

export const MainOrdersScreen = () => {
  const navigation = useNavigation<MainOrdersScreenNavigationProp>();
  const { theme } = useThemeContext();
  const { orders, loading, error, refreshOrders } = useMainOrders();
  const [filter, setFilter] = useState<string>('present');

  const handleOrderPress = (orderId: string) => {
    // Navigate to order details screen
    navigation.navigate('OrderDetails', { orderId });
  };

  // Group orders by status
  const presentOrders = orders.filter((order: any) => 
    ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status.toLowerCase())
  );
  
  const deliveredOrders = orders.filter((order: any) => 
    order.status.toLowerCase() === 'delivered'
  );
  
  const cancelledOrders = orders.filter((order: any) => 
    order.status.toLowerCase() === 'cancelled'
  );

  const getFilteredOrders = () => {
    switch (filter) {
      case 'present':
        return presentOrders;
      case 'delivered':
        return deliveredOrders;
      case 'cancelled':
        return cancelledOrders;
      default:
        return presentOrders;
    }
  };

  const filteredOrders = getFilteredOrders();

  const statusFilters = [
    { key: 'present', label: 'Present Orders', count: presentOrders.length },
    { key: 'delivered', label: 'Delivered', count: deliveredOrders.length },
    { key: 'cancelled', label: 'Cancelled', count: cancelledOrders.length },
  ];

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: '#F5DEB3', borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 24, color: theme.colors.text }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Orders</Text>
          <TouchableOpacity onPress={refreshOrders}>
            <Text style={{ fontSize: 24, color: theme.colors.text }}>↻</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
              onPress={refreshOrders}
            >
              <Text style={[styles.retryText, { color: theme.colors.white }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with back button and reload button */}
      <View style={[styles.header, { backgroundColor: '#F5DEB3', borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: theme.colors.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Orders</Text>
        <TouchableOpacity onPress={refreshOrders}>
          <Text style={{ fontSize: 24, color: theme.colors.text }}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Replaced ScrollView with View to fix nested VirtualizedLists warning */}
      <View style={styles.content}>
        {/* Status Filters - Vertical List */}
        <View style={[styles.filterContainer, { backgroundColor: '#FBF5EB' }]}>
          {statusFilters.map((status) => (
            <TouchableOpacity
              key={status.key}
              style={[
                styles.filterButton,
                { 
                  backgroundColor: filter === status.key ? theme.colors.primary : 'transparent',
                  borderColor: '#754C29',
                }
              ]}
              onPress={() => setFilter(status.key)}
            >
              <View style={styles.filterContent}>
                <Text 
                  style={[
                    styles.filterText,
                    { 
                      color: filter === status.key ? theme.colors.white : theme.colors.textSecondary,
                    }
                  ]}
                >
                  {status.label}
                </Text>
                <Text 
                  style={[
                    styles.filterCount,
                    { 
                      color: filter === status.key ? theme.colors.white : theme.colors.textSecondary,
                    }
                  ]}
                >
                  ({status.count})
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Count */}
        <View style={styles.orderCountContainer}>
          <Text style={[styles.orderCountText, { color: theme.colors.textSecondary }]}>
            {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
          </Text>
        </View>

        {/* Orders List */}
        {loading && filteredOrders.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading orders...
            </Text>
          </View>
        ) : (
          <OrderList orders={filteredOrders} onOrderPress={handleOrderPress} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterContainer: {
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 0,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  filterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterCount: {
    fontSize: 14,
    fontWeight: '400',
  },
  orderCountContainer: {
    marginBottom: 16,
  },
  orderCountText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
    marginVertical: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});