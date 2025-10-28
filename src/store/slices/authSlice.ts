import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginWithEmail, registerUser, resetPassword, logoutUser, refreshAuthToken } from './authThunks';

interface AuthState {
  user: any | null; // Using any for now since UserProfile type might not be available
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  jwtToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
}

const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
  jwtToken: null,
  refreshToken: null,
  tokenExpiry: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<any | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<{
      jwtToken: string;
      refreshToken: string;
      tokenExpiry: number;
    }>) => {
      state.jwtToken = action.payload.jwtToken;
      state.refreshToken = action.payload.refreshToken;
      state.tokenExpiry = action.payload.tokenExpiry;
    },
    clearTokens: (state) => {
      state.jwtToken = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    updateUser: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserPreferences: (state, action: PayloadAction<any>) => {
      if (state.user && state.user.preferences) {
        state.user.preferences = action.payload;
      }
    },
    signOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.jwtToken = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Email login
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.jwtToken = action.payload.jwtToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = action.payload.tokenExpiry;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // User registration
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.jwtToken = action.payload.jwtToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = action.payload.tokenExpiry;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Password reset
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Token refresh
    builder
      .addCase(refreshAuthToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.jwtToken = action.payload.jwtToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = action.payload.tokenExpiry;
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.jwtToken = null;
        state.refreshToken = null;
        state.tokenExpiry = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  setTokens,
  clearTokens,
  setLoading,
  setError,
  setInitialized,
  updateUser,
  updateUserPreferences,
  signOut,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
