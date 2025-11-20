import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../../config/theme';

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

// Define order status progression
const ORDER_STATUS_FLOW = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered'
];

export const OrderList: React.FC<OrderListProps> = ({ orders, onOrderPress }) => {
  const theme = useTheme();
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
          {item.deliveryAddress}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderOrderStatusTimeline = (currentStatus: string) => {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus.toLowerCase());
    
    return (
      <View style={styles.timelineContainer}>
        {ORDER_STATUS_FLOW.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === ORDER_STATUS_FLOW.length - 1;
          
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
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPopup(false)}
        >
          <TouchableOpacity 
            style={[styles.modalContent, { backgroundColor: '#FFFFFF' }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#000' }]}>
                Order Progress
              </Text>
              <TouchableOpacity 
                onPress={() => setShowPopup(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            {selectedOrder && (
              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {/* Order Info */}
                <View style={styles.orderInfoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Order ID:</Text>
                    <Text style={styles.infoValue}>{selectedOrder.orderId}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Amount:</Text>
                    <Text style={[styles.infoValue, { fontWeight: '700' }]}>
                      {formatPrice(selectedOrder.amount)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text style={[styles.infoValue, { color: getStatusColor(selectedOrder.status), fontWeight: '600' }]}>
                      {getStatusText(selectedOrder.status)}
                    </Text>
                  </View>
                </View>
                
                {/* Status Timeline */}
                <View style={styles.timelineSection}>
                  <Text style={styles.sectionTitle}>Order Tracking</Text>
                  {renderOrderStatusTimeline(selectedOrder.status)}
                </View>
                
                {/* Action Button */}
                <TouchableOpacity
                  style={[styles.viewDetailsButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleViewDetails}
                >
                  <Text style={styles.viewDetailsButtonText}>
                    View Full Details
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#754C29',
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '500',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 32,
    fontWeight: '300',
    color: '#666',
  },
  modalBody: {
    flexGrow: 1,
  },
  orderInfoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  timelineSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
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
    backgroundColor: 'white',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 32,
  },
  timelineRight: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 14,
  },
  statusLabel: {
    fontSize: 15,
  },
  activeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  activeBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  viewDetailsButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrderList;