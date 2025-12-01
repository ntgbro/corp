import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface OrderItem {
  id: string;
  orderId: string;
  date: string;
  status: string;
  amount: number;
  restaurantName?: string;
  deliveryAddress?: string;
  otp?: string;
  deliveryPartnerName?: string; // Add delivery partner name
  deliveryPartnerPhone?: string; // Add delivery partner phone
}

interface OrderListProps {
  orders: OrderItem[];
  onOrderPress: (orderId: string) => void;
}

// Define order status progression
const ORDER_STATUS_FLOW = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'assigned',
  'out_for_delivery',
  'delivered'
];

export const OrderList: React.FC<OrderListProps> = ({ orders, onOrderPress }) => {
  const { theme } = useThemeContext();
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);

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
      case 'assigned':
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

  const handleOrderItemPress = (item: OrderItem) => {
    setSelectedOrder(item);
    setShowPopup(true);
  };

  const handleViewDetails = () => {
    if (selectedOrder) {
      setShowPopup(false);
      onOrderPress(selectedOrder.id);
    }
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <TouchableOpacity
      style={[styles.orderItem, { backgroundColor: '#FBF5EB', borderColor: '#754C29' }]}
      onPress={() => handleOrderItemPress(item)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, { color: theme.colors.text }]}>{item.orderId}</Text>
          <Text style={[styles.orderAmount, { color: theme.colors.text }]}>{formatPrice(item.amount)}</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => onOrderPress(item.id)}
        >
          <Text style={[styles.detailsButtonText, { color: theme.colors.primary }]}>
            Details
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderOrderStatusTimeline = (currentStatus: string, otp?: string, deliveryPartnerName?: string, deliveryPartnerPhone?: string) => {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus.toLowerCase());

    return (
      <View style={styles.timelineContainer}>
        {ORDER_STATUS_FLOW.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === ORDER_STATUS_FLOW.length - 1;

          // Check if we should show partner details at this step
          const showPartnerHere = isActive && (status === 'assigned' || status === 'out_for_delivery');

          return (
            <View key={status} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                {/* Status indicator circle */}
                <View style={[
                  styles.timelineDot,
                  {
                    backgroundColor: isCompleted ? theme.colors.primary : '#f5f5f5',
                    borderWidth: 2,
                    borderColor: isCompleted ? theme.colors.primary : '#d0d0d0',
                  }
                ]}>
                  {isCompleted && (
                    <View style={styles.timelineDotInner} />
                  )}
                </View>

                {/* Vertical connecting line */}
                {!isLast && (
                  <View style={[
                    styles.timelineLine,
                    {
                      backgroundColor: isCompleted && currentIndex > index ? theme.colors.primary : '#d0d0d0',
                    }
                  ]} />
                )}
              </View>

              {/* Status text */}
              <View style={styles.timelineRight}>
                <Text style={[
                  styles.statusLabel,
                  {
                    color: isCompleted ? theme.colors.text : '#999',
                    fontWeight: isActive ? '700' : isCompleted ? '600' : '400',
                  }
                ]}>
                  {getStatusText(status)}
                </Text>
                
                {/* ✅ ADDED: Show Delivery Partner details here */}
                {showPartnerHere && deliveryPartnerName && (
                  <View style={styles.deliveryPartnerInfo}>
                    <Text style={[styles.deliveryPartnerText, {color: theme.colors.text}]}>Agent: {deliveryPartnerName}</Text>
                    {deliveryPartnerPhone && (
                      <Text style={[styles.deliveryPartnerPhone, {color: theme.colors.textSecondary}]}>📞 {deliveryPartnerPhone}</Text>
                    )}
                  </View>
                )}
                {isActive && status === 'out_for_delivery' && otp && (
                  <View style={[styles.otpBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.otpBadgeText}>OTP: {otp}</Text>
                  </View>
                )}

                {isActive && (
                  <View style={[styles.activeBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

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

      {/* Order Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPopup}
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Order Status
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPopup(false)}
                >
                  <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedOrder && (
                <>
                  <View style={styles.orderSummary}>
                    <Text style={[styles.orderIdLarge, { color: theme.colors.text }]}>
                      {selectedOrder.orderId}
                    </Text>
                    <Text style={[styles.orderAmountLarge, { color: theme.colors.text }]}>
                      {formatPrice(selectedOrder.amount)}
                    </Text>
                  </View>

                  {renderOrderStatusTimeline(
                    selectedOrder.status,
                    selectedOrder.otp,
                    selectedOrder.deliveryPartnerName,
                    selectedOrder.deliveryPartnerPhone
                  )}

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.viewDetailsButton, { backgroundColor: theme.colors.primary }]}
                      onPress={handleViewDetails}
                    >
                      <Text style={styles.viewDetailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderItem: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  detailsButton: {
    padding: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderSummary: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  orderIdLarge: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  orderAmountLarge: {
    fontSize: 24,
    fontWeight: '800',
  },
  timelineContainer: {
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  otpBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  otpBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryPartnerInfo: {
    marginTop: 8,
  },
  deliveryPartnerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deliveryPartnerPhone: {
    fontSize: 12,
    marginTop: 2,
  },

  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  viewDetailsButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OrderList;