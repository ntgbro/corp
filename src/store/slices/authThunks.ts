import { createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut as firebaseSignOut, updateProfile } from '@react-native-firebase/auth';
import { collection, doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { auth, db } from '../../config/firebase';
import { generateJWTToken, validateJWTToken, refreshJWTToken } from '../../store/middleware/authMiddleware';
import { convertUserForRedux } from '../../utils/firestoreHelpers';

// Async thunk for email/password login
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error('Login failed');
      }

      // Get user profile from Firestore
      const userDocRef = doc(collection(db, 'users'), firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      let userData = userDocSnap.exists() ? userDocSnap.data() : null;

      if (!userData) {
        // Create user profile if it doesn't exist
        userData = {
          userId: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          role: 'customer',
          status: 'active',
          preferences: {
            cuisines: [],
            foodTypes: [],
            notifications: { orderUpdates: true, promotions: true, offers: true }
          },
          loyaltyPoints: 0,
          totalOrders: 0,
          joinedAt: new Date(),
        };
        await setDoc(userDocRef, userData);
      } else {
        // Convert Firestore Timestamps to serializable dates
        userData = convertUserForRedux(userData as any);
      }

      // Generate JWT token
      const jwtToken = await generateJWTToken(firebaseUser.uid, userData);
      const tokenExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours

      return {
        user: { ...(userData as any), isPhoneVerified: !!firebaseUser.phoneNumber },
        jwtToken,
        refreshToken: `refresh_${firebaseUser.uid}_${Date.now()}`,
        tokenExpiry,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for phone authentication
export const loginWithPhone = createAsyncThunk(
  'auth/loginWithPhone',
  async ({ phoneNumber, verificationCode }: { phoneNumber: string; verificationCode: string }, { rejectWithValue }) => {
    try {
      // This would be implemented with Firebase Phone Auth
      // For demo purposes, we'll simulate the flow
      console.log('Phone login requested:', phoneNumber, verificationCode);

      // In a real implementation, you would verify the SMS code here
      // const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      // const userCredential = await auth.signInWithCredential(credential);

      return rejectWithValue('Phone authentication not implemented in demo');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for Google Sign In
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      // This would be implemented with Firebase Google Auth
      // For demo purposes, we'll simulate the flow
      console.log('Google sign in requested');

      return rejectWithValue('Google authentication not implemented in demo');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error('Registration failed');
      }

      // Update Firebase user profile with displayName
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }

      // Create user profile in Firestore
      const userData = {
        userId: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: displayName || firebaseUser.displayName || '',
        phone: '',
        profilePhotoURL: '',
        role: 'customer',
        status: 'active',
        preferences: {
          cuisines: [],
          foodTypes: [],
          notifications: { orderUpdates: true, promotions: true, offers: true }
        },
        loyaltyPoints: 0,
        totalOrders: 0,
        joinedAt: new Date(),
      };

      const userDocRef = doc(collection(db, 'users'), firebaseUser.uid);
      await setDoc(userDocRef, userData);

      // Generate JWT token
      const jwtToken = await generateJWTToken(firebaseUser.uid, userData);
      const tokenExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours

      return {
        user: { ...(userData as any), isPhoneVerified: !!firebaseUser.phoneNumber },
        jwtToken,
        refreshToken: `refresh_${firebaseUser.uid}_${Date.now()}`,
        tokenExpiry,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for password reset
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for token refresh
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // In a real implementation, call your backend API to refresh the token
      const newToken = await refreshJWTToken(refreshToken);

      if (!newToken) {
        throw new Error('Token refresh failed');
      }

      // Validate the new token
      if (!validateJWTToken(newToken)) {
        throw new Error('Invalid token received');
      }

      // Decode token to get user info
      const tokenParts = newToken.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const tokenExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

      return {
        jwtToken: newToken,
        refreshToken,
        tokenExpiry,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
