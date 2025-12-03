import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { collection, doc, getDoc, setDoc, GeoPoint } from '@react-native-firebase/firestore';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } from '@react-native-firebase/auth';
import { db } from '../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  setUser,
  setTokens,
  setLoading,
  setError,
  signOut as signOutAction
} from '../store/slices/authSlice';
import { generateJWTToken } from '../store/middleware/authMiddleware';
import { convertUserForRedux } from '../utils/firestoreHelpers';
import { logoutUser } from '../store/slices/authThunks';
import { initializeUserSubcollections } from '../utils/userSubcollections';

import { User } from '../types/firestore';

interface UserProfile extends User {
  isPhoneVerified: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<any>;
  registerUser: (email: string, password: string, displayName: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupAuthListener = async () => {
      try {
        if (auth) {
          dispatch(setLoading(true));
          unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
              dispatch(setError(null));
              if (firebaseUser) {
                // Check if email is verified
                if (!firebaseUser.emailVerified) {
                  // Sign out the user since email is not verified
                  await signOut(auth);
                  dispatch(setUser(null));
                  dispatch(setTokens({ jwtToken: '', refreshToken: '', tokenExpiry: 0 }));
                } else {
                  // Get user profile from Firestore
                  const userDocRef = doc(collection(db, 'users'), firebaseUser.uid);
                  const userDocSnap = await getDoc(userDocRef);
                  let userData: Omit<UserProfile, 'isPhoneVerified'> | null = userDocSnap.exists() ? userDocSnap.data() as Omit<UserProfile, 'isPhoneVerified'> : null;

                  if (!userData) {
                    // Create user profile if it doesn't exist
                    userData = {
                      userId: firebaseUser.uid,
                      phone: firebaseUser.phoneNumber || '',
                      displayName: firebaseUser.displayName || '',
                      email: firebaseUser.email || '',
                      profilePhotoURL: firebaseUser.photoURL || '',
                      role: 'customer',
                      status: 'active',
                      preferences: { cuisines: [], foodTypes: [], notifications: { orderUpdates: true, promotions: true, offers: true } },
                      loyaltyPoints: 0,
                      totalOrders: 0,
                      joinedAt: new Date(),
                    };
                    await setDoc(userDocRef, userData);
                    
                    // Create default notifications subcollection
                    await initializeUserSubcollections(firebaseUser.uid);
                  } else {
                    // Convert Firestore Timestamps to serializable dates
                    userData = convertUserForRedux(userData);
                  }

                  // Generate JWT token
                  const jwtToken = await generateJWTToken(firebaseUser.uid, userData);
                  const tokenExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

                  // Update Redux state
                  dispatch(setUser({ ...userData, isPhoneVerified: !!firebaseUser.phoneNumber }));
                  dispatch(setTokens({
                    jwtToken,
                    refreshToken: `refresh_${firebaseUser.uid}_${Date.now()}`,
                    tokenExpiry,
                  }));
                }
              } else {
                // Clear Redux state when no user
                dispatch(setUser(null));
                dispatch(setTokens({ jwtToken: '', refreshToken: '', tokenExpiry: 0 }));
              }
            } catch (err) {
              console.error('Auth state change error:', err);
              dispatch(setError('Authentication error'));
            } finally {
              dispatch(setLoading(false));
            }
          });
        } else {
          console.error('Auth not initialized');
          dispatch(setLoading(false));
        }
      } catch (err) {
        console.error('Setup auth listener error:', err);
        dispatch(setError('Failed to set up auth listener'));
        dispatch(setLoading(false));
      }
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  const signOutUser = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      await signOut(auth); // Call the Firebase signOut function with auth parameter
      dispatch(signOutAction());
    } catch (error) {
      dispatch(setError('Sign out failed'));
    }
  };

  const refreshUser = async (): Promise<void> => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(collection(db, 'users'), currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() as Omit<UserProfile, 'isPhoneVerified'> : null;
      if (userData) {
        // Convert Firestore Timestamps to serializable dates
        const convertedUserData = convertUserForRedux(userData);
        dispatch(setUser({ ...convertedUserData, isPhoneVerified: !!currentUser.phoneNumber }));
      }
    }
  };

  // Auth methods that integrate with Redux
  const loginWithEmail = async (email: string, password: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error('Login failed');
      }

      // Check if email is verified
      if (!firebaseUser.emailVerified) {
        // Sign out the user since email is not verified
        await signOut(auth);
        return { error: 'EMAIL_NOT_VERIFIED' };
      }

      // Get or create user profile
      const userDocRef = doc(collection(db, 'users'), firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      let userData = userDocSnap.exists() ? userDocSnap.data() as Omit<UserProfile, 'isPhoneVerified'> : null;

      if (!userData) {
        // Create user profile if it doesn't exist
        userData = {
          userId: firebaseUser.uid,
          phone: firebaseUser.phoneNumber || '',
          displayName: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          profilePhotoURL: firebaseUser.photoURL || '',
          role: 'customer',
          status: 'active',
          preferences: { cuisines: [], foodTypes: [], notifications: { orderUpdates: true, promotions: true, offers: true } },
          loyaltyPoints: 0,
          totalOrders: 0,
          joinedAt: new Date(),
        };
        await setDoc(userDocRef, userData);
        
        // Initialize user subcollections with a delay
        setTimeout(async () => {
          try {
            await initializeUserSubcollections(firebaseUser.uid);
          } catch (error) {
            console.error('Error initializing user subcollections (non-blocking):', error);
          }
        }, 1000);
      } else {
        // Convert Firestore Timestamps to serializable dates
        userData = convertUserForRedux(userData);
      }

      // Generate JWT token
      const jwtToken = await generateJWTToken(firebaseUser.uid, userData);
      const tokenExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

      dispatch(setUser({ ...userData, isPhoneVerified: !!firebaseUser.phoneNumber }));
      dispatch(setTokens({
        jwtToken,
        refreshToken: `refresh_${firebaseUser.uid}_${Date.now()}`,
        tokenExpiry,
      }));

      return { user: { ...userData, isPhoneVerified: !!firebaseUser.phoneNumber } };
    } catch (error: any) {
      dispatch(setError(error.message));
      return { error: error.message };
    }
  };

  const registerUser = async (email: string, password: string, displayName: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

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

      // Create user profile with proper displayName
      const userData = {
        userId: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: displayName || firebaseUser.displayName || '',
        phone: '',
        profilePhotoURL: '',
        role: 'customer',
        status: 'active',
        preferences: { cuisines: [], foodTypes: [], notifications: { orderUpdates: true, promotions: true, offers: true } },
        loyaltyPoints: 0,
        totalOrders: 0,
        joinedAt: new Date(),
      };

      const userDocRef = doc(collection(db, 'users'), firebaseUser.uid);
      await setDoc(userDocRef, userData);
      
      // Initialize user subcollections with a delay to avoid permission issues
      setTimeout(async () => {
        try {
          await initializeUserSubcollections(firebaseUser.uid);
        } catch (error) {
          console.error('Error initializing user subcollections (non-blocking):', error);
          // This error shouldn't block the registration process
        }
      }, 1000);

      // Generate JWT token
      const jwtToken = await generateJWTToken(firebaseUser.uid, userData);
      const tokenExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

      dispatch(setUser({ ...userData, isPhoneVerified: !!firebaseUser.phoneNumber }));
      dispatch(setTokens({
        jwtToken,
        refreshToken: `refresh_${firebaseUser.uid}_${Date.now()}`,
        tokenExpiry,
      }));

      return { user: { ...userData, isPhoneVerified: !!firebaseUser.phoneNumber } };
    } catch (error: any) {
      dispatch(setError(error.message));
      return { error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      await sendPasswordResetEmail(auth, email);
      dispatch(setLoading(false));
      return { success: true, message: 'Password reset email sent' };
    } catch (error: any) {
      dispatch(setError(error.message));
      return { error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signOut: signOutUser,
      refreshUser,
      loginWithEmail,
      registerUser,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
