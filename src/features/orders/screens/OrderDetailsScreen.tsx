import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useOrderDetails } from '../hooks/useOrderDetails';
// Removed 'StatusHistory' from imports as it is no longer used
import { OrderItem, PaymentDetails } from '../hooks/useOrderDetails';
import Icon from 'react-native-vector-icons/Ionicons';
import { StarRating } from '../../../components/common/StarRating'; // Adjust path as needed
import { RestaurantService } from '../../../services/firebase/restaurantService'; // Adjust path

type OrderDetailsRouteProp = RouteProp<{
  OrderDetails: { orderId: string };
}, 'OrderDetails'>;

export const OrderDetailsScreen = () => {
  const { theme } = useThemeContext();
  const route = useRoute<OrderDetailsRouteProp>();
  const navigation = useNavigation();
  const { orderId } = route.params || {};
  
  // Note: Since you mentioned you don't want to pull data from the status_history collection anymore,
  // ensure you also update your 'useOrderDetails' hook to stop fetching that field to save database reads.
  const { orderDetails, loading, error } = useOrderDetails(orderId || null);

  // --- HELPER: Parse Address Data ---
  const getParsedAddress = (data: any) => {
    try {
      if (!data) return null;
      // If it's a string (JSON), parse it. If it's already an object, return it.
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.log('Error parsing address:', e);
      return null;
    }
  };

  // 1. Add state to track which items have been rated locally in this session
  const [ratedItems, setRatedItems] = React.useState<Record<string, number>>({});

  // 2. Handler for rating
  const handleRateItem = async (item: any, rating: number) => {
    // Only proceed if it's a menu item and has the necessary IDs
    // Check if the item has links with restaurantId and menuItemId
    if (item.type !== 'menu_item' || !item.links?.restaurantId || !item.links?.menuItemId) {
      console.warn('Cannot rate: Missing restaurantId or menuItemId');
      Alert.alert('Error', 'Cannot rate this item: Missing restaurant or menu item information.');
      return;
    }

    // Check if item is already rated in database or current session
    if (item.isRated || ratedItems[item.id]) {
      Alert.alert('Info', 'You have already rated this item.');
      return;
    }

    try {
      // 1. Update the Global Average (Restaurant Collection)
      await RestaurantService.rateMenuItem(
        item.links.restaurantId,
        item.links.menuItemId,
        rating
      );

      // 2. Update the Personal Order Record (Order Collection) - THIS FIXES THE GLITCH
      // We pass 'orderDetails?.id' and the specific 'item.id' (the document ID of the item in the order)
      if (orderDetails?.id) {
        await RestaurantService.saveUserRatingToOrder(
          orderDetails.id, 
          item.id, // This is the specific doc ID in orders/../order_items/
          rating
        );
      }

      // 3. Update local state for immediate feedback
      setRatedItems(prev => ({ ...prev, [item.id]: rating }));
      
      Alert.alert('Success', 'Thanks for your rating!');
    } catch (error: any) {
      console.error('Error rating item:', error);
      // Provide more specific error message for permission issues
      if (error?.message?.includes('permission')) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Failed to submit rating. Please try again.');
      }
    }
  };

  const deliveryAddress = orderDetails ? getParsedAddress(orderDetails.deliveryAddress) : null;
  // ----------------------------------

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
                <Text style={[styles.itemName, { color: theme.colors.text, flex: 1, marginRight: 12 }]}>
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
              {/* --- NEW RATING SECTION --- */}
              {/* Only show if delivered and item is a restaurant menu item */}
              {orderDetails.status === 'delivered' && item.type === 'menu_item' && (
                <View style={styles.ratingContainer}>
                  <Text style={[styles.ratingLabel, { color: theme.colors.textSecondary }]}> 
                    {(item.isRated || ratedItems[item.id]) ? "You rated:" : "Rate this item:"}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <StarRating
                      rating={(item.userRating || ratedItems[item.id]) || 0}
                      maxRating={5}
                      size="medium"
                      // If already rated in database or this session, make it readonly
                      readonly={!!(item.isRated || ratedItems[item.id])}
                      onRatingChange={(rating) => handleRateItem(item, rating)}
                    />
                    {(item.isRated || ratedItems[item.id]) && (
                      <Text style={[styles.ratingThanks, { color: theme.colors.success, marginLeft: 12 }]}> 
                        Thank you!
                      </Text>
                    )}
                  </View>
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
          
          <View style={styles.addressBlock}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary, marginBottom: 8 }]}>
              Delivery Address
            </Text>
            
            {deliveryAddress ? (
              <View style={{ marginTop: 4 }}>
                <Text style={[styles.contactName, { color: theme.colors.text }]}>
                  {deliveryAddress.contactName || "Customer"}
                </Text>
                <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
                   {deliveryAddress.line2 ? `${deliveryAddress.line2}, ` : ''}
                   {deliveryAddress.line1}
                </Text>
                <Text style={[styles.addressText, { color: theme.colors.textSecondary, marginBottom: 6 }]}>
                  {deliveryAddress.city} - {deliveryAddress.pincode}
                </Text>
                <Text style={[styles.phoneText, { color: theme.colors.text }]}>
                  Phone: {deliveryAddress.contactPhone}
                </Text>
              </View>
            ) : (
               <Text style={[styles.addressText, { color: theme.colors.text }]}>
                  Address details unavailable
               </Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Estimated Delivery
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
              Payment Method
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {orderDetails.paymentMethod}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Payment Status
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {orderDetails.paymentStatus}
            </Text>
          </View>
          
          {orderDetails.payment.length > 0 && orderDetails.payment[0].transactionId && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Transaction ID
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {orderDetails.payment[0].transactionId}
              </Text>
            </View>
          )}
        </View>

        {/* Status History Removed */}
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
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  orderDate: {
    fontSize: 13,
    textAlign: 'right',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 12,
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
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  itemQuantity: {
    fontSize: 14,
    marginBottom: 4,
  },
  customizationsContainer: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  customizationsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  customizationItem: {
    fontSize: 13,
    marginLeft: 4,
    lineHeight: 18,
  },
  addressBlock: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  addressText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start' so text aligns at the top
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginRight: 10, // Add some space so they don't touch
    marginTop: 2,    // Tiny adjustment to align text baseline
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,         // THIS IS KEY: It forces the text to wrap inside the box
    flexWrap: 'wrap',
    color: '#000',   // Ensure text is black/visible
  },
  // Removed history styles as they are no longer used
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
  ratingContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingThanks: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    marginLeft: 8,
  },
});