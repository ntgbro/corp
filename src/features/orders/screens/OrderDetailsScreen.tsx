import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useOrderDetails } from '../hooks/useOrderDetails';
import { OrderItem, PaymentDetails, StatusHistory } from '../hooks/useOrderDetails';
import Icon from 'react-native-vector-icons/Ionicons';

type OrderDetailsRouteProp = RouteProp<{
  OrderDetails: { orderId: string };
}, 'OrderDetails'>;

export const OrderDetailsScreen = () => {
  const { theme } = useThemeContext();
  const route = useRoute<OrderDetailsRouteProp>();
  const navigation = useNavigation();
  const { orderId } = route.params || {};
  
  const { orderDetails, loading, error } = useOrderDetails(orderId || null);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      } else {
        return new Date(timestamp).toLocaleString();
      }
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return theme.colors.success;
      case 'out_for_delivery':
        return theme.colors.primary;
      case 'confirmed':
      case 'preparing':
      case 'ready':
      case 'assigned':
        return theme.colors.warning;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.retryText, { color: theme.colors.white }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!orderDetails) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Order not found
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.retryText, { color: theme.colors.white }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content}>
        {/* Order Header */}
        <View style={styles.section}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={[styles.orderId, { color: theme.colors.text }]}>
                Order {orderDetails.orderId}
              </Text>
              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: getStatusColor(orderDetails.status) }]}>
                  {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1).replace(/_/g, ' ')}
                </Text>
              </View>
            </View>
            <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
              {orderDetails.date}
            </Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Order Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Items Total
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {formatPrice(orderDetails.amount - orderDetails.deliveryCharges - orderDetails.taxes + orderDetails.discount)}
            </Text>
          </View>
          
          {orderDetails.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Discount
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                -{formatPrice(orderDetails.discount)}
              </Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Delivery Charges
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {orderDetails.deliveryCharges > 0 ? formatPrice(orderDetails.deliveryCharges) : 'Free'}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Taxes
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {formatPrice(orderDetails.taxes)}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: theme.colors.text }]}>
              {formatPrice(orderDetails.amount)}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Items ({orderDetails.items.length})
          </Text>
          
          {orderDetails.items.map((item: OrderItem) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemName, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.colors.text }]}>
                  {formatPrice(item.totalPrice)}
                </Text>
              </View>
              <Text style={[styles.itemQuantity, { color: theme.colors.textSecondary }]}>
                Qty: {item.quantity}
              </Text>
              {item.customizations && item.customizations.length > 0 && (
                <View style={styles.customizationsContainer}>
                  <Text style={[styles.customizationsTitle, { color: theme.colors.textSecondary }]}>
                    Customizations:
                  </Text>
                  {item.customizations.map((customization, index: number) => (
                    <Text key={index} style={[styles.customizationItem, { color: theme.colors.textSecondary }]}>
                      • {customization.name} (+{formatPrice(customization.price)})
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Delivery Information
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Delivery Address:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {typeof orderDetails.deliveryAddress === 'string' 
                ? orderDetails.deliveryAddress 
                : JSON.stringify(orderDetails.deliveryAddress)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Estimated Delivery:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {orderDetails.estimatedDeliveryTime}
            </Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Payment Information
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Payment Method:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {orderDetails.paymentMethod}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Payment Status:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {orderDetails.paymentStatus}
            </Text>
          </View>
          
          {orderDetails.payment.length > 0 && orderDetails.payment[0].transactionId && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Transaction ID:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {orderDetails.payment[0].transactionId}
              </Text>
            </View>
          )}
        </View>

        {/* Status History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Status History
          </Text>
          
          {orderDetails.statusHistory && orderDetails.statusHistory.map((history: StatusHistory, index: number) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={[styles.historyStatus, { color: getStatusColor(history.status) }]}>
                  {history.status.charAt(0).toUpperCase() + history.status.slice(1).replace(/_/g, ' ')}
                </Text>
                <Text style={[styles.historyDate, { color: theme.colors.textSecondary }]}>
                  {formatDate(history.timestamp)}
                </Text>
              </View>
              {history.notes && (
                <Text style={[styles.historyNote, { color: theme.colors.textSecondary }]}>
                  {history.notes}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  orderDate: {
    fontSize: 14,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  itemContainer: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 14,
    marginBottom: 4,
  },
  customizationsContainer: {
    marginTop: 4,
  },
  customizationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  customizationItem: {
    fontSize: 13,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  historyItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 14,
  },
  historyNote: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});