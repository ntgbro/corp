// src/services/firebase/orderSplitService.ts
import { collection, doc, setDoc, updateDoc, query, where, getDocs } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { CartItem } from '../../types';
import { GeoPoint } from '@react-native-firebase/firestore';
import { addCouponUsage } from '../../utils/userSubcollections';

export interface OrderItemCustomization {
  name: string;
  price: number;
  foodType: string;
  itemId: string;
}

export interface OrderItemLinks {
  menuItemId: string;
  productId: string;
  restaurantId: string;
  warehouseId: string;
  serviceId: string;
}

export interface OrderItemData {
  category: string;
  chefId: string;
  cuisine: string;
  customizations: OrderItemCustomization[];
  links: OrderItemLinks;
  name: string;
  prepTime: string;
  quantity: number;
  status: string;
  totalPrice: number;
  type: string;
  unitPrice: number;
  customerId: string; // Add customerId for security rules
}

export interface PaymentData {
  amount: number;
  failureReason: string;
  gatewayTransactionId: string;
  method: string;
  provider: string;
  refundTransactionId: string;
  status: string;
  timestamp: any;
  transactionId: string;
  customerId: string; // Add customerId for security rules
}

export interface StatusHistoryData {
  status: string;
  timestamp: any;
  notes?: string;
  customerId: string; // Add customerId for security rules
}

export class OrderSplitService {
  /**
   * Split order data and store in multiple collections/subcollections
   */
  static async splitAndStoreOrder(orderData: any): Promise<string> {
    try {
      console.log('Splitting and storing order with data:', JSON.stringify(orderData, null, 2));
      
      // Create main order document and get the orderId
      const orderId = await this.createMainOrder(orderData);
      
      console.log('Main order created with ID:', orderId);
      
      // Create order items in subcollection
      await this.createOrderItems(orderId, orderData);
      
      // Create payment record in subcollection
      await this.createPaymentRecord(orderId, orderData);
      
      // Create status history record in subcollection
      await this.createStatusHistory(orderId, orderData);
      
      // Deactivate user's cart
      await this.deactivateUserCart(orderData.userId || orderData.customerId);
      
      console.log('Order split and stored successfully with ID:', orderId);
      return orderId;
    } catch (error) {
      console.error('Error splitting and storing order:', error);
      throw error;
    }
  }

  static async createOrder(orderData: any): Promise<string> {
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    
    // Create main order document
    const orderId = await this.createMainOrder(orderData);
    
    // Create order items
    await this.createOrderItems(orderId, orderData);
    
    // Create payment record
    await this.createPaymentRecord(orderId, orderData);
    
    // Create status history
    await this.createStatusHistory(orderId, orderData);
    
    // Deactivate user's cart
    await this.deactivateUserCart(orderData.userId || orderData.customerId);
    
    return orderId;
  }

