import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaWrapper } from '../../../components/layout';
import { Button, Card, TextInput } from '../../../components/common';
import { useTheme } from '@react-navigation/native';
import { useCart } from '../../../contexts/CartContext';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Coupon } from '../../../types/coupon';
import { useAddresses } from '../../settings/addresses/hooks/useAddresses';
import { useLocationContext } from '../../../contexts/LocationContext';
import { CartService } from '../../../services/firebase/cartService';
import { CartStackParamList } from '../../../navigation/CartStackNavigator';

interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { theme } = useThemeContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <Card style={styles.cartItem}>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.itemImage, styles.placeholderImage]}>
          <Text style={[styles.noImageText, { color: theme.colors.textSecondary }]}>
            No Image
          </Text>
        </View>
      )}

      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
          {formatPrice(item.price)}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { borderColor: theme.colors.border }]}
            onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={[styles.quantityButtonText, { color: theme.colors.primary }]}>−</Text>
          </TouchableOpacity>

          <Text style={[styles.quantityText, { color: theme.colors.text }]}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            style={[styles.quantityButton, { borderColor: theme.colors.border }]}
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={[styles.quantityButtonText, { color: theme.colors.primary }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemTotalContainer}>
        <Text style={[styles.itemTotal, { color: theme.colors.text }]}>
          {formatPrice(item.price * item.quantity)}
        </Text>
        <TouchableOpacity
          style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
          onPress={() => onRemove(item.id)}
        >
          <Text style={[styles.removeButtonText, { color: theme.colors.white }]}>×</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

// Define types for our time slot data
interface CalendarDay {
  id: string;
  date: Date;
  dayName: string;
  dayNumber: number;
  monthName: string;
  fullDate: string;
}

interface TimeSlot {
  id: string;
  dayId: string;
  day: string;
  time: string;
  date: Date;
}

// Generate next 7 days starting from today
const generateNext7Days = (): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    days.push({
      id: i.toString(),
      date: date,
      dayName: dayName,
      dayNumber: dayNumber,
      monthName: monthName,
      fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    });
  }
  
  return days;
};

// Generate time slots for a specific day
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const timeRanges = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM', 
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
    '8:00 PM - 10:00 PM'
  ];
  
  // Generate for next 7 days
  const days = generateNext7Days();
  
  days.forEach((day, dayIndex) => {
    timeRanges.forEach((time, timeIndex) => {
      slots.push({
        id: `${dayIndex}-${timeIndex}`,
        dayId: day.id,
        day: day.fullDate,
        time: time,
        date: day.date
      });
    });
  });
  
  return slots;
};

type CartScreenNavigationProp = StackNavigationProp<CartStackParamList, 'Cart'>;

