// src/services/firebase/orderSplitService.ts
import { collection, doc, setDoc, updateDoc, query, where, getDocs } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { CartItem } from '../../types';

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
   * Split order data and store in appropriate collections and subcollections
   */
  static async splitAndStoreOrder(orderData: any): Promise<string> {
    try {
      console.log('Splitting and storing order with data:', JSON.stringify(orderData, null, 2));
      
      // Create main order document
      const orderId = await this.createMainOrder(orderData);
      
      // Add a delay to ensure the main document is created before subcollections
      // Increased delay to ensure Firestore has time to propagate the document creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create order items in subcollection
      await this.createOrderItems(orderId, orderData);
      
      // Create payment record in subcollection
      await this.createPaymentRecord(orderId, orderData);
      
      // Create status history record in subcollection
      await this.createStatusHistory(orderId, orderData);
      
      // Add order to user's order history
      await this.addToUserOrderHistory(orderData.customerId, orderData, orderId);
      
      // Deactivate user's cart
      await this.deactivateUserCart(orderData.customerId);
      
      console.log('Order split and stored successfully with ID:', orderId);
      return orderId;
    } catch (error) {
      console.error('Error splitting and storing order:', error);
      throw error;
    }
  }

  /**
   * Create main order document in orders collection
   */
  static async createMainOrder(orderData: any): Promise<string> {
    const orderRef = doc(collection(db, 'orders'));
    const orderId = orderRef.id;
    
    // Process the delivery address to ensure proper GeoPoint format
    let deliveryAddress = orderData.deliveryAddress;
    if (deliveryAddress && deliveryAddress.geoPoint) {
      // If geoPoint is already in the correct format, use it as is
      // Otherwise, we might need to convert it
      deliveryAddress = {
        ...deliveryAddress,
        // We'll keep the geoPoint as is for now
      };
    }
    
    // Extract only the fields needed for the main order document
    const orderMainData = {
      actualDeliveryTime: orderData.actualDeliveryTime || "25 mins",
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
      items: orderData.items || [], // Include items array
      orderId: orderId,
      paymentMethod: orderData.paymentMethod || "UPI",
      paymentStatus: orderData.paymentStatus || "pending",
      refundAmount: 0, // Add this field
      restaurantId: orderData.restaurantId || "",
      scheduledFor: new Date(orderData.scheduledFor),
      status: orderData.status || "pending",
      taxes: orderData.taxes || 0,
      totalAmount: orderData.totalAmount || 0,
      type: orderData.type || "restaurant",
      updatedAt: new Date(orderData.updatedAt),
      userId: orderData.userId || orderData.customerId,
      warehouseId: orderData.warehouseId || "",
      customerId: orderData.customerId, // Include customerId for security rules
      orderDate: new Date(orderData.createdAt), // Add orderDate field for compatibility
    };
    
    await setDoc(orderRef, orderMainData);
    console.log('Main order document created with ID:', orderId);
    return orderId;
  }

  /**
   * Create order items in order_items subcollection
   */
  static async createOrderItems(orderId: string, orderData: any): Promise<void> {
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const orderItemRef = doc(collection(db, 'orders', orderId, 'order_items'));
        
        // Determine item type and related fields
        const itemType = orderData.type === 'restaurant' ? 'menu_item' : 'product';
        const chefId = item.chefId || '';
        const restaurantId = orderData.restaurantId || '';
        const warehouseId = orderData.warehouseId || '';
        
        // Create customizations array with the exact structure you provided
        const customizations: OrderItemCustomization[] = [
          {
            name: "Extra Cheese",
            price: 2,
            foodType: "Veg",
            itemId: "item456"
          }
        ];
        
        const orderItemData: OrderItemData = {
          category: "Main",
          chefId: chefId,
          cuisine: "Italian",
          customizations: customizations,
          links: {
            menuItemId: itemType === 'menu_item' ? item.id : '',
            productId: item.productId,
            restaurantId: restaurantId,
            warehouseId: warehouseId,
          },
          name: item.name,
          prepTime: "15 mins",
          quantity: item.quantity,
          status: "pending",
          totalPrice: item.price * item.quantity,
          type: itemType,
          unitPrice: item.price,
          // Include customerId for security rules
          customerId: orderData.customerId,
        };
        
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
    
    const paymentData: PaymentData = {
      amount: orderData.finalAmount || 0,
      failureReason: "",
      gatewayTransactionId: "",
      method: orderData.paymentMethod || "UPI",
      provider: orderData.paymentMethod === "Cash on Delivery" ? "Cash" : (orderData.paymentMethod || "UPI"),
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
      notes: "Order created",
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
      
      // Add the new order to the orders array
      const updatedOrders = [
        ...(orderHistoryData.orders || []),
        {
          id: orderId,
          orderId: orderId,
          status: orderData.status || 'pending',
          amount: orderData.finalAmount || 0,
          items: orderData.items || [],
          createdAt: new Date(orderData.createdAt),
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
      console.error('Error adding order to user order history:', error);
      throw error;
    }
  }
}
