import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationDetail, NotificationSettings } from '../../types';

interface NotificationState {
  notifications: NotificationDetail[];
  unreadCount: number;
  settings: NotificationSettings;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

const initialNotificationSettings: NotificationSettings = {
  pushNotifications: true,
  smsNotifications: true,
  emailNotifications: false,
  orderUpdates: true,
  promotions: true,
  reviews: true,
  chefUpdates: true,
  deliveryUpdates: true,
  marketing: false,
};

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  settings: initialNotificationSettings,
  loading: false,
  error: null,
  lastFetched: null,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationDetail[]>) => {
      state.notifications = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetched = new Date();
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },

    addNotification: (state, action: PayloadAction<NotificationDetail>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
      state.loading = false;
      state.error = null;
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    updateSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      state.loading = false;
      state.error = null;
    },

    resetSettings: (state) => {
      state.settings = initialNotificationSettings;
    },

    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },

    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  setLoading,
  setError,
  updateSettings,
  resetSettings,
  incrementUnreadCount,
  decrementUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
