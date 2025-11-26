import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { CartItem } from '../../types';
import { OrderSplitService } from './orderSplitService';

export interface FirebaseCart {
  cartId: string;
  userId: string;
  itemCount: number;
  totalAmount: number;
  status: string;
  deliveryType: string;
  appliedCoupon: any;
  addedAt: Date;
  updatedAt: Date;
  usedForOrder?: boolean; // Add this field
}

export interface FirebaseCartItem {
  itemId: string;
  userId: string;
  productId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  customizations: any[];
  notes: string;
  addedAt: Date;
  serviceId: string;
  restaurantId: string;
  warehouseId: string;
}

export class CartService {
  /**
   * Get user's cart document
   */
  static async getCart(userId: string): Promise<FirebaseCart | null> {
    try {
      // First try to get an active cart
      let cartQuery = query(collection(db, 'users', userId, 'cart'), where('status', '==', 'active'));
      let cartSnapshot = await getDocs(cartQuery);
      
      // If no active cart found, try to get an inactive cart
      if (cartSnapshot.empty) {
        cartQuery = query(collection(db, 'users', userId, 'cart'), where('status', '==', 'inactive'));
        cartSnapshot = await getDocs(cartQuery);
      }
      
      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        const cartData = cartDoc.data() as any; // Cast to any to avoid type issues
        
        // Log the applied coupon data for debugging
        // console.log('Applied coupon data from Firebase:', cartData.appliedCoupon);
        // console.log('Applied coupon type:', typeof cartData.appliedCoupon);
        // console.log('Applied coupon keys:', cartData.appliedCoupon ? Object.keys(cartData.appliedCoupon) : 'null');
        
        // Check if appliedCoupon is actually null or an empty object
        if (cartData.appliedCoupon && typeof cartData.appliedCoupon === 'object' && Object.keys(cartData.appliedCoupon).length === 0) {
          // console.log('Applied coupon is an empty object, treating as null');
          cartData.appliedCoupon = null;
        }
        
        // Check if appliedCoupon is actually null or undefined
        if (cartData.appliedCoupon === undefined) {
          // console.log('Applied coupon is undefined, treating as null');
          cartData.appliedCoupon = null;
        }
        
        return { 
          cartId: cartDoc.id, 
          ...cartData 
        } as FirebaseCart;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cart:', error);
      return null;
    }
  }