  /**
   * Create main order document in orders collection
   */
  static async createMainOrder(orderData: any): Promise<string> {
    // Generate custom order ID with format "ORD_XXXXXXXXX" (using underscore instead of colon for PhonePe compatibility)
    const timestamp = Date.now().toString();
    const randomPart = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const orderId = `ORD_${timestamp.substring(timestamp.length - 6)}${randomPart.substring(randomPart.length - 3)}`;
    
    const orderRef = doc(db, 'orders', orderId);
    
    // Debug: Log the order data to see what's being passed
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    console.log('Order data userId:', orderData.userId);
    console.log('Order data customerId:', orderData.customerId);
    console.log('Using userId for coupon tracking:', orderData.userId || orderData.customerId);
    
    // Process the delivery address to ensure proper format
    let deliveryAddress = orderData.deliveryAddress;
    if (deliveryAddress) {
      // Ensure all required fields are present with proper defaults
      deliveryAddress = {
        addressId: deliveryAddress.addressId || '',
        contactName: deliveryAddress.contactName || 'Customer',
        contactPhone: deliveryAddress.contactPhone || '',
        line1: deliveryAddress.line1 || '',
        line2: deliveryAddress.line2 || '',
        city: deliveryAddress.city || '',
        pincode: deliveryAddress.pincode || '',
        // Handle geoPoint properly - preserve existing geoPoint or create new one
        geoPoint: deliveryAddress.geoPoint instanceof GeoPoint 
          ? deliveryAddress.geoPoint 
          : deliveryAddress.geoPoint 
            ? new GeoPoint(
                deliveryAddress.geoPoint.latitude || 0, 
                deliveryAddress.geoPoint.longitude || 0
              )
            : new GeoPoint(0, 0),
        saveForFuture: deliveryAddress.saveForFuture || false
      };
    }
    
    // Extract only the fields needed for the main order document
    const orderMainData = {
      actualDeliveryTime: orderData.selectedTimeSlot || orderData.actualDeliveryTime || "25 mins",
      appliedCoupons: orderData.appliedCoupons || [],
      cancellationReason: "None",
      createdAt: new Date(orderData.createdAt),
      deliveryAddress: deliveryAddress,
      deliveryCharges: orderData.deliveryCharges || 0,
      deliveryPartnerId: "", // Add this field
      deliveryType: orderData.deliveryType || "delivery",
      discount: orderData.discount || 0,
      estimatedDeliveryTime: orderData.estimatedDeliveryTime || "30 mins",
      finalAmount: orderData.finalAmount || 0,
      instructions: orderData.instructions || "",
      orderId: orderId,
      paymentMethod: orderData.paymentMethod || "UPI",
      paymentStatus: orderData.paymentStatus || "pending",
      refundAmount: 0, // Add this field
      restaurantId: orderData.restaurantId || "",
      scheduledFor: new Date(orderData.scheduledFor),
      status: orderData.status || "pending",
      taxes: orderData.taxes || 0,
      totalAmount: orderData.totalAmount || 0,
      updatedAt: new Date(orderData.updatedAt),
      userId: orderData.userId || orderData.customerId,
      customerId: orderData.customerId, // Include customerId for security rules
      orderDate: new Date(orderData.createdAt), // Add orderDate field for compatibility
    };
    
    await setDoc(orderRef, orderMainData);
    console.log('Main order document created with ID:', orderId);
    
    // Debug: Log coupon data
    console.log('Applied coupons:', JSON.stringify(orderData.appliedCoupons, null, 2));
    console.log('Applied coupons length:', orderData.appliedCoupons?.length);
    console.log('Applied coupons type:', typeof orderData.appliedCoupons);
    
    // Track coupon usage if coupons were applied
    if (orderData.appliedCoupons && orderData.appliedCoupons.length > 0) {
      console.log('Processing coupon usage tracking for', orderData.appliedCoupons.length, 'coupons');
      for (const coupon of orderData.appliedCoupons) {
        try {
          console.log('Processing coupon:', JSON.stringify(coupon, null, 2));
          console.log('Coupon type:', typeof coupon);
          
          // Extract coupon ID - try multiple possible fields
          const couponId = coupon.id || coupon.couponId || coupon.code || 'unknown';
          console.log('Coupon ID:', couponId);
          
          // Extract discount amount - try multiple possible fields
          const discountAmount = coupon.discountAmount || coupon.appliedDiscount || orderData.discount || 0;
          console.log('Discount amount:', discountAmount);
          
          // Get user ID
          const userId = orderData.userId || orderData.customerId;
          console.log('User ID for coupon tracking:', userId);
          
          // Validate required data
          if (!userId) {
            console.warn('⚠️ Missing user ID for coupon tracking');
            continue;
          }
          
          if (!couponId || couponId === 'unknown') {
            console.warn('⚠️ Missing or invalid coupon ID for coupon tracking');
            continue;
          }
          
          // Additional validation to ensure we have valid data
          if (typeof discountAmount !== 'number' || isNaN(discountAmount)) {
            console.warn('⚠️ Invalid discount amount for coupon tracking:', discountAmount);
            continue;
          }
          
          if (!orderId) {
            console.warn('⚠️ Missing order ID for coupon tracking');
            continue;
          }
          
          // Ensure we have valid data before calling addCouponUsage
          if (userId && couponId && orderId && typeof discountAmount === 'number' && !isNaN(discountAmount)) {
            console.log('Calling addCouponUsage with:', { userId, couponId, orderId, discountAmount });
            await addCouponUsage(
              userId,
              couponId,
              orderId,
              discountAmount
            );
            console.log('✅ Coupon usage record added for coupon:', couponId);
          } else {
            console.warn('⚠️ Missing or invalid required data for coupon tracking - userId:', userId, 'couponId:', couponId, 'orderId:', orderId, 'discountAmount:', discountAmount);
          }
        } catch (error) {
          console.error('Error tracking coupon usage for coupon:', coupon, error);
        }
      }
    } else {
      console.log('No coupons applied to this order');
      // Add additional logging to see why no coupons were applied
      if (orderData.appliedCoupons) {
        console.log('Applied coupons array exists but is empty');
      } else {
        console.log('Applied coupons array is null or undefined');
      }
    }
    
    return orderId;
  }

