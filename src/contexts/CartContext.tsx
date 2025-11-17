import React, { createContext, useContext, useReducer, ReactNode, useMemo, useCallback } from 'react';
import { Coupon, AppliedCoupon } from '../types/coupon';
import { CartService } from '../services/firebase/cartService';
import { useAuth } from './AuthContext';
import { CartItem as FirebaseCartItem } from '../types'; // Import the CartItem type from types
import { doc, getDoc } from '@react-native-firebase/firestore';
import { db } from '../config/firebase';

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
  serviceId: string; // Made this required
  restaurantId: string; // Made this required
  warehouseId: string; // Made this required
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
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
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
  }) => Promise<OrderData | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateDiscount = (coupon: Coupon, subtotal: number, items: CartItem[] = []): number => {
  console.log('Calculating discount for coupon:', coupon?.code, 'subtotal:', subtotal, 'items:', items.length);
  console.log('Coupon details:', JSON.stringify(coupon, null, 2));
  
  if (!coupon || !coupon.isActive) {
    console.log('Coupon is invalid or inactive');
    return 0;
  }
  
  // Check minimum order amount
  if (subtotal < (coupon.minOrderAmount || 0)) {
    console.log('Subtotal is less than minimum order amount');
    return 0;
  }
  
  // Check minimum order count (number of items)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems < (coupon.minOrderCount || 0)) {
    console.log('Total items is less than minimum order count');
    return 0;
  }
  
  // Check validity period
  const now = new Date();
  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    console.log('Coupon is not yet valid');
    return 0;
  }
  if ((coupon.validTill || coupon.validUntil) && new Date(coupon.validTill || coupon.validUntil!) < now) {
    console.log('Coupon has expired');
    return 0;
  }
  
  // Check usage limits
  if (coupon.usageLimit?.perUserLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit.perUserLimit) {
    console.log('Coupon usage limit reached');
    return 0;
  }
  
  // Check max uses
  if (coupon.maxUses && coupon.usedCount && coupon.usedCount >= coupon.maxUses) {
    console.log('Coupon max uses reached');
    return 0;
  }
  
  let discount = 0;
  
  // Use value field if discountValue is not available
  const discountValue = coupon.discountValue || coupon.value || 0;
  console.log('Discount value:', discountValue);
  
  // Determine discount type (handle both field names)
  const discountType = coupon.discountType || coupon.type || 'percentage';
  console.log('Discount type:', discountType);
  
  if (discountType === 'percentage') {
    discount = (subtotal * discountValue) / 100;
    console.log('Percentage discount calculated:', discount);
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
      console.log('Discount capped at max discount amount:', discount);
    }
  } else {
    // Fixed discount
    discount = Math.min(discountValue, subtotal);
    console.log('Fixed discount calculated:', discount);
  }
  
  console.log('Final discount:', discount);
  return parseFloat(discount.toFixed(2));
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  console.log('Cart reducer called with action:', action.type);
  
  const calculateState = (items: CartItem[], coupon: AppliedCoupon | null = state.appliedCoupon) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('Calculating state - subtotal:', subtotal, 'coupon:', coupon);
    
    const discount = coupon ? calculateDiscount(coupon as unknown as Coupon, subtotal, items) : 0;
    console.log('Calculated discount:', discount);
    
    // Update the coupon with the calculated discount amount
    const updatedCoupon = coupon ? {
      ...coupon,
      discountAmount: discount
    } : null;
    
    console.log('Updated coupon:', updatedCoupon);
    
    return {
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      totalAmount: Math.max(0, subtotal - discount),
      appliedCoupon: discount > 0 ? updatedCoupon : null // Only keep coupon if discount is applied
    };
  };

  switch (action.type) {
    case 'ADD_TO_CART': {
      // Check for existing item based on productId to group same products
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
      // Remove item based on Firebase document ID
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return calculateState(updatedItems);
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      return calculateState(updatedItems);
    }

    case 'SET_CART_ITEMS': {
      // Set cart items directly from Firebase
      console.log('SET_CART_ITEMS action received with payload:', action.payload);
      console.log('Current applied coupon:', state.appliedCoupon);
      console.log('New applied coupon:', action.payload.appliedCoupon);
      return calculateState(action.payload.items, action.payload.appliedCoupon || null);
    }

    case 'APPLY_COUPON': {
      const { payload: coupon } = action;
      console.log('APPLY_COUPON action received with coupon:', coupon);
      
      // Check if coupon has required fields
      if (!coupon.id || !coupon.code) {
        console.warn('Coupon is missing required fields in APPLY_COUPON action - id:', coupon.id, 'code:', coupon.code);
      }
      
      const appliedCoupon: AppliedCoupon = {
        ...coupon,
        appliedAt: new Date(),
        discountAmount: 0 // Will be calculated in calculateState
      };
      
      console.log('Applying coupon in reducer:', appliedCoupon);
      const result = calculateState([...state.items], appliedCoupon);
      console.log('Calculated state after applying coupon:', result);
      return result;
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
  
  console.log('CartProvider state updated:', state);
  console.log('CartProvider appliedCoupon:', state.appliedCoupon);

  const loadCartFromFirebase = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      // Get user's cart from Firebase
      const cart = await CartService.getCart(user.userId);
      console.log('Loaded cart from Firebase:', cart);
      
      // If cart exists but is inactive, treat it as no cart
      if (cart && cart.status === 'inactive') {
        console.log('Cart is inactive, clearing local state');
        dispatch({ type: 'CLEAR_CART' });
        return;
      }
      
      if (cart) {
        // Get cart items from Firebase
        const firebaseItems = await CartService.getCartItems(user.userId, cart.cartId);
        console.log('Loaded cart items from Firebase:', firebaseItems);
        
        // Convert Firebase items to local cart items with product images
        const localItems: CartItem[] = [];
        for (const firebaseItem of firebaseItems) {
          // Get product details to fetch the image URL
          // Use either productId or menuItemId depending on which one is populated
          const productIdToUse = firebaseItem.productId || firebaseItem.menuItemId;
          const productDetails = await CartService.getProductDetails(productIdToUse);
          
          // Determine chefId and related IDs based on available fields
          let chefId = '';
          let serviceId = '';
          let restaurantId = '';
          let warehouseId = '';
          
          // First, use the IDs from the firebase item if they exist
          serviceId = firebaseItem.serviceId || '';
          restaurantId = firebaseItem.restaurantId || '';
          warehouseId = firebaseItem.warehouseId || '';
          
          // Determine chefId based on available fields
          if (firebaseItem.restaurantId) {
            chefId = firebaseItem.restaurantId;
          } else if (firebaseItem.warehouseId) {
            chefId = firebaseItem.warehouseId;
          } else if (firebaseItem.menuItemId) {
            chefId = firebaseItem.menuItemId; // For restaurant items, this will be the restaurant ID
          }
          
          // If we don't have serviceId but have chefId, try to fetch it
          if ((!serviceId || serviceId === '') && chefId) {
            try {
              // Check if this is a restaurant item
              if (restaurantId || (chefId && chefId !== '')) {
                const restaurantRef = doc(db, 'restaurants', restaurantId || chefId);
                const restaurantSnap = await getDoc(restaurantRef);
                if (restaurantSnap.exists()) {
                  const restaurantData: any = restaurantSnap.data();
                  serviceId = restaurantData.serviceId || restaurantData.serviceIds?.[0] || '';
                  restaurantId = restaurantId || chefId;
                }
              } else if (warehouseId || chefId) {
                // This is a warehouse item
                const warehouseRef = doc(db, 'warehouses', warehouseId || chefId);
                const warehouseSnap = await getDoc(warehouseRef);
                if (warehouseSnap.exists()) {
                  const warehouseData: any = warehouseSnap.data();
                  serviceId = 'fmcg'; // Default serviceId for warehouses
                  warehouseId = warehouseId || chefId;
                }
              }
            } catch (error) {
              console.error('Error fetching entity data:', error);
            }
          }
          
          localItems.push({
            id: firebaseItem.itemId, // Use the Firebase document ID as the local item ID
            productId: productIdToUse,
            name: firebaseItem.name,
            price: firebaseItem.price,
            quantity: firebaseItem.quantity,
            image: productDetails?.imageURL || '', // Use the product image or empty string
            chefId: chefId,
            chefName: '', // We'll need to get this from the product data
            serviceId: serviceId,
            restaurantId: restaurantId,
            warehouseId: warehouseId
          });
        }
        
        // Log applied coupon information
        console.log('Applied coupon from Firebase cart:', cart.appliedCoupon);
        console.log('Applied coupon type:', typeof cart.appliedCoupon);
        console.log('Applied coupon keys:', cart.appliedCoupon ? Object.keys(cart.appliedCoupon) : 'null');
        
        // Check if appliedCoupon is actually null or an empty object
        let appliedCoupon = cart.appliedCoupon;
        if (appliedCoupon && typeof appliedCoupon === 'object' && Object.keys(appliedCoupon).length === 0) {
          console.log('Applied coupon is an empty object, treating as null');
          appliedCoupon = null;
        }
        
        // Check if we need to update the state to avoid unnecessary re-renders
        const currentItems = state.items;
        const currentCoupon = state.appliedCoupon;
        
        // Compare items
        const itemsChanged = JSON.stringify(currentItems) !== JSON.stringify(localItems);
        // Compare coupons
        const couponChanged = JSON.stringify(currentCoupon) !== JSON.stringify(appliedCoupon && Object.keys(appliedCoupon).length > 0 ? appliedCoupon : null);
        
        // Only dispatch if there are actual changes
        if (itemsChanged || couponChanged) {
          console.log('Cart data changed, updating state');
          // Dispatch a special action to set the cart items directly
          dispatch({ 
            type: 'SET_CART_ITEMS', 
            payload: { 
              items: localItems,
              appliedCoupon: appliedCoupon && Object.keys(appliedCoupon).length > 0 ? appliedCoupon : null
            } 
          });
        } else {
          console.log('Cart data unchanged, skipping state update');
        }
      } else {
        // No cart found, clear the local state
        console.log('No cart found, clearing local state');
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      console.error('Error loading cart from Firebase:', error);
    }
  }, [user?.userId]);

  const syncWithFirebase = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      // Get or create cart in Firebase
      let cart = await CartService.getCart(user.userId);
      let cartId: string;
      
      // If cart exists but is inactive, we need to create a new one
      if (cart && cart.status === 'inactive') {
        cart = null; // Treat inactive cart as no cart
      }
      
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
  }, [user?.userId]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    // Fetch serviceId, restaurantId, and warehouseId if not already present
    let serviceId = item.serviceId || '';
    let restaurantId = item.restaurantId || '';
    let warehouseId = item.warehouseId || '';
    
    // If we don't have these fields, try to fetch them based on chefId
    if ((!serviceId || serviceId === '') && (!restaurantId || restaurantId === '') && (!warehouseId || warehouseId === '') && item.chefId) {
      // Check if this is a restaurant item by checking if chefId is not empty
      if (item.chefId !== '') {
        // Restaurant item
        restaurantId = item.chefId;
        // Fetch restaurant data to get serviceId
        try {
          const restaurantRef = doc(db, 'restaurants', item.chefId);
          const restaurantSnap = await getDoc(restaurantRef);
          if (restaurantSnap.exists()) {
            const restaurantData: any = restaurantSnap.data();
            serviceId = restaurantData.serviceId || restaurantData.serviceIds?.[0] || '';
          }
        } catch (error) {
          console.error('Error fetching restaurant data:', error);
        }
      } else {
        // Warehouse item
        warehouseId = item.chefId;
        // For warehouses, serviceId would be determined based on the service type
        serviceId = 'fmcg'; // Default serviceId for warehouses
      }
    }
    
    // Create a complete cart item with all fields
    const completeItem: CartItem = {
      ...item,
      quantity: 1,
      serviceId,
      restaurantId,
      warehouseId
    };
    
    dispatch({ type: 'ADD_TO_CART', payload: completeItem });
    
    // Sync with Firebase if user is logged in (non-blocking)
    if (user?.userId) {
      // Use setTimeout to make Firebase sync non-blocking
      setTimeout(async () => {
        try {
          let cart = await CartService.getCart(user.userId);
          let cartId: string;
          
          // If cart exists but is inactive, we need to create a new one
          if (cart && cart.status === 'inactive') {
            cart = null; // Treat inactive cart as no cart
          }
          
          if (!cart) {
            cartId = await CartService.createCart(user.userId);
          } else {
            cartId = cart.cartId;
          }
          
          await CartService.addItemToCart(user.userId, cartId, completeItem);
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
      // Use Promise to handle the async operation without blocking
      Promise.resolve().then(async () => {
        try {
          const cart = await CartService.getCart(user.userId);
          if (cart) {
            // id is now the Firebase document ID, so we can use it directly
            await CartService.removeItemFromCart(user.userId, cart.cartId, id);
          }
        } catch (error) {
          console.error('Error removing item from Firebase cart:', error);
        }
      });
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    
    // Sync with Firebase if user is logged in (non-blocking)
    if (user?.userId) {
      // Use Promise to handle the async operation without blocking
      Promise.resolve().then(async () => {
        try {
          const cart = await CartService.getCart(user.userId);
          if (cart) {
            // id is now the Firebase document ID, so we can use it directly
            await CartService.updateItemQuantity(user.userId, cart.cartId, id, quantity);
          }
        } catch (error) {
          console.error('Error updating item quantity in Firebase cart:', error);
        }
      });
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
    return state.items.find(item => item.id === id)?.quantity || 0;
  };

  const applyCoupon = useCallback(async (coupon: Coupon): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Applying coupon in CartContext:', coupon);
      
      // Check if coupon has required fields
      if (!coupon.id || !coupon.code) {
        console.warn('Coupon is missing required fields - id:', coupon.id, 'code:', coupon.code);
      }
      
      dispatch({ type: 'APPLY_COUPON', payload: coupon });
      
      // Sync with Firebase if user is logged in
      if (user?.userId) {
        try {
          const cart = await CartService.getCart(user.userId);
          if (cart) {
            console.log('Applying coupon to Firebase cart:', coupon);
            await CartService.applyCoupon(user.userId, cart.cartId, coupon);
          }
        } catch (error) {
          console.error('Error applying coupon in Firebase cart:', error);
          return { success: false, message: 'Failed to apply coupon. Please try again.' };
        }
      }
      
      // Additional debugging
      console.log('State after applying coupon:', state);
      
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: 'Failed to apply coupon. Please try again.' };
    }
  }, [user?.userId, state]);

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
  const prepareOrderData = useCallback(async (deliveryInfo: {
    address: any;
    timeSlot: any;
    instructions?: string;
    deliveryCharges?: number;
    paymentMethod?: string;
  }): Promise<OrderData | null> => {
    if (!user?.userId || state.items.length === 0) {
      return null;
    }

    console.log('Preparing order data for user:', user.userId);
    console.log('Current cart state:', JSON.stringify(state, null, 2));

    // Extract address information
    const address = deliveryInfo.address;
    const timeSlot = deliveryInfo.timeSlot;
    
    // Parse location data from address
    let city = '';
    let pincode = '';
    let coordinates = { latitude: 0, longitude: 0 };
    
    // Handle geoPoint from saved addresses or coordinates from current location
    if (address?.geoPoint) {
      coordinates = {
        latitude: address.geoPoint.latitude || 0,
        longitude: address.geoPoint.longitude || 0
      };
    } else if (address?.coordinates) {
      coordinates = {
        latitude: address.coordinates.latitude,
        longitude: address.coordinates.longitude
      };
    }
    
    // Try to extract city and pincode from address fields
    if (address?.pincode) {
      pincode = address.pincode;
    } else if (address?.address) {
      // Extract pincode (6-digit number) from address string as fallback
      const pincodeMatch = address.address.match(/\b\d{6}\b/);
      if (pincodeMatch) {
        pincode = pincodeMatch[0];
      }
    }
    
    if (address?.city) {
      city = address.city;
    } else if (address?.address) {
      // Extract city (this is a simplified approach) as fallback
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

    // Log applied coupon information
    console.log('Applied coupon in cart context:', state.appliedCoupon);
    console.log('Full cart state:', JSON.stringify(state, null, 2));
    
    // Determine order type and related IDs based on cart items
    // We'll use the first item to determine the order type
    let serviceId = '';
    let restaurantId = '';
    let warehouseId = '';
    let type: 'restaurant' | 'warehouse' = 'restaurant'; // Default to restaurant
    
    // Get order data from the first cart item
    if (state.items.length > 0) {
      const firstItem = state.items[0];
      serviceId = firstItem.serviceId || '';
      restaurantId = firstItem.restaurantId || '';
      warehouseId = firstItem.warehouseId || '';
      
      // Determine type based on which ID is present
      if (restaurantId) {
        type = 'restaurant';
      } else if (warehouseId) {
        type = 'warehouse';
      }
    }
    
    // Prepare applied coupons array with proper structure
    let appliedCoupons: any[] = [];
    if (state.appliedCoupon && Object.keys(state.appliedCoupon).length > 0) {
      console.log('Found applied coupon, adding to order data');
      // Ensure the coupon has all required fields
      const coupon = {
        ...state.appliedCoupon,
        // Ensure we have the required fields for proper tracking
        id: state.appliedCoupon.id || state.appliedCoupon.couponId || '',
        code: state.appliedCoupon.code || '',
        discountAmount: state.appliedCoupon.discountAmount || state.discount || 0
      };
      appliedCoupons = [coupon];
      console.log('Applied coupons for order:', JSON.stringify(appliedCoupons, null, 2));
    } else {
      console.log('No applied coupon found or coupon is empty');
      console.log('Applied coupon value:', state.appliedCoupon);
      console.log('Applied coupon keys:', state.appliedCoupon ? Object.keys(state.appliedCoupon) : 'null');
    }
    
    const orderData: OrderData = {
      // Cart information
      items: [...state.items],
      subtotal: state.subtotal,
      discount: state.discount,
      totalAmount: state.totalAmount,
      appliedCoupons: appliedCoupons,
      
      // Delivery information
      deliveryAddress: {
        addressId: address?.id || address?.addressId || '',
        contactName: address?.contactName || address?.name || address?.label || 'Customer',
        contactPhone: address?.contactPhone || address?.phone || '', // Add phone field mapping
        line1: address?.line1 || address?.address || '',
        line2: address?.line2 || '',
        city: address?.city || city,
        pincode: address?.pincode || address?.zipCode || '', // Add zipCode field mapping
        geoPoint: coordinates,
        saveForFuture: address?.saveForFuture || address?.isDefault || false
      },
      
      // Time slot information
      scheduledFor: scheduledFor,
      estimatedDeliveryTime: '30 mins', // Default value
      actualDeliveryTime: deliveryInfo.timeSlot || '25 mins', // Use selected time slot
      
      // Additional information
      instructions: deliveryInfo.instructions || '',
      deliveryCharges: deliveryCharges,
      taxes: taxes,
      finalAmount: finalAmount,
      
      // User information
      customerId: user.userId, // Add this field for Firestore rules
      userId: user.userId,
      
      // Metadata
      status: 'pending',
      deliveryType: 'delivery',
      paymentMethod: deliveryInfo.paymentMethod || 'UPI',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Prepared order data with coupons:', JSON.stringify(orderData.appliedCoupons, null, 2));
    console.log('Full order data:', JSON.stringify(orderData, null, 2));
    
    // Additional validation
    if (orderData.appliedCoupons && orderData.appliedCoupons.length > 0) {
      console.log('Validating applied coupons before order creation:');
      for (const coupon of orderData.appliedCoupons) {
        console.log('Coupon ID:', coupon.id || coupon.couponId || coupon.code);
        console.log('Coupon discount amount:', coupon.discountAmount);
      }
    } else {
      console.log('No coupons in order data');
    }
    
    return orderData;
  }, [user?.userId, state.items, state.subtotal, state.discount, state.totalAmount, state.appliedCoupon]);

  const value = useMemo(() => {
    console.log('Creating CartContext value with appliedCoupon:', state.appliedCoupon);
    return {
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
      prepareOrderData,
    };
  }, [state, user, addToCart, removeFromCart, updateQuantity, clearCart, getItemQuantity, applyCoupon, removeCoupon, calculateDiscount, syncWithFirebase, prepareOrderData]);

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