  /**
   * Create a new cart for the user
   */
  static async createCart(userId: string): Promise<string> {
    try {
      // First check if there's an existing inactive cart we can reactivate
      // But skip carts that were used for orders
      const inactiveCartQuery = query(
        collection(db, 'users', userId, 'cart'), 
        where('status', '==', 'inactive')
      );
      const inactiveCartSnapshot = await getDocs(inactiveCartQuery);
      
      // Filter out carts that were used for orders
      const suitableCarts = inactiveCartSnapshot.docs.filter((doc: any) => {
        const data = doc.data();
        return !data.usedForOrder; // Only consider carts that weren't used for orders
      });
      
      if (suitableCarts.length > 0) {
        // Reactivate the first suitable inactive cart
        const existingCartDoc = suitableCarts[0];
        await updateDoc(doc(db, 'users', userId, 'cart', existingCartDoc.id), {
          status: 'active',
          updatedAt: new Date(),
        });
        return existingCartDoc.id;
      }
      
      // If no suitable inactive cart found, create a new one
      const cartRef = doc(collection(db, 'users', userId, 'cart'));
      const cartData: Omit<FirebaseCart, 'cartId'> = {
        userId,
        itemCount: 0,
        totalAmount: 0,
        status: 'active',
        deliveryType: 'delivery',
        appliedCoupon: null,
        addedAt: new Date(),
        updatedAt: new Date(),
        usedForOrder: false, // Add this field for consistency
      };
      
      await setDoc(cartRef, { ...cartData, cartId: cartRef.id });
      return cartRef.id;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  /**
   * Get cart items for a user
   */
  static async getCartItems(userId: string, cartId: string): Promise<FirebaseCartItem[]> {
    try {
      const itemsSnapshot = await getDocs(collection(db, 'users', userId, 'cart', cartId, 'cart_items'));
      return itemsSnapshot.docs.map((doc: any) => ({
        itemId: doc.id,
        ...doc.data()
      } as FirebaseCartItem));
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  /**
   * Add item to cart
   */
  static async addItemToCart(userId: string, cartId: string, item: Omit<CartItem, 'quantity'>): Promise<void> {
    try {
      // Ensure the cart is active
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        status: 'active',
        updatedAt: new Date()
      });
      
      // Check if item already exists in cart
      // For restaurant items, check menuItemId; for warehouse items, check productId
      const itemsQuery = query(
        collection(db, 'users', userId, 'cart', cartId, 'cart_items'),
        where(item.chefId && item.chefId !== '' ? 'menuItemId' : 'productId', '==', item.productId)
      );
      
      const itemsSnapshot = await getDocs(itemsQuery);
      
      if (!itemsSnapshot.empty) {
        // Update existing item quantity
        const existingItem = itemsSnapshot.docs[0];
        const existingData = existingItem.data() as FirebaseCartItem;
        const newQuantity = existingData.quantity + 1;
        const newTotalPrice = newQuantity * existingData.price;
      
        await updateDoc(doc(db, 'users', userId, 'cart', cartId, 'cart_items', existingItem.id), {
          quantity: newQuantity,
          totalPrice: newTotalPrice,
          updatedAt: new Date()
        });
      } else {
        // Add new item
        const newItemRef = doc(collection(db, 'users', userId, 'cart', cartId, 'cart_items'));
      
        const newItem: FirebaseCartItem = {
          itemId: newItemRef.id,
          userId,
          // For restaurant menu items, use menuItemId; for warehouse products, use productId
          // We'll determine this based on the chefId - if it's a restaurant ID, it's a menu item
          productId: item.chefId && item.chefId !== '' ? '' : item.productId,
          menuItemId: item.chefId && item.chefId !== '' ? item.productId : '',
          name: item.name,
          price: item.price,
          quantity: 1,
          totalPrice: item.price,
          customizations: [],
          notes: '',
          addedAt: new Date(),
          serviceId: item.serviceId || '', // These will now be required in the CartItem interface
          restaurantId: item.restaurantId || '', // but we still provide fallbacks for safety
          warehouseId: item.warehouseId || ''
        };
      
        await setDoc(newItemRef, newItem);
      }
      
      // Update cart totals
      await this.updateCartTotals(userId, cartId);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  /**
   * Update item quantity in cart
   */
  static async updateItemQuantity(userId: string, cartId: string, itemId: string, quantity: number): Promise<void> {
    try {
      // Ensure the cart is active
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        status: 'active',
        updatedAt: new Date()
      });
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        await deleteDoc(doc(db, 'users', userId, 'cart', cartId, 'cart_items', itemId));
      } else {
        // Update item quantity
        const itemRef = doc(db, 'users', userId, 'cart', cartId, 'cart_items', itemId);
        const itemDoc = await getDoc(itemRef);
        
        if (itemDoc.exists()) {
          const itemData = itemDoc.data() as FirebaseCartItem;
          const newTotalPrice = quantity * itemData.price;
          
          await updateDoc(itemRef, {
            quantity,
            totalPrice: newTotalPrice,
            updatedAt: new Date()
          });
        }
      }
      
      // Update cart totals
      await this.updateCartTotals(userId, cartId);
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  static async removeItemFromCart(userId: string, cartId: string, itemId: string): Promise<void> {
    try {
      // Ensure the cart is active
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        status: 'active',
        updatedAt: new Date()
      });
      
      await deleteDoc(doc(db, 'users', userId, 'cart', cartId, 'cart_items', itemId));
      await this.updateCartTotals(userId, cartId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }

  /**
   * Clear all items from cart
   */
  static async clearCart(userId: string, cartId: string): Promise<void> {
    try {
      const itemsSnapshot = await getDocs(collection(db, 'users', userId, 'cart', cartId, 'cart_items'));
      
      // Delete all items
      const deletePromises = itemsSnapshot.docs.map((itemDoc: any) => 
        deleteDoc(doc(db, 'users', userId, 'cart', cartId, 'cart_items', itemDoc.id))
      );
      
      await Promise.all(deletePromises);
      
      // Update cart totals
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        itemCount: 0,
        totalAmount: 0,
        status: 'active', // Ensure cart remains active
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  /**
   * Update cart totals (itemCount and totalAmount)
   */
  static async updateCartTotals(userId: string, cartId: string): Promise<void> {
    try {
      const items = await this.getCartItems(userId, cartId);
      
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        itemCount,
        totalAmount,
        status: 'active', // Ensure cart remains active
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating cart totals:', error);
      throw error;
    }
  }

  /**
   * Apply coupon to cart
   */
  static async applyCoupon(userId: string, cartId: string, coupon: any): Promise<void> {
    try {
      console.log('Applying coupon in CartService:', coupon);
      console.log('Coupon type:', typeof coupon);
      console.log('Coupon keys:', Object.keys(coupon));
      
      // Ensure the coupon object has the required structure
      const couponToSave = {
        ...coupon,
        // Make sure we have the essential fields
        id: coupon.id || coupon.couponId || '',
        code: coupon.code || '',
        appliedAt: new Date()
      };
      
      console.log('Coupon to save:', couponToSave);
      
      // Check if couponToSave has the required fields
      if (!couponToSave.id || !couponToSave.code) {
        console.warn('Coupon is missing required fields - id:', couponToSave.id, 'code:', couponToSave.code);
      }
      
      // Ensure the cart is active before applying the coupon
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        appliedCoupon: couponToSave,
        status: 'active', // Ensure cart is active when applying coupon
        updatedAt: new Date()
      });
      
      console.log('Successfully applied coupon to Firebase cart');
      
      // Verify the coupon was saved by reading it back
      const cartDoc = await getDoc(doc(db, 'users', userId, 'cart', cartId));
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        if (cartData) {
          console.log('Verified saved coupon:', cartData.appliedCoupon);
          console.log('Verified saved coupon type:', typeof cartData.appliedCoupon);
          console.log('Verified saved coupon keys:', cartData.appliedCoupon ? Object.keys(cartData.appliedCoupon) : 'null');
        }
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }

  /**
   * Remove coupon from cart
   */
  static async removeCoupon(userId: string, cartId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        appliedCoupon: null,
        status: 'active', // Ensure cart remains active
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  }

  /**
   * Get product details by product ID
   * This method fetches product information including image URL
   */
  static async getProductDetails(productId: string): Promise<{ imageURL?: string; name?: string; [key: string]: any } | null> {
    try {
      // Try to get product from restaurants first (Fresh service)
      const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
      for (const restaurantDoc of restaurantsSnapshot.docs) {
        const menuItemRef = doc(db, 'restaurants', restaurantDoc.id, 'menu_items', productId);
        const menuItemDoc = await getDoc(menuItemRef);
        
        if (menuItemDoc.exists()) {
          const data = menuItemDoc.data();
          if (data) {
            return {
              imageURL: data.mainImageURL || data.imageURL,
              name: data.name,
              ...data
            };
          }
        }
      }
      
      // If not found in restaurants, try warehouses (FMCG/Supplies services)
      const warehousesSnapshot = await getDocs(collection(db, 'warehouses'));
      for (const warehouseDoc of warehousesSnapshot.docs) {
        const productRef = doc(db, 'warehouses', warehouseDoc.id, 'products', productId);
        const productDoc = await getDoc(productRef);
        
        if (productDoc.exists()) {
          const data = productDoc.data();
          if (data) {
            return {
              imageURL: data.mainImageURL || data.imageURL,
              name: data.name,
              ...data
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  }

  /**
   * Get order-related data for a cart item
   * This method extracts serviceId, restaurantId, and warehouseId from a cart item
   */
  static async getOrderDataForCartItem(firebaseItem: FirebaseCartItem): Promise<{
    serviceId: string;
    restaurantId: string;
    warehouseId: string;
    type: 'restaurant' | 'warehouse';
  }> {
    // Since we've made these fields required, we can use them directly
    // but we still provide fallback logic for safety
    let serviceId = firebaseItem.serviceId || '';
    let restaurantId = firebaseItem.restaurantId || '';
    let warehouseId = firebaseItem.warehouseId || '';
    let type: 'restaurant' | 'warehouse' = 'restaurant'; // Default to restaurant
    
    // If the IDs weren't stored in the cart item, fetch them from the source
    // This is fallback logic for backward compatibility
    if ((!serviceId || serviceId === '') || (!restaurantId || restaurantId === '') || (!warehouseId || warehouseId === '')) {
      if (firebaseItem.restaurantId && firebaseItem.restaurantId !== '') {
        restaurantId = firebaseItem.restaurantId;
        type = 'restaurant';
        // Fetch restaurant data to get serviceId if not already present
        if (!serviceId || serviceId === '') {
          try {
            const restaurantRef = doc(db, 'restaurants', firebaseItem.restaurantId);
            const restaurantSnap = await getDoc(restaurantRef);
            if (restaurantSnap.exists()) {
              const restaurantData: any = restaurantSnap.data();
              serviceId = restaurantData.serviceId || restaurantData.serviceIds?.[0] || '';
            }
          } catch (error) {
            console.error('Error fetching restaurant data:', error);
          }
        }
      } else if (firebaseItem.warehouseId && firebaseItem.warehouseId !== '') {
        warehouseId = firebaseItem.warehouseId;
        type = 'warehouse';
        // For warehouses, serviceId would be determined based on the service type
        if (!serviceId || serviceId === '') {
          serviceId = 'fmcg'; // Default serviceId for warehouses
        }
      } else if (firebaseItem.menuItemId && firebaseItem.menuItemId !== '') {
        // For restaurant items, the menuItemId might contain the restaurant ID
        restaurantId = firebaseItem.menuItemId;
        type = 'restaurant';
        // Fetch restaurant data to get serviceId if not already present
        if (!serviceId || serviceId === '') {
          try {
            const restaurantRef = doc(db, 'restaurants', firebaseItem.menuItemId);
            const restaurantSnap = await getDoc(restaurantRef);
            if (restaurantSnap.exists()) {
              const restaurantData: any = restaurantSnap.data();
              serviceId = restaurantData.serviceId || restaurantData.serviceIds?.[0] || '';
            }
          } catch (error) {
            console.error('Error fetching restaurant data:', error);
          }
        }
      }
    }
    
    return { serviceId, restaurantId, warehouseId, type };
  }

  /**
   * Create a new order in Firebase
   * This method creates an order document in the orders collection
   */
  static async createOrder(orderData: any): Promise<string> {
    try {
      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
      
      // Use the new OrderSplitService to handle the order creation
      const orderId = await OrderSplitService.splitAndStoreOrder(orderData);
      
      console.log('Order created successfully with ID:', orderId);
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}
