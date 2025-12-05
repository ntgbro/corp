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
import { authService } from '../services/firebase/auth/authService';
import { User } from '../types/firestore';

interface AuthUser extends User {
  isPhoneVerified: boolean;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
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
              console.log('AuthContext: onAuthStateChanged triggered', firebaseUser ? 'User signed in' : 'No user');
              dispatch(setError(null));
              if (firebaseUser) {
                console.log('AuthContext: Processing signed in user', firebaseUser.uid);
                // Check if email is verified
                if (!firebaseUser.emailVerified) {
                  console.log('AuthContext: User signed in but email not verified. Keeping user signed in to allow verification.', firebaseUser.uid);
                    
                  // Get user profile from Firestore
                  const userDocRef = doc(collection(db, 'users'), firebaseUser.uid);
                  const userDocSnap = await getDoc(userDocRef);
                  let userData: Omit<AuthUser, 'isPhoneVerified' | 'emailVerified'> | null = userDocSnap.exists() ? userDocSnap.data() as Omit<AuthUser, 'isPhoneVerified' | 'emailVerified'> : null;

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

                  // Update Redux state with emailVerified flag set to false
                  dispatch(setUser({ ...userData, isPhoneVerified: !!firebaseUser.phoneNumber, emailVerified: false } as AuthUser));
                  dispatch(setTokens({
                    jwtToken,
                    refreshToken: `refresh_${firebaseUser.uid}_${Date.now()}`,
                    tokenExpiry,
                  }));
                } else {
                  console.log('AuthContext: User signed in and email verified', firebaseUser.uid);
                  // Email is verified - normal flow
                  // Get user profile from Firestore
                  const userDocRef = doc(collection(db, 'users'), firebaseUser.uid);
                  const userDocSnap = await getDoc(userDocRef);
                  let userData: Omit<AuthUser, 'isPhoneVerified' | 'emailVerified'> | null = userDocSnap.exists() ? userDocSnap.data() as Omit<AuthUser, 'isPhoneVerified' | 'emailVerified'> : null;

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

                  // Update Redux state with emailVerified flag set to true
                  dispatch(setUser({ ...userData, isPhoneVerified: !!firebaseUser.phoneNumber, emailVerified: true } as AuthUser));
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
      console.log('Refreshing user data for user:', currentUser.uid);
      // Reload the user to get the latest email verification status
      await currentUser.reload();
      
      const userDocRef = doc(collection(db, 'users'), currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() as Omit<AuthUser, 'isPhoneVerified' | 'emailVerified'> : null;
      if (userData) {
        // Convert Firestore Timestamps to serializable dates
        const convertedUserData = convertUserForRedux(userData);
        dispatch(setUser({ ...convertedUserData, isPhoneVerified: !!currentUser.phoneNumber, emailVerified: currentUser.emailVerified } as AuthUser));
        console.log('User data refreshed, email verified status:', currentUser.emailVerified);
      }
    }
  };
  
  const checkEmailVerification = async (): Promise<boolean> => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('Checking email verification status for user:', currentUser.uid);
      // Reload the user to get the latest email verification status
      await currentUser.reload();
      console.log('Email verification status:', currentUser.emailVerified);
      return currentUser.emailVerified;
    }
    console.log('No current user to check verification status for');
    return false;
  };

  // Auth methods that integrate with Redux
  const loginWithEmail = async (email: string, password: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      console.log('Attempting to log in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error('Login failed');
      }

      console.log('Login successful for user:', firebaseUser.uid);
      console.log('User email verified status:', firebaseUser.emailVerified);

      // Check if email is verified
      if (!firebaseUser.emailVerified) {
        console.log('User email not verified, signing out');
        // Sign out the user since email is not verified
        await signOut(auth);
        return { error: 'EMAIL_NOT_VERIFIED' };
      }

      // Get or create user profile
      const userDocRef = doc(collection(db, 'users'), firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      let userData = userDocSnap.exists() ? userDocSnap.data() as Omit<AuthUser, 'isPhoneVerified' | 'emailVerified'> : null;

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

      dispatch(setUser({ ...userData, isPhoneVerified: !!firebaseUser.phoneNumber } as AuthUser));
      dispatch(setTokens({
        jwtToken,
        refreshToken: `refresh_${firebaseUser.uid}_${Date.now()}`,
        tokenExpiry,
      }));

      console.log('Login completed successfully for user:', firebaseUser.uid);
      return { user: { ...userData, isPhoneVerified: !!firebaseUser.phoneNumber } };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = error.message || 'Login failed. Please try again.';
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please wait a few minutes before trying again. This is a temporary security measure by Firebase to prevent abuse.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check your email and try again.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please check your email or sign up for a new account.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please check your password and try again.';
      }
      
      dispatch(setError(errorMessage));
      return { error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const registerUser = async (email: string, password: string, displayName: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      console.log('Registering user with email:', email);
      const result = await authService.signupWithEmail(email, password, displayName);
      console.log('Registration result:', result);
      
      // If there's an error but the user was created, still return success
      // The UI will handle navigation to the verification screen
      if (result.user && result.needsEmailVerification) {
        console.log('User registered successfully, needs email verification');
        // Create user profile
        const userData = {
          userId: result.user.uid,
          email: result.user.email || '',
          displayName: displayName || result.user.displayName || '',
          phone: result.user.phoneNumber || '',
          profilePhotoURL: result.user.photoURL || '',
          role: 'customer' as const,
          status: 'active' as const,
          preferences: { cuisines: [], foodTypes: [], notifications: { orderUpdates: true, promotions: true, offers: true } },
          loyaltyPoints: 0,
          totalOrders: 0,
          joinedAt: new Date(),
        };

        const userDocRef = doc(collection(db, 'users'), result.user.uid);
        await setDoc(userDocRef, userData);
        
        // Initialize user subcollections with a delay to avoid permission issues
        setTimeout(async () => {
          try {
            await initializeUserSubcollections(result.user!.uid);
          } catch (error) {
            console.error('Error initializing user subcollections (non-blocking):', error);
            // This error shouldn't block the registration process
          }
        }, 1000);

        // Generate JWT token
        const jwtToken = await generateJWTToken(result.user.uid, userData);
        const tokenExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

        dispatch(setUser({ ...userData, isPhoneVerified: !!result.user.phoneNumber } as AuthUser));
        dispatch(setTokens({
          jwtToken,
          refreshToken: `refresh_${result.user.uid}_${Date.now()}`,
          tokenExpiry,
        }));

        return { user: { ...userData, isPhoneVerified: !!result.user.phoneNumber }, needsEmailVerification: true };
      }
      
      // If there's an error, return it
      if (result.error) {
        console.log('Registration error:', result.error);
        dispatch(setError(result.error));
        return { error: result.error };
      }
      
      // Fallback case
      return result;
    } catch (error: any) {
      console.error('Registration error:', error);
      dispatch(setError(error.message));
      return { error: error.message };
    } finally {
      dispatch(setLoading(false));
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
      checkEmailVerification,
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