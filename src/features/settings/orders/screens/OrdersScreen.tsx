import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { OrderList } from '../components/OrderList';
import { useOrderHistory } from '../hooks/useOrders';
import { SettingsStackParamList } from '../../../settings/navigation/SettingsNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type OrderHistoryScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'OrderHistory'>;

export const OrdersScreen = () => {
  const navigation = useNavigation<OrderHistoryScreenNavigationProp>();
  const { theme } = useThemeContext();
  const { orders, loading, error, refreshOrderHistory } = useOrderHistory();
  const [filter, setFilter] = useState<string>('all');

  // Refresh order history when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshOrderHistory();
    }, [refreshOrderHistory])
  );

  const handleOrderPress = (orderId: string) => {
    // Navigate to order details screen
    navigation.navigate('OrderDetails', { orderId });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter((order: any) => order.status.toLowerCase() === filter);

  const statusFilters = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  if (error) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
              onPress={refreshOrderHistory}
            >
              <Text style={[styles.retryText, { color: theme.colors.white }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshOrderHistory} />
        }
      >
        <View style={styles.content}>
          {/* Status Filters */}
          <View style={[styles.filterContainer, { backgroundColor: theme.colors.surface }]}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            >
              {statusFilters.map((status) => (
                <TouchableOpacity
                  key={status.key}
                  style={[
                    styles.filterButton,
                    { 
                      backgroundColor: filter === status.key ? theme.colors.primary : 'transparent',
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={() => setFilter(status.key)}
                >
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
                </TouchableOpacity>
              ))}
            </ScrollView>
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
                Loading order history...
              </Text>
            </View>
          ) : (
            <OrderList orders={filteredOrders} onOrderPress={handleOrderPress} />
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterContainer: {
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
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
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    margin: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OrdersScreen;