import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../config/theme';
import { OrderList } from '../components/OrderList';
import { useMainOrders } from '../hooks/useMainOrders';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrdersStackParamList } from '../../../navigation/OrdersStackNavigator';
import Icon from 'react-native-vector-icons/Ionicons';

type MainOrdersScreenNavigationProp = StackNavigationProp<OrdersStackParamList, 'OrderDetails'>;

export const MainOrdersScreen = () => {
  const navigation = useNavigation<MainOrdersScreenNavigationProp>();
  const theme = useTheme();
  const { orders, loading, error, refreshOrders } = useMainOrders();
  const [filter, setFilter] = useState<string>('all');

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
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: '#F5DEB3', borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Orders</Text>
          <View style={{ width: 24 }} />
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
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: '#F5DEB3', borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, color: theme.colors.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Replaced ScrollView with View to fix nested VirtualizedLists warning */}
      <View style={styles.content}>
        {/* Status Filters */}
        <View style={[styles.filterContainer, { backgroundColor: '#FBF5EB' }]}>
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
                    borderColor: '#754C29',
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
    marginHorizontal: 16,
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

export default MainOrdersScreen;