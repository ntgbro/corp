import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../config/theme';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useOrderDetails } from '../hooks/useOrderDetails';
import { OrderItem, PaymentDetails, StatusHistory } from '../hooks/useOrderDetails';
import Icon from 'react-native-vector-icons/Ionicons';

type OrderDetailsRouteProp = RouteProp<{
  OrderDetails: { orderId: string };
}, 'OrderDetails'>;

export const OrderDetailsScreen = () => {
  const theme = useTheme();
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
              
              <View style={styles.itemDetails}>
                <Text style={[styles.itemQuantity, { color: theme.colors.textSecondary }]}>
                  Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                </Text>
                
                {item.customizations && item.customizations.length > 0 && (
                  <View style={styles.customizations}>
                    {item.customizations.map((custom: { name: string; price: number }, index: number) => (
                      <View key={index} style={styles.customizationRow}>
                        <Text style={[styles.customizationName, { color: theme.colors.textSecondary }]}>
                          + {custom.name}
                        </Text>
                        <Text style={[styles.customizationPrice, { color: theme.colors.textSecondary }]}>
                          {formatPrice(custom.price)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Payment */}
        {orderDetails.payment.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Payment
            </Text>
            
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                Method
              </Text>
              <Text style={[styles.paymentValue, { color: theme.colors.text }]}>
                {orderDetails.payment[0].method}
              </Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                Status
              </Text>
              <Text style={[styles.paymentValue, { color: theme.colors.text }]}>
                {orderDetails.payment[0].status}
              </Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                Date
              </Text>
              <Text style={[styles.paymentValue, { color: theme.colors.text }]}>
                {formatDate(orderDetails.payment[0].timestamp)}
              </Text>
            </View>
          </View>
        )}

        {/* Delivery */}
        {orderDetails.deliveryAddress && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Delivery Address
            </Text>
            
            <Text style={[styles.addressText, { color: theme.colors.text }]}>
              {orderDetails.deliveryAddress.addressLine1}
            </Text>
            {orderDetails.deliveryAddress.addressLine2 ? (
              <Text style={[styles.addressText, { color: theme.colors.text }]}>
                {orderDetails.deliveryAddress.addressLine2}
              </Text>
            ) : null}
            <Text style={[styles.addressText, { color: theme.colors.text }]}>
              {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.state} - {orderDetails.deliveryAddress.pincode}
            </Text>
            <Text style={[styles.addressText, { color: theme.colors.text }]}>
              Phone: {orderDetails.deliveryAddress.contactPhone}
            </Text>
          </View>
        )}

        {/* Special Instructions */}
        {orderDetails.instructions && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Special Instructions
            </Text>
            <Text style={[styles.instructionsText, { color: theme.colors.textSecondary }]}>
              {orderDetails.instructions}
            </Text>
          </View>
        )}

        {/* Status History */}
        {orderDetails.statusHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Status History
            </Text>
            
            {orderDetails.statusHistory.map((status: StatusHistory, index: number) => (
              <View key={status.id} style={styles.statusHistoryItem}>
                <View style={styles.statusHistoryHeader}>
                  <View style={styles.statusHistoryInfo}>
                    <Text style={[styles.statusHistoryStatus, { color: theme.colors.text }]}>
                      {status.status.charAt(0).toUpperCase() + status.status.slice(1).replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <Text style={[styles.statusHistoryDate, { color: theme.colors.textSecondary }]}>
                    {formatDate(status.timestamp)}
                  </Text>
                </View>
                {status.notes && (
                  <Text style={[styles.statusHistoryNotes, { color: theme.colors.textSecondary }]}>
                    {status.notes}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
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
    paddingHorizontal: 16,
  },
  section: {
    margin: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#754C29',
    backgroundColor: '#FBF5EB',
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
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '500',
  },
  itemDetails: {
    marginLeft: 8,
  },
  itemQuantity: {
    fontSize: 13,
    marginBottom: 4,
  },
  customizations: {
    marginTop: 4,
  },
  customizationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customizationName: {
    fontSize: 13,
  },
  customizationPrice: {
    fontSize: 13,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
  },
  paymentValue: {
    fontSize: 14,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  statusHistoryItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FBF5EB',
    borderRadius: 8,
  },
  statusHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusHistoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusHistoryStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusHistoryDate: {
    fontSize: 12,
  },
  statusHistoryNotes: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 4,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
});

export default OrderDetailsScreen;