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
  restaurantId: string;
  serviceId: string;
  warehouseId: string;
  addedAt: Date;
  updatedAt: Date;
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
}

export class CartService {
  /**
   * Get user's cart document
   */
  static async getCart(userId: string): Promise<FirebaseCart | null> {
    try {
      const cartQuery = query(collection(db, 'users', userId, 'cart'), where('status', '==', 'active'));
      const cartSnapshot = await getDocs(cartQuery);
      
      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        return { cartId: cartDoc.id, ...cartDoc.data() } as FirebaseCart;
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
      const cartRef = doc(collection(db, 'users', userId, 'cart'));
      const cartData: Omit<FirebaseCart, 'cartId'> = {
        userId,
        itemCount: 0,
        totalAmount: 0,
        status: 'active',
        deliveryType: 'delivery',
        appliedCoupon: {},
        restaurantId: '',
        serviceId: '',
        warehouseId: '',
        addedAt: new Date(),
        updatedAt: new Date(),
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
      // Check if item already exists in cart
      const itemsQuery = query(
        collection(db, 'users', userId, 'cart', cartId, 'cart_items'),
        where('productId', '==', item.productId)
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
          productId: item.productId,
          menuItemId: item.chefId || '',
          name: item.name,
          price: item.price,
          quantity: 1,
          totalPrice: item.price,
          customizations: [],
          notes: '',
          addedAt: new Date()
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
      await updateDoc(doc(db, 'users', userId, 'cart', cartId), {
        appliedCoupon: coupon,
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
        appliedCoupon: {},
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
              imageURL: data.imageURL,
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
