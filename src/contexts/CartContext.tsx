import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { Coupon, AppliedCoupon } from '../types/coupon';

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

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' };

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateDiscount = (coupon: Coupon, subtotal: number): number => {
  if (!coupon) return 0;
  
  let discount = 0;
  
  if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    // Fixed discount
    discount = Math.min(coupon.value, subtotal);
  }
  
  return parseFloat(discount.toFixed(2));
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  const calculateState = (items: CartItem[], coupon: AppliedCoupon | null = state.appliedCoupon) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = coupon ? calculateDiscount(coupon, subtotal) : 0;
    
    return {
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      totalAmount: Math.max(0, subtotal - discount),
      appliedCoupon: coupon
    };
  };

  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const updatedItems = existingItem
        ? state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { ...action.payload, quantity: 1 }];

      return calculateState(updatedItems);
    }

    case 'REMOVE_FROM_CART': {
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

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (id: string) => {
    return state.items.find(item => item.id === id)?.quantity || 0;
  };

  const applyCoupon = async (coupon: Coupon): Promise<{ success: boolean; message: string }> => {
    try {
      // Additional validation can be added here
      dispatch({ type: 'APPLY_COUPON', payload: coupon });
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: 'Failed to apply coupon. Please try again.' };
    }
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
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
  }), [state]);

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
