import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderDetail, OrderStatus, OrderQuery } from '../../types/order';

interface OrdersState {
  orders: OrderDetail[];
  currentOrder: OrderDetail | null;
  loading: boolean;
  error: string | null;
  filters: OrderQuery;
  lastUpdated: Date | null;
  hasMore: boolean;
  totalCount: number;
}

const initialOrdersState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  filters: {},
  lastUpdated: null,
  hasMore: false,
  totalCount: 0,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialOrdersState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderDetail[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    addOrder: (state, action: PayloadAction<OrderDetail>) => {
      state.orders.unshift(action.payload);
      state.totalCount += 1;
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    updateOrder: (state, action: PayloadAction<Partial<OrderDetail> & { id: string }>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);

      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...action.payload };
      }

      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = { ...state.currentOrder, ...action.payload };
      }

      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    setCurrentOrder: (state, action: PayloadAction<OrderDetail | null>) => {
      state.currentOrder = action.payload;
      state.loading = false;
      state.error = null;
    },

    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);

      if (state.currentOrder?.id === action.payload) {
        state.currentOrder = null;
      }

      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setFilters: (state, action: PayloadAction<OrderQuery>) => {
      state.filters = action.payload;
    },

    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus; notes?: string }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);

      if (order) {
        order.status = action.payload.status;
        order.statusHistory.push({
          statusId: `${order.id}-${action.payload.status}-${Date.now()}`,
          status: action.payload.status,
          timestamp: new Date(),
          updatedBy: 'user',
          notes: action.payload.notes,
        });
        order.updatedAt = new Date();
      }

      if (state.currentOrder?.id === action.payload.orderId) {
        state.currentOrder.status = action.payload.status;
        state.currentOrder.statusHistory.push({
          statusId: `${state.currentOrder.id}-${action.payload.status}-${Date.now()}`,
          status: action.payload.status,
          timestamp: new Date(),
          updatedBy: 'user',
          notes: action.payload.notes,
        });
        state.currentOrder.updatedAt = new Date();
      }

      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },

    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },

    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.filters = {};
      state.lastUpdated = null;
      state.hasMore = false;
      state.totalCount = 0;
    },

    optimisticUpdate: (state, action: PayloadAction<{ orderId: string; updates: Partial<OrderDetail> }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);

      if (order) {
        Object.assign(order, action.payload.updates);
      }

      if (state.currentOrder?.id === action.payload.orderId) {
        Object.assign(state.currentOrder, action.payload.updates);
      }
    },
  },
});

export const {
  setOrders,
  addOrder,
  updateOrder,
  setCurrentOrder,
  removeOrder,
  setLoading,
  setError,
  setFilters,
  updateOrderStatus,
  setHasMore,
  setTotalCount,
  clearOrders,
  optimisticUpdate,
} = ordersSlice.actions;

export default ordersSlice.reducer;
