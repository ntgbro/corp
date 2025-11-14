// src/services/firebase/orderSplitService.ts
import { collection, doc, setDoc, updateDoc, query, where, getDocs } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { CartItem } from '../../types';
import { GeoPoint } from '@react-native-firebase/firestore';

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
      
      // Create main order document
      const orderId = await this.createMainOrder(orderData);
      
      // Create order items in subcollection
      await this.createOrderItems(orderId, orderData);
      
      // Create payment record in subcollection
      await this.createPaymentRecord(orderId, orderData);
      
      // Create status history record in subcollection
      await this.createStatusHistory(orderId, orderData);
      
      // Add to user's order history
      await this.addToUserOrderHistory(orderData.userId || orderData.customerId, orderData, orderId);
      
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
      serviceId: orderData.serviceId || "",
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
        const serviceId = orderData.serviceId || '';
        
        // Use actual item data instead of hardcoded values
        // Determine the correct IDs based on item type
        let menuItemId = '';
        let productId = '';
        
        // For restaurant orders, use the productId as menuItemId
        // For warehouse orders, use the productId as productId
        if (itemType === 'menu_item') {
          menuItemId = item.productId || '';
        } else {
          productId = item.productId || '';
        }
        
        const orderItemData: OrderItemData = {
          category: item.category || "Main",
          chefId: chefId,
          cuisine: item.cuisine || "Indian",
          customizations: item.customizations || [],
          links: {
            menuItemId: menuItemId,
            productId: productId,
            restaurantId: restaurantId,
            warehouseId: warehouseId,
            serviceId: serviceId,
          },
          name: item.name,
          prepTime: item.prepTime || "15 mins",
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
    
    // Determine payment provider based on payment method
    let provider = "UPI";
    if (orderData.paymentMethod === "Cash on Delivery") {
      provider = "Cash";
    } else if (orderData.paymentMethod === "Credit Card" || orderData.paymentMethod === "Debit Card") {
      provider = "Card";
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
          items: orderData.items || [],
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