import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../../types';

const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);

      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }

      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },

    updateCartItem: (state, action: PayloadAction<Partial<CartItem> & { id: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);

      if (item) {
        Object.assign(item, action.payload);
      }

      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;

      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    applyDiscount: (state, action: PayloadAction<{ discount: number; type: 'fixed' | 'percentage' }>) => {
      if (action.payload.type === 'percentage') {
        state.totalAmount = state.totalAmount * (1 - action.payload.discount / 100);
      } else {
        state.totalAmount = Math.max(0, state.totalAmount - action.payload.discount);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateCartItem,
  setCartItems,
  applyDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;
