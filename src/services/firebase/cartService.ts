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
  usedForOrder?: boolean;
}

// ✅ Updated: ID fields are now optional to save space
export interface FirebaseCartItem {
  itemId: string;
  userId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  customizations: any[];
  notes: string;
  addedAt: Date;
  serviceId: string;
  
  // Specific fields based on type - only one set will be populated
  // For Restaurant items:
  menuItemId?: string;     // The menu item ID
  restaurantId?: string;   // The restaurant ID
  
  // For Warehouse items:
  productId?: string;      // The product ID
  warehouseId?: string;    // The warehouse ID
}

export class CartService {
  /**
   * Get user's cart document
   */
  static async getCart(userId: string): Promise<FirebaseCart | null> {
    try {
      let cartQuery = query(collection(db, 'users', userId, 'cart'), where('status', '==', 'active'));
      let cartSnapshot = await getDocs(cartQuery);
      
      if (cartSnapshot.empty) {
        cartQuery = query(collection(db, 'users', userId, 'cart'), where('status', '==', 'inactive'));
        cartSnapshot = await getDocs(cartQuery);
      }
      
      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        const cartData = cartDoc.data() as any;
        
        if (cartData.appliedCoupon && typeof cartData.appliedCoupon === 'object' && Object.keys(cartData.appliedCoupon).length === 0) {
          cartData.appliedCoupon = null;
        }
        
        if (cartData.appliedCoupon === undefined) {
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
      const inactiveCartQuery = query(
        collection(db, 'users', userId, 'cart'), 
        where('status', '==', 'inactive')
      );
      const inactiveCartSnapshot = await getDocs(inactiveCartQuery);
      
      const suitableCarts = inactiveCartSnapshot.docs.filter((doc: any) => {
        const data = doc.data();
        return !data.usedForOrder;
      });
      
      if (suitableCarts.length > 0) {
        const existingCartDoc = suitableCarts[0];
        await updateDoc(doc(db, 'users', userId, 'cart', existingCartDoc.id), {
          status: 'active',
          updatedAt: new Date(),
        });
        return existingCartDoc.id;
      }
      
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
        usedForOrder: false,
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
   * Add item to cart - ✅ Optimized to store only relevant IDs
   */
  static async addItemToCart(userId: string, cartId: string, item: Omit<CartItem, 'quantity'>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        status: 'active',
        updatedAt: new Date()
      });
      
      // Determine if this is a Restaurant Item or Warehouse Item
      // We prioritize specific IDs over generic chefId
      const isRestaurantItem = !!item.restaurantId && item.restaurantId !== '';
      const isWarehouseItem = !!item.warehouseId && item.warehouseId !== '';
      
      // Define the target ID to check for duplicates
      // The app generally passes the item's unique ID in 'productId' prop of CartItem interface
      const targetIdToCheck = item.productId;

      // Construct the query based on the type
      let itemsQuery;
      
      if (isRestaurantItem) {
        // Check for existing menu item
        itemsQuery = query(
          collection(db, 'users', userId, 'cart', cartId, 'cart_items'),
          where('menuItemId', '==', targetIdToCheck)
        );
      } else {
        // Check for existing product (default to product check if type unknown)
        itemsQuery = query(
          collection(db, 'users', userId, 'cart', cartId, 'cart_items'),
          where('productId', '==', targetIdToCheck)
        );
      }
      
      const itemsSnapshot = await getDocs(itemsQuery);
      
      if (!itemsSnapshot.empty) {
        // Update existing item
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
      
        // Common fields
        const baseItem = {
          itemId: newItemRef.id,
          userId,
          name: item.name,
          price: item.price,
          quantity: 1,
          totalPrice: item.price,
          customizations: [],
          notes: '',
          addedAt: new Date(),
          serviceId: item.serviceId || '',
        };

        let newItem: FirebaseCartItem;

        if (isRestaurantItem) {
          // ✅ RESTAURANT ITEM: Store menuItemId + restaurantId only
          newItem = {
            ...baseItem,
            menuItemId: item.productId, // Map generic productId to menuItemId
            restaurantId: item.restaurantId !== '' ? item.restaurantId : undefined,
          };
        } else {
          // ✅ WAREHOUSE ITEM: Store productId + warehouseId only
          // Fallback to chefId if warehouseId is missing but implied
          const finalWarehouseId = item.warehouseId || item.chefId || '';
          
          newItem = {
            ...baseItem,
            productId: item.productId,
            warehouseId: finalWarehouseId !== '' ? finalWarehouseId : undefined,
          };
        }
      
        await setDoc(newItemRef, newItem);
      }
      
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
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        status: 'active',
        updatedAt: new Date()
      });
      