  /**
   * Create order items in order_items subcollection
   */
  static async createOrderItems(orderId: string, orderData: any): Promise<void> {
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const orderItemRef = doc(collection(db, 'orders', orderId, 'order_items'));
        
        // Determine if this is a restaurant item or warehouse item based on the item itself
        const isRestaurantItem = item.restaurantId && item.restaurantId !== '';
        const isWarehouseItem = item.warehouseId && item.warehouseId !== '';
        const itemType = isRestaurantItem ? 'menu_item' : 'product';
        
        // Get item-specific data
        const restaurantId = item.restaurantId || '';
        const warehouseId = item.warehouseId || '';
        const serviceId = item.serviceId || '';
        
        // Determine the correct IDs based on item type
        let menuItemId = '';
        let productId = '';
        
        // For restaurant items, use the productId as menuItemId
        // For warehouse items, use the productId as productId
        if (isRestaurantItem) {
          menuItemId = item.productId || '';
        } else {
          productId = item.productId || '';
        }
        
        // Build the order item data with only relevant fields
        const orderItemData: OrderItemData = {
          // Use actual category from item if available and not 'Main', otherwise default to 'General'
          category: (item.category && item.category !== 'Main') ? item.category : 'General',
          // Only include chefId for restaurant items
          ...(isRestaurantItem && { chefId: restaurantId }),
          // Only include cuisine for restaurant items
          ...(isRestaurantItem && { cuisine: item.cuisine || 'Indian' }),
          customizations: item.customizations || [],
          links: {
            // Only populate relevant link fields based on item type
            ...(isRestaurantItem && { menuItemId }),
            ...(isWarehouseItem && { productId }),
            ...(isRestaurantItem && { restaurantId }),
            ...(isWarehouseItem && { warehouseId }),
            serviceId: serviceId,
          },
          name: item.name,
          // Only include prepTime for restaurant items
          ...(isRestaurantItem && { prepTime: item.prepTime || '15 mins' }),
          quantity: item.quantity,
          status: 'pending',
          totalPrice: item.price * item.quantity,
          type: itemType,
          unitPrice: item.price,
          // Include customerId for security rules
          customerId: orderData.customerId,
        };
        
        // Remove any undefined or empty string fields to reduce redundancy
        Object.keys(orderItemData).forEach(key => {
          if (orderItemData[key as keyof OrderItemData] === '' || orderItemData[key as keyof OrderItemData] === undefined) {
            delete (orderItemData as any)[key];
          }
        });
        
        // Remove empty links object
        if (orderItemData.links && Object.keys(orderItemData.links).length === 0) {
          delete (orderItemData as any).links;
        }
        
        await setDoc(orderItemRef, orderItemData);
      }
      
