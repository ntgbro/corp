import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { OrderList } from '../components/OrderList';
import { useOrders } from '../hooks/useOrders';

export const OrdersScreen = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const { orders, loading, refreshOrders } = useOrders();

  const handleOrderPress = (orderId: string) => {
    // Navigate to order details screen
    console.log('Order pressed:', orderId);
  };

  return (
    <SafeAreaWrapper>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshOrders} />
        }
      >
        <View style={styles.content}>
          {loading && orders.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading orders...
              </Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No orders found
              </Text>
            </View>
          ) : (
            <OrderList orders={orders} onOrderPress={handleOrderPress} />
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

export default OrdersScreen;