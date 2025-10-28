import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  cuisines: string[];
  foodTypes: string[];
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    offers: boolean;
  };
}

interface UserAddress {
  addressId: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

interface UserProfile {
  userId: string;
  phone: string;
  displayName: string;
  email: string;
  profilePhotoURL: string;
  role: 'customer' | 'restaurant_owner' | 'admin' | 'delivery_partner';
  status: 'active' | 'suspended' | 'pending_verification' | 'deactivated';
  preferences: UserPreferences;
  loyaltyPoints: number;
  totalOrders: number;
  joinedAt: Date;
}

interface UserState {
  profile: UserProfile | null;
  addresses: UserAddress[];
  loading: boolean;
  error: string | null;
  isPhoneVerified: boolean;
}

const initialState: UserState = {
  profile: null,
  addresses: [],
  loading: false,
  error: null,
  isPhoneVerified: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    setUserAddresses: (state, action: PayloadAction<UserAddress[]>) => {
      state.addresses = action.payload;
    },

    addUserAddress: (state, action: PayloadAction<UserAddress>) => {
      // If this is set as default, unset other defaults
      if (action.payload.isDefault) {
        state.addresses = state.addresses.map(addr => ({ ...addr, isDefault: false }));
      }
      state.addresses.push(action.payload);
    },

    updateUserAddress: (state, action: PayloadAction<{ addressId: string; updates: Partial<UserAddress> }>) => {
      const index = state.addresses.findIndex(addr => addr.addressId === action.payload.addressId);
      if (index !== -1) {
        // If this is set as default, unset other defaults
        if (action.payload.updates.isDefault) {
          state.addresses = state.addresses.map(addr => ({ ...addr, isDefault: false }));
        }
        state.addresses[index] = { ...state.addresses[index], ...action.payload.updates };
      }
    },

    removeUserAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(addr => addr.addressId !== action.payload);
    },

    setUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.profile) {
        state.profile.preferences = { ...state.profile.preferences, ...action.payload };
      }
    },

    setPhoneVerified: (state, action: PayloadAction<boolean>) => {
      state.isPhoneVerified = action.payload;
      if (state.profile) {
        state.profile.phone = action.payload ? state.profile.phone : '';
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    resetUserState: (state) => {
      return initialState;
    },
  },
});

export const {
  setUserProfile,
  updateUserProfile,
  setUserAddresses,
  addUserAddress,
  updateUserAddress,
  removeUserAddress,
  setUserPreferences,
  setPhoneVerified,
  setLoading,
  setError,
  clearError,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