      console.log('Order items created successfully for order ID:', orderId);
    }
  }

  /**
   * Create payment record in payment subcollection
   */
  static async createPaymentRecord(orderId: string, orderData: any): Promise<void> {
    const paymentRef = doc(collection(db, 'orders', orderId, 'payment'));
    
    // Determine payment provider based on payment method
    let provider = "UPI";
    if (orderData.paymentMethod === "Cash on Delivery") {
      provider = "Cash";
    } else if (orderData.paymentMethod === "UPI") {
      provider = "PhonePe"; // UPI payments go through PhonePe gateway
    }
    
    const paymentData: PaymentData = {
      amount: orderData.finalAmount || 0,
      failureReason: "",
      gatewayTransactionId: "",
      method: orderData.paymentMethod || "UPI",
      provider: provider,
      refundTransactionId: "",
      status: orderData.paymentStatus || "pending",
      timestamp: new Date(),
      transactionId: "",
      // Include customerId for security rules
      customerId: orderData.customerId,
    };
    
    await setDoc(paymentRef, paymentData);
    console.log('Payment record created successfully for order ID:', orderId);
  }

  /**
   * Create status history record in status_history subcollection
   */
  static async createStatusHistory(orderId: string, orderData: any): Promise<void> {
    const statusHistoryRef = doc(collection(db, 'orders', orderId, 'status_history'));
    
    const statusHistoryData: StatusHistoryData = {
      status: orderData.status || "pending",
      timestamp: new Date(orderData.createdAt),
      notes: `Order created with status: ${orderData.status || "pending"}`,
      // Include customerId for security rules
      customerId: orderData.customerId,
    };

    await setDoc(statusHistoryRef, statusHistoryData);
    console.log('Status history record created successfully for order ID:', orderId);
  }

  /**
   * Deactivate user's current cart
   */
  static async deactivateUserCart(userId: string): Promise<void> {
    try {
      const cartQuery = query(collection(db, 'users', userId, 'cart'), where('status', '==', 'active'));
      const cartSnapshot = await getDocs(cartQuery);
      
      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        await updateDoc(doc(db, 'users', userId, 'cart', cartDoc.id), {
          status: 'inactive',
          usedForOrder: true, // Mark that this cart was used for an order
          updatedAt: new Date(),
        });
        console.log('User cart deactivated successfully');
      }
    } catch (error) {
      console.error('Error deactivating user cart:', error);
      throw error;
    }
  }

  /**
   * Add order to user's order history
   */
  static async addToUserOrderHistory(userId: string, orderData: any, orderId: string): Promise<void> {
    try {
      // Get the user's order_history document
      const orderHistoryQuery = query(collection(db, 'users', userId, 'order_history'));
      const orderHistorySnapshot = await getDocs(orderHistoryQuery);
      
      let orderHistoryDocRef;
      let orderHistoryData;
      
      if (!orderHistorySnapshot.empty) {
        // Use existing order_history document
        orderHistoryDocRef = orderHistorySnapshot.docs[0].ref;
        orderHistoryData = orderHistorySnapshot.docs[0].data();
      } else {
        // Create new order_history document
        orderHistoryDocRef = doc(collection(db, 'users', userId, 'order_history'));
        orderHistoryData = {
          orders: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      
      // Add the new order to the orders array with more detailed information
      const updatedOrders = [
        ...(orderHistoryData.orders || []),
        {
          id: orderId,
          orderId: orderId,
          status: orderData.status || 'pending',
          amount: orderData.finalAmount || 0,
          itemCount: orderData.items ? orderData.items.reduce((total: number, item: any) => total + item.quantity, 0) : 0,
          deliveryAddress: orderData.deliveryAddress || {},
          createdAt: new Date(orderData.createdAt),
          estimatedDeliveryTime: orderData.estimatedDeliveryTime || "30 mins",
        }
      ];
      
      // Update the order_history document
      await setDoc(orderHistoryDocRef, {
        ...orderHistoryData,
        orders: updatedOrders,
        updatedAt: new Date(),
      }, { merge: true });
      
      console.log('Order added to user order history successfully');
    } catch (error) {
      console.error('Error adding order to user history:', error);
      throw error;
    }
  }
}