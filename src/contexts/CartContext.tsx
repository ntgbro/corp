import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { Coupon, AppliedCoupon } from '../types/coupon';
import { CartService } from '../services/firebase/cartService';
import { useAuth } from './AuthContext';
import { CartItem as FirebaseCartItem } from '../types'; // Import the CartItem type from types

// Define our local CartItem type that matches what we're using in the context
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  chefId: string;
  chefName: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
  appliedCoupon: AppliedCoupon | null;
}

// Add new interface for order data preparation
export interface OrderData {
  // Cart information
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  appliedCoupons: any[];
  
  // Delivery information
  deliveryAddress: {
    addressId?: string;
    contactName?: string;
    contactPhone?: string;
    line1: string;
    line2?: string;
    city: string;
    pincode: string;
    geoPoint?: {
      latitude: number;
      longitude: number;
    };
    saveForFuture?: boolean;
  };
  
  // Time slot information
  scheduledFor: Date;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  
  // Additional information
  instructions?: string;
  deliveryCharges: number;
  taxes: number;
  finalAmount: number;
  
  // User information
  customerId: string; // Add this field for Firestore rules
  userId: string;
  restaurantId?: string;
  warehouseId?: string;
  type: 'restaurant' | 'warehouse';
  
  // Metadata
  status: 'pending';
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'SET_CART_ITEMS'; payload: { items: CartItem[]; appliedCoupon: AppliedCoupon | null } }; // Add this new action type

interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  applyCoupon: (coupon: Coupon) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  calculateDiscount: (coupon: Coupon, subtotal: number) => number;
  syncWithFirebase: () => Promise<void>;
  loadCartFromFirebase: () => Promise<void>;
  // Add new method for preparing order data
  prepareOrderData: (deliveryInfo: {
    address: any;
    timeSlot: any;
    instructions?: string;
    deliveryCharges?: number;
    paymentMethod?: string;
  }) => OrderData | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateDiscount = (coupon: Coupon, subtotal: number, items: CartItem[] = []): number => {
  if (!coupon || !coupon.isActive) return 0;
  
  // Check minimum order amount
  if (subtotal < (coupon.minOrderAmount || 0)) {
    return 0;
  }
  
  // Check minimum order count (number of items)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems < (coupon.minOrderCount || 0)) {
    return 0;
  }
  
  // Check validity period
  const now = new Date();
  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    return 0;
  }
  if ((coupon.validTill || coupon.validUntil) && new Date(coupon.validTill || coupon.validUntil!) < now) {
    return 0;
  }
  
  // Check usage limits
  if (coupon.usageLimit?.perUserLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit.perUserLimit) {
    return 0;
  }
  
  // Check max uses
  if (coupon.maxUses && coupon.usedCount && coupon.usedCount >= coupon.maxUses) {
    return 0;
  }
  
  let discount = 0;
  
  // Use value field if discountValue is not available
  const discountValue = coupon.discountValue || coupon.value || 0;
  
  // Determine discount type (handle both field names)
  const discountType = coupon.discountType || coupon.type || 'percentage';
  
  if (discountType === 'percentage') {
    discount = (subtotal * discountValue) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    // Fixed discount
    discount = Math.min(discountValue, subtotal);
  }
  
  return parseFloat(discount.toFixed(2));
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  const calculateState = (items: CartItem[], coupon: AppliedCoupon | null = state.appliedCoupon) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = coupon ? calculateDiscount(coupon as unknown as Coupon, subtotal, items) : 0;
    
    return {
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      totalAmount: Math.max(0, subtotal - discount),
      appliedCoupon: discount > 0 ? coupon : null // Only keep coupon if discount is applied
    };
  };

  switch (action.type) {
    case 'ADD_TO_CART': {
      // Check for existing item based on productId instead of id
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      const updatedItems = existingItem
        ? state.items.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { ...action.payload, quantity: 1 }];

      return calculateState(updatedItems);
    }

    case 'REMOVE_FROM_CART': {
      // Remove item based on productId instead of id
      const updatedItems = state.items.filter(item => item.productId !== action.payload);
      return calculateState(updatedItems);
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.productId === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      return calculateState(updatedItems);
    }

    case 'SET_CART_ITEMS': {
      // Set cart items directly from Firebase
      return calculateState(action.payload.items, action.payload.appliedCoupon || null);
    }

    case 'APPLY_COUPON': {
      const { payload: coupon } = action;
      const appliedCoupon: AppliedCoupon = {
        ...coupon,
        appliedAt: new Date(),
        discountAmount: 0 // Will be calculated in calculateState
      };
      
      return calculateState([...state.items], appliedCoupon);
    }

    case 'REMOVE_COUPON':
      return calculateState([...state.items], null);

    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        subtotal: 0,
        discount: 0,
        totalAmount: 0,
        appliedCoupon: null
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  totalAmount: 0,
  appliedCoupon: null
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  const loadCartFromFirebase = async () => {
    if (!user?.userId) return;
    
    try {
      // Get user's cart from Firebase
      const cart = await CartService.getCart(user.userId);
      if (cart) {
        // Get cart items from Firebase
        const firebaseItems = await CartService.getCartItems(user.userId, cart.cartId);
        
        // Convert Firebase items to local cart items with product images
        const localItems: CartItem[] = [];
        for (const firebaseItem of firebaseItems) {
          // Get product details to fetch the image URL
          const productDetails = await CartService.getProductDetails(firebaseItem.productId);
          
          localItems.push({
            id: firebaseItem.productId,
            productId: firebaseItem.productId,
            name: firebaseItem.name,
            price: firebaseItem.price,
            quantity: firebaseItem.quantity,
            image: productDetails?.imageURL || '', // Use the product image or empty string
            chefId: firebaseItem.menuItemId,
            chefName: '' // We'll need to get this from the product data
          });
        }
        
        // Dispatch a special action to set the cart items directly
        dispatch({ 
          type: 'SET_CART_ITEMS', 
          payload: { 
            items: localItems,
            appliedCoupon: cart.appliedCoupon || null
          } 
        });
      }
    } catch (error) {
      console.error('Error loading cart from Firebase:', error);
    }
  };

  const syncWithFirebase = async () => {
    if (!user?.userId) return;
    
    try {
      // Get or create cart in Firebase
      let cart = await CartService.getCart(user.userId);
      let cartId: string;
      
      if (!cart) {
        cartId = await CartService.createCart(user.userId);
      } else {
        cartId = cart.cartId;
      }
      
      // Sync cart items
      const firebaseItems = await CartService.getCartItems(user.userId, cartId);
      
      // Update local state with Firebase data if needed
      // This would be implemented based on your specific sync requirements
    } catch (error) {
      console.error('Error syncing cart with Firebase:', error);
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
    
    // Sync with Firebase if user is logged in (non-blocking)
    if (user?.userId) {
      // Use setTimeout to make Firebase sync non-blocking
      setTimeout(async () => {
        try {
          let cart = await CartService.getCart(user.userId);
          let cartId: string;
          
          if (!cart) {
            cartId = await CartService.createCart(user.userId);
          } else {
            cartId = cart.cartId;
          }
          
          await CartService.addItemToCart(user.userId, cartId, item);
        } catch (error) {
          console.error('Error adding item to Firebase cart:', error);
        }
      }, 0);
    }
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    
    // Sync with Firebase if user is logged in (non-blocking)
    if (user?.userId) {
      // Use setTimeout to make Firebase sync non-blocking
      setTimeout(async () => {
        try {
          const cart = await CartService.getCart(user.userId);
          if (cart) {
            // Find the Firebase item ID by product ID
            const firebaseItems = await CartService.getCartItems(user.userId, cart.cartId);
            const itemToRemove = firebaseItems.find(item => item.productId === id);
            
            if (itemToRemove) {
              await CartService.removeItemFromCart(user.userId, cart.cartId, itemToRemove.itemId);
            }
          }
        } catch (error) {
          console.error('Error removing item from Firebase cart:', error);
        }
      }, 0);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    
    // Sync with Firebase if user is logged in (non-blocking)
    if (user?.userId) {
      // Use setTimeout to make Firebase sync non-blocking
      setTimeout(async () => {
        try {
          const cart = await CartService.getCart(user.userId);
          if (cart) {
            // Find the Firebase item ID by product ID
            const firebaseItems = await CartService.getCartItems(user.userId, cart.cartId);
            const itemToUpdate = firebaseItems.find(item => item.productId === id);
            
            if (itemToUpdate) {
              await CartService.updateItemQuantity(user.userId, cart.cartId, itemToUpdate.itemId, quantity);
            }
          }
        } catch (error) {
          console.error('Error updating item quantity in Firebase cart:', error);
        }
      }, 0);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    
    // Sync with Firebase if user is logged in (non-blocking)
    if (user?.userId) {
      // Use setTimeout to make Firebase sync non-blocking
      setTimeout(async () => {
        try {
          const cart = await CartService.getCart(user.userId);
          if (cart) {
            await CartService.clearCart(user.userId, cart.cartId);
          }
        } catch (error) {
          console.error('Error clearing Firebase cart:', error);
        }
      }, 0);
    }
  };

  const getItemQuantity = (id: string) => {
    return state.items.find(item => item.productId === id)?.quantity || 0;
  };

  const applyCoupon = async (coupon: Coupon): Promise<{ success: boolean; message: string }> => {
    try {
      dispatch({ type: 'APPLY_COUPON', payload: coupon });
      
      // Sync with Firebase if user is logged in
      if (user?.userId) {
        try {
          const cart = await CartService.getCart(user.userId);
          if (cart) {
            await CartService.applyCoupon(user.userId, cart.cartId, coupon);
          }
        } catch (error) {
          console.error('Error applying coupon in Firebase cart:', error);
        }
      }
      
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: 'Failed to apply coupon. Please try again.' };
    }
  };

  const removeCoupon = async () => {
    dispatch({ type: 'REMOVE_COUPON' });
    
    // Sync with Firebase if user is logged in
    if (user?.userId) {
      try {
        const cart = await CartService.getCart(user.userId);
        if (cart) {
          await CartService.removeCoupon(user.userId, cart.cartId);
        }
      } catch (error) {
        console.error('Error removing coupon from Firebase cart:', error);
      }
    }
  };

  // Add new method for preparing order data
  const prepareOrderData = (deliveryInfo: {
    address: any;
    timeSlot: any;
    instructions?: string;
    deliveryCharges?: number;
    paymentMethod?: string;
  }): OrderData | null => {
    if (!user?.userId || state.items.length === 0) {
      return null;
    }

    console.log('Preparing order data for user:', user.userId);
    
    // Extract address information
    const address = deliveryInfo.address;
    const timeSlot = deliveryInfo.timeSlot;
    
    // Parse location data from address
    let city = '';
    let pincode = '';
    let coordinates = { latitude: 0, longitude: 0 };
    
    if (address?.coordinates) {
      coordinates = {
        latitude: address.coordinates.latitude,
        longitude: address.coordinates.longitude
      };
    }
    
    // Try to extract city and pincode from address string
    if (address?.address) {
      // Extract pincode (6-digit number)
      const pincodeMatch = address.address.match(/\b\d{6}\b/);
      if (pincodeMatch) {
        pincode = pincodeMatch[0];
      }
      
      // Extract city (this is a simplified approach)
      const addressParts = address.address.split(', ');
      if (addressParts.length > 2) {
        city = addressParts[addressParts.length - 3]; // Usually 3rd from last
      }
    }

    // Calculate taxes (simplified - 5% of total amount)
    const taxes = state.totalAmount * 0.05;
    
    // Calculate final amount
    const deliveryCharges = deliveryInfo.deliveryCharges || 0;
    const finalAmount = state.totalAmount + deliveryCharges + taxes;

    // Create scheduled date from time slot
    let scheduledFor = new Date();
    if (timeSlot?.date) {
      scheduledFor = new Date(timeSlot.date);
      // Set to morning time as default if no specific time
      scheduledFor.setHours(10, 0, 0, 0);
    }

    const orderData: OrderData = {
      // Cart information
      items: [...state.items],
      subtotal: state.subtotal,
      discount: state.discount,
      totalAmount: state.totalAmount,
      appliedCoupons: state.appliedCoupon ? [state.appliedCoupon] : [],
      
      // Delivery information
      deliveryAddress: {
        addressId: address?.id,
        contactName: address?.label || 'Customer',
        contactPhone: '', // Would come from user profile
        line1: address?.address || '',
        line2: '',
        city: city,
        pincode: pincode,
        geoPoint: coordinates,
        saveForFuture: address?.isDefault || false
      },
      
      // Time slot information
      scheduledFor: scheduledFor,
      estimatedDeliveryTime: '30 mins', // Default value
      actualDeliveryTime: '25 mins', // Default value
      
      // Additional information
      instructions: deliveryInfo.instructions || '',
      deliveryCharges: deliveryCharges,
      taxes: taxes,
      finalAmount: finalAmount,
      
      // User information
      customerId: user.userId, // Add this field for Firestore rules
      userId: user.userId,
      restaurantId: '', // Would be determined based on cart items
      warehouseId: '', // Would be determined based on cart items
      type: 'restaurant', // Default to restaurant, would be determined based on cart items
      
      // Metadata
      status: 'pending',
      deliveryType: 'delivery',
      paymentMethod: deliveryInfo.paymentMethod || 'UPI',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Prepared order data:', JSON.stringify(orderData, null, 2));
    
    return orderData;
  };

  const value = useMemo(() => ({
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    applyCoupon,
    removeCoupon,
    calculateDiscount,
    syncWithFirebase,
    loadCartFromFirebase,
    prepareOrderData, // Add the new method
  }), [state, user]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { calculateDiscount };

export default CartContext;