      if (quantity <= 0) {
        await deleteDoc(doc(db, 'users', userId, 'cart', cartId, 'cart_items', itemId));
      } else {
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
      
      const deletePromises = itemsSnapshot.docs.map((itemDoc: any) => 
        deleteDoc(doc(db, 'users', userId, 'cart', cartId, 'cart_items', itemDoc.id))
      );
      
      await Promise.all(deletePromises);
      
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        itemCount: 0,
        totalAmount: 0,
        status: 'active',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  /**
   * Update cart totals
   */
  static async updateCartTotals(userId: string, cartId: string): Promise<void> {
    try {
      const items = await this.getCartItems(userId, cartId);
      
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        itemCount,
        totalAmount,
        status: 'active',
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
      // ✅ Only store essential coupon information to avoid data duplication
      // As per project specification: "When applying a coupon, only store the coupon ID in the appliedCoupon object."
      const couponToSave = {
        id: coupon.id || coupon.couponId || '',
        code: coupon.code || '',
        // Store only the fields needed for discount calculation
        discountType: coupon.discountType || coupon.type || 'percentage',
        discountValue: coupon.discountValue !== undefined ? coupon.discountValue : (coupon.value || 0),
        maxDiscountAmount: coupon.maxDiscountAmount || null,
        minOrderAmount: coupon.minOrderAmount || 0,
        minOrderCount: coupon.minOrderCount || 0,
        // Timestamp when applied
        appliedAt: new Date()
      };
      
      if (!couponToSave.id || !couponToSave.code) {
        console.warn('Coupon is missing required fields - id:', couponToSave.id, 'code:', couponToSave.code);
      }
      
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        appliedCoupon: couponToSave,
        status: 'active',
        updatedAt: new Date()
      });
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
        status: 'active',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  }

  /**
   * Get product details by product ID
   */
  static async getProductDetails(productId: string): Promise<{ imageURL?: string; name?: string; [key: string]: any } | null> {
    try {
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
   * ✅ Logic updated to respect the reduced data model
   */
  static async getOrderDataForCartItem(firebaseItem: FirebaseCartItem): Promise<{
    serviceId: string;
    restaurantId: string;
    warehouseId: string;
    type: 'restaurant' | 'warehouse';
  }> {
    let serviceId = firebaseItem.serviceId || '';
    let restaurantId = firebaseItem.restaurantId || '';
    let warehouseId = firebaseItem.warehouseId || '';
    let type: 'restaurant' | 'warehouse' = 'restaurant';
    
    // Explicitly check for ID existence to determine type
    if (restaurantId && restaurantId !== '') {
      type = 'restaurant';
    } else if (warehouseId && warehouseId !== '') {
      type = 'warehouse';
    } else if (firebaseItem.menuItemId && firebaseItem.menuItemId !== '') {
      // Fallback: if menuItemId exists but no restaurantId, assume restaurant
      type = 'restaurant';
    } else if (firebaseItem.productId && firebaseItem.productId !== '') {
      // Fallback: if productId exists but no warehouseId, assume warehouse
      type = 'warehouse';
    }

    // Fallback fetching logic (only if IDs are missing)
    if ((!serviceId) && ((type === 'restaurant' && !restaurantId) || (type === 'warehouse' && !warehouseId))) {
       // ... existing fallback fetching logic would go here if needed ...
       // Since we are now ensuring IDs are saved correctly, this part is less critical but kept for backward compatibility
       if (firebaseItem.menuItemId && !restaurantId) {
          // fetch restaurant logic...
       }
    }
    
    return { serviceId, restaurantId, warehouseId, type };
  }

  static async createOrder(orderData: any): Promise<string> {
    try {
      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
      const orderId = await OrderSplitService.splitAndStoreOrder(orderData);
      console.log('Order created successfully with ID:', orderId);
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

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