export const CartScreen = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { 
    state: { items, totalItems, subtotal, discount, totalAmount, appliedCoupon }, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    applyCoupon, 
    removeCoupon,
    syncWithFirebase,
    loadCartFromFirebase,
    prepareOrderData,
  } = useCart();
  
  // Load addresses hook
  const { addresses, loading: addressesLoading } = useAddresses();
  
  // Location context
  const { currentLocation } = useLocationContext();
  
  // State for address and time slot selection
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  
  // State for additional order information
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  
  // State for time slot selection within the modal
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  
  // Load cart from Firebase when component mounts
  useEffect(() => {
    loadCartFromFirebase();
  }, [loadCartFromFirebase]);
  
  // Sync with Firebase when component mounts
  useEffect(() => {
    syncWithFirebase();
  }, [syncWithFirebase]);
  
  // Initialize selected day when time slot modal opens
  useEffect(() => {
    if (showTimeSlotModal && !selectedDayId) {
      const days = generateNext7Days();
      setSelectedDayId(days[0]?.id || null);
    }
  }, [showTimeSlotModal]);
  
  // Set default address from current location
  useEffect(() => {
    if (currentLocation && !selectedAddress) {
      setSelectedAddress({
        id: currentLocation.id,
        name: currentLocation.label,
        line1: currentLocation.address,
        coordinates: currentLocation.coordinates,
        isDefault: true
      });
    }
  }, [currentLocation, selectedAddress]);
  
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(id) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your entire cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = async () => {
    // Check if address is selected
    if (!selectedAddress) {
      Alert.alert(
        'Address Required',
        'Please select a delivery address to proceed with checkout.',
        [
          {
            text: 'Select Address',
            onPress: () => setShowAddressModal(true),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }
    
    // Check if time slot is selected
    if (!selectedTimeSlot) {
      Alert.alert(
        'Time Slot Required',
        'Please select a delivery time slot to proceed with checkout.',
        [
          {
            text: 'Select Time Slot',
            onPress: () => setShowTimeSlotModal(true),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }
    
    // Prepare order data
    const orderData = prepareOrderData({
      address: selectedAddress,
      timeSlot: selectedTimeSlot,
      instructions: deliveryInstructions,
      deliveryCharges: 20, // Fixed delivery charge
      paymentMethod: paymentMethod
    });
    
    if (!orderData) {
      Alert.alert('Error', 'Unable to prepare order data. Please try again.');
      return;
    }
    
    // Log the prepared order data for debugging
    console.log('Prepared Order Data:', JSON.stringify(orderData, null, 2));
    
    // Verify that customerId is present
    if (!orderData.customerId) {
      console.error('customerId is missing from order data');
      Alert.alert('Error', 'Order data is missing required fields. Please try again.');
      return;
    }
    
    try {
      // Create order in Firebase
      const orderId = await CartService.createOrder(orderData);
      
      console.log('Order created successfully with ID:', orderId);
      
      // Navigate to order confirmation screen
      navigation.navigate('OrderConfirmation' as any, { orderId });
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create order. Please try again.');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      setApplyingCoupon(true);
      setCouponError('');
      
      // In a real app, you would validate the coupon with your backend
      // For now, we'll just show a success message if the code is not empty
      const tempCoupon: Coupon = {
        id: 'temp-id',
        code: couponCode,
        name: 'Temporary Coupon',
        title: `${couponCode} Discount`,
        description: 'Temporary discount coupon',
        discountType: 'percentage',
        discountValue: 10, // 10% off as an example
        validFrom: new Date(),
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        isStackable: false,
        minOrderAmount: 0,
        minOrderCount: 1,
        usedCount: 0,
        maxUses: 1000,
      };
      
      const result = await applyCoupon(tempCoupon);
      
      if (result.success) {
        setCouponCode('');
      } else {
        setCouponError(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply coupon';
      setCouponError(errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const renderCouponSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Apply Coupon
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Coupons' as never)}
        >
          <Text style={{ color: theme.colors.primary }}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {appliedCoupon ? (
        <View style={[styles.appliedCouponContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.appliedCouponInfo}>
            <Text style={[styles.appliedCouponCode, { color: theme.colors.text }]}>
              {appliedCoupon.code}
            </Text>
            <Text style={[styles.appliedCouponDiscount, { color: theme.colors.success }]}>
              {appliedCoupon.discountType === 'percentage' 
                ? `${appliedCoupon.discountValue}% off` 
                : `₹${appliedCoupon.discountValue} off`}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.removeCouponButton, { backgroundColor: theme.colors.error }]}
            onPress={removeCoupon}
          >
            <Text style={[styles.removeCouponText, { color: theme.colors.white }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.couponInputContainer}>
          <TextInput
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            style={[styles.couponInput, { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text
            }]}
          />
          <Button
            title="Apply"
            onPress={handleApplyCoupon}
            style={styles.applyButton}
            textStyle={styles.applyButtonText}
            disabled={!couponCode.trim() || applyingCoupon}
          />
        </View>
      )}
      {couponError ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {couponError}
        </Text>
      ) : null}
    </View>
  );

  // Render address selection component
  const renderAddressSelection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Delivery Address
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile' as never)}
        >
          <Text style={{ color: theme.colors.primary }}>Manage</Text>
        </TouchableOpacity>
      </View>
      
      {addressesLoading ? (
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading addresses...
        </Text>
      ) : addresses.length === 0 ? (
        <TouchableOpacity 
          style={[styles.emptyState, { borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('Profile' as never)}
        >
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            No addresses found. Tap to add address.
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.addressCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowAddressModal(true)}
        >
          {selectedAddress ? (
            <>
              <View style={styles.addressHeader}>
                <Text style={[styles.addressName, { color: theme.colors.text }]} numberOfLines={1}>
                  {selectedAddress.name}
                </Text>
                {selectedAddress.isDefault && (
                  <Text style={[styles.defaultBadge, { backgroundColor: theme.colors.primary }]}>
                    Default
                  </Text>
                )}
              </View>
              <Text style={[styles.addressText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {selectedAddress.line1}
                {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}
              </Text>
              <Text style={[styles.addressText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
              </Text>
            </>
          ) : (
            <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
              Select delivery address
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  // Render time slot selection component
  const renderTimeSlotSelection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Delivery Time Slot
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.timeSlotCard, { backgroundColor: theme.colors.surface }]}
        onPress={() => setShowTimeSlotModal(true)}
      >
        {selectedTimeSlot ? (
          <View>
            <Text style={[styles.timeSlotDay, { color: theme.colors.primary }]}>
              {selectedTimeSlot.day}
            </Text>
            <Text style={[styles.timeSlotText, { color: theme.colors.text }]}>
              {selectedTimeSlot.time}
            </Text>
          </View>
        ) : (
          <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
            Select delivery time slot
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.emptyIcon, { fontSize: 64 }]}>🛒</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Your cart is empty
      </Text>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        Add some delicious items to get started!
      </Text>
      <Button
        title="Continue Shopping"
        onPress={() => navigation.navigate('Home' as never)}
        style={{ ...styles.continueButton, backgroundColor: '#754C29' } as any}
      />
    </View>
  );

  // Render address selection modal
  const renderAddressModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddressModal}
      onRequestClose={() => setShowAddressModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Delivery Address
            </Text>
            <TouchableOpacity onPress={() => setShowAddressModal(false)}>
              <Text style={[styles.closeButton, { color: theme.colors.text }]}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            {addresses.map(address => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.modalAddressItem,
                  { 
                    backgroundColor: selectedAddress?.id === address.id 
                      ? theme.colors.primary + '20' 
                      : theme.colors.surface,
                    borderColor: selectedAddress?.id === address.id 
                      ? theme.colors.primary 
                      : theme.colors.border
                  }
                ]}
                onPress={() => {
                  setSelectedAddress(address);
                  setShowAddressModal(false);
                }}
              >
                <View style={styles.modalAddressHeader}>
                  <Text style={[styles.modalAddressName, { color: theme.colors.text }]} numberOfLines={1}>
                    {address.name}
                  </Text>
                  {address.isDefault && (
                    <Text style={[styles.modalDefaultBadge, { backgroundColor: theme.colors.primary }]}>
                      Default
                    </Text>
                  )}
                </View>
                <Text style={[styles.modalAddressText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}
                </Text>
                <Text style={[styles.modalAddressText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                  {address.city}, {address.state} {address.zipCode}
                </Text>
                <Text style={[styles.modalAddressText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                  Phone: {address.phone}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[styles.addAddressButton, { borderColor: theme.colors.primary }]}
              onPress={() => {
                setShowAddressModal(false);
                navigation.navigate('Profile' as never);
              }}
            >
              <Text style={[styles.addAddressText, { color: theme.colors.primary }]}>
                + Add New Address
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Render time slot selection modal
  const renderTimeSlotModal = () => {
    const days = generateNext7Days();
    const timeSlots = generateTimeSlots();
    
    // Filter time slots for the selected day
    const filteredTimeSlots = selectedDayId 
      ? timeSlots.filter((slot: TimeSlot) => slot.dayId === selectedDayId)
      : timeSlots.filter((slot: TimeSlot) => slot.dayId === days[0]?.id);
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTimeSlotModal}
        onRequestClose={() => setShowTimeSlotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Select Delivery Date & Time
              </Text>
              <TouchableOpacity onPress={() => setShowTimeSlotModal(false)}>
                <Text style={[styles.closeButton, { color: theme.colors.text }]}>×</Text>
              </TouchableOpacity>
            </View>
          
            <ScrollView style={styles.modalScrollView}>
              {/* Calendar - Date Selection */}
              <View style={styles.calendarSection}>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.text }]}>
                  Select Date
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScrollView}>
                  {days.map(day => (
                    <TouchableOpacity
                      key={day.id}
                      style={[
                        styles.dayItem,
                        { 
                          backgroundColor: selectedDayId === day.id 
                            ? theme.colors.primary 
                            : theme.colors.surface,
                          borderColor: selectedDayId === day.id 
                            ? theme.colors.primary 
                            : theme.colors.border
                        }
                      ]}
                      onPress={() => setSelectedDayId(day.id)}
                    >
                      <Text style={[
                        styles.dayName, 
                        { color: selectedDayId === day.id ? theme.colors.white : theme.colors.text }
                      ]}>
                        {day.dayName}
                      </Text>
                      <Text style={[
                        styles.dayNumber, 
                        { color: selectedDayId === day.id ? theme.colors.white : theme.colors.text }
                      ]}>
                        {day.dayNumber}
                      </Text>
                      <Text style={[
                        styles.monthName, 
                        { color: selectedDayId === day.id ? theme.colors.white : theme.colors.textSecondary }
                      ]}>
                        {day.monthName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Time Slots for Selected Date */}
              <View style={styles.timeSlotsSection}>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.text }]}>
                  Select Time Slot
                </Text>
                {filteredTimeSlots.length > 0 ? (
                  filteredTimeSlots.map((slot: TimeSlot) => (
                    <TouchableOpacity
                      key={slot.id}
                      style={[
                        styles.calendarTimeSlotItem,
                        { 
                          backgroundColor: selectedTimeSlot?.id === slot.id 
                            ? theme.colors.primary + '20' 
                            : theme.colors.surface,
                          borderColor: selectedTimeSlot?.id === slot.id 
                            ? theme.colors.primary 
                            : theme.colors.border
                        }
                      ]}
                      onPress={() => {
                        setSelectedTimeSlot(slot);
                        setShowTimeSlotModal(false);
                      }}
                    >
                      <Text style={[styles.calendarTimeSlotItemText, { color: theme.colors.text }]}>
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                    No time slots available for this date
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Calculate delivery charges (example: 20 INR flat rate)
  const deliveryCharges = 20;
  
  // Calculate total with delivery charges
  const totalWithDelivery = totalAmount + deliveryCharges;

  // Render cart items at the top
  const renderCartItems = () => (
    <View style={styles.cartItemsContainer}>
      <View style={styles.cartHeader}>
        <Text style={[styles.cartTitle, { color: theme.colors.text }]}>
          Your Order ({totalItems} items)
        </Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={{ color: theme.colors.error }}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {items.length > 0 ? (
        items.map((item, index) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        ))
      ) : null}
    </View>
  );

  // Add this function to render delivery instructions input
  const renderDeliveryInstructions = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Delivery Instructions
        </Text>
      </View>
      
      <RNTextInput
        style={[styles.instructionsInput, { 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text
        }]}
        placeholder="Any special delivery instructions?"
        placeholderTextColor={theme.colors.textSecondary}
        value={deliveryInstructions}
        onChangeText={setDeliveryInstructions}
        multiline
        numberOfLines={3}
      />
    </View>
  );

  // Add this function to render payment method selection
  const renderPaymentMethod = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Payment Method
        </Text>
      </View>
      
      <View style={styles.paymentMethodsContainer}>
        {['UPI', 'Credit Card', 'Debit Card', 'Cash on Delivery'].map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.paymentMethodButton,
              { 
                backgroundColor: paymentMethod === method 
                  ? theme.colors.primary + '20' 
                  : theme.colors.surface,
                borderColor: paymentMethod === method 
                  ? theme.colors.primary 
                  : theme.colors.border
              }
            ]}
            onPress={() => setPaymentMethod(method)}
          >
            <Text style={[styles.paymentMethodText, { color: theme.colors.text }]}>
              {method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {items.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            <FlatList
              data={[{ key: 'cart-items' }]}
              renderItem={() => renderCartItems()}
              keyExtractor={(item) => item.key}
              contentContainerStyle={styles.cartList}
              ListFooterComponent={
                <>
                  {renderCouponSection()}
                  {renderAddressSelection()}
                  {renderTimeSlotSelection()}
                  {renderDeliveryInstructions()} // Add this
                  {renderPaymentMethod()} // Add this
                  
                  <View style={[styles.summary, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                        Subtotal:
                      </Text>
                      <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                        {formatPrice(subtotal)}
                      </Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                        Delivery Charges:
                      </Text>
                      <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                        {formatPrice(20)} {/* Fixed delivery charge */}
                      </Text>
                    </View>
                    
                    {appliedCoupon && (
                      <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                          Discount ({appliedCoupon.code}):
                        </Text>
                        <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                          -{formatPrice(discount)}
                        </Text>
                      </View>
                    )}
                    
                    <View style={[styles.divider, { marginVertical: 8 }]} />
                    
                    <View style={[styles.summaryRow, { marginTop: 4 }]}>
                      <Text style={[styles.summaryLabel, { 
                        fontSize: 18, 
                        fontWeight: 'bold',
                        color: theme.colors.text 
                      }]}>
                        Total:
                      </Text>
                      <Text style={[styles.summaryValue, { 
                        fontSize: 18, 
                        fontWeight: 'bold',
                        color: theme.colors.primary 
                      }]}>
                        {formatPrice(totalAmount + 20)} {/* Total with delivery charges */}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.checkoutButtonContainer}>
                    <Button
                      title={`Proceed to Checkout • ${formatPrice(totalAmount + 20)}`}
                      onPress={handleCheckout}
                      style={styles.checkoutButton}
                    />
                  </View>
                </>
              }
            />
            
            {renderAddressModal()}
            {renderTimeSlotModal()}
          </>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartItemsContainer: {
    paddingHorizontal: 16,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cartList: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  noImageText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotalContainer: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
  },
  appliedCouponContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  appliedCouponInfo: {
    flex: 1,
  },
  appliedCouponCode: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  appliedCouponDiscount: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeCouponButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeCouponText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addressCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  defaultBadge: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  timeSlotCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeSlotDay: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeSlotItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  timeSlotItemText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
  },
  loadingText: {
    textAlign: 'center',
    padding: 16,
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkoutButtonContainer: {
    padding: 16,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledCheckoutButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  continueButton: {
    minWidth: 160,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: '80%',
  },
  modalAddressItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalAddressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalAddressName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  modalDefaultBadge: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalAddressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  addAddressButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Calendar styles
  calendarSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  daysScrollView: {
    flexDirection: 'row',
  },
  dayItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  monthName: {
    fontSize: 10,
    fontWeight: '500',
  },
  
  // Time slots section
  timeSlotsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  calendarTimeSlotItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  calendarTimeSlotItemText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Add these new styles
  instructionsInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  paymentMethodButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 100,
    alignItems: 'center',
  },
  
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500',
  },

});

export default CartScreen;