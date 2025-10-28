// Firebase Authentication Service
//
// This service provides authentication functionality using Firebase Auth,
// including email/password, phone number, and Google Sign-In.
//
// Setup Instructions:
// 1. Install Firebase and Google Sign-In packages:
//    npm install @react-native-firebase/auth @react-native-google-signin/google-signin
//
// 2. Configure Firebase in your project:
//    - Add google-services.json (Android) and GoogleService-Info.plist (iOS)
//    - Enable Google Sign-In in Firebase Console > Authentication > Sign-in method
//    - Add your app's SHA-1 fingerprint for Android
//
// 3. Initialize Google Sign-In in your app (e.g., in App.tsx):
//    import { GoogleSignin } from '@react-native-google-signin/google-signin';
//    GoogleSignin.configure({
//      webClientId: 'YOUR_WEB_CLIENT_ID', // From Firebase Console
//    });
//
// 4. Use the authService in your components via useEmailAuth hook.
//
// For more details, see Firebase documentation and Google Sign-In setup guides.
import { getAuth, signInWithPhoneNumber, signOut as firebaseSignOut, PhoneAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { 
  FirebaseAuthTypes,
  FirebaseAuthTypes as FirebaseAuth 
} from '@react-native-firebase/auth';
import { isRetryableAuthError } from './authHelpers';

type FirebaseUser = FirebaseAuth.User;
type FirebaseConfirmationResult = FirebaseAuth.ConfirmationResult;

// Get the auth instance using the new modular API
const auth = getAuth();

const obfuscatePhoneNumber = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length <= 4) return digits;
  return digits.substring(0, 2) + '*'.repeat(digits.length - 4) + digits.substring(digits.length - 2);
};

// Store confirmation objects to avoid passing through navigation
let currentConfirmation: FirebaseConfirmationResult | null = null;

export interface AuthResult {
  user: FirebaseUser | null;
  error?: string;
}

export interface GoogleSignInResult {
  user: FirebaseUser | null;
  error?: string;
}

export const authService = {
  /**
   * Store confirmation object for later use
   */
  setCurrentConfirmation: (confirm: FirebaseConfirmationResult | null) => {
    currentConfirmation = confirm;
  },

  /**
   * Get stored confirmation object
   */
  getCurrentConfirmation: (): FirebaseConfirmationResult | null => {
    return currentConfirmation;
  },

  /**
   * Clear stored confirmation object
   */
  clearCurrentConfirmation: () => {
    currentConfirmation = null;
  },

  /**
   * Send OTP to phone number with production-ready implementation
   * @param phoneNumber - Full phone number with country code (e.g., +1234567890)
   * @returns Promise<{ confirm: FirebaseConfirmationResult | null; error?: string }>
   */
  sendOTP: async (phoneNumber: string, retryCount = 0): Promise<{ confirm: FirebaseConfirmationResult | null; error?: string }> => {
    const maxRetries = 3;
    try {
      // Validate phone number format
      if (!phoneNumber || phoneNumber.length < 10) {
        console.error('Invalid phone number format:', phoneNumber);
        return { confirm: null, error: 'Invalid phone number' };
      }

      // Remove any spaces or special characters except + and numbers
      const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');

      // Ensure it starts with +
      const formattedPhoneNumber = cleanPhoneNumber.startsWith('+')
        ? cleanPhoneNumber
        : `+${cleanPhoneNumber}`;

      console.log('Sending OTP to:', obfuscatePhoneNumber(formattedPhoneNumber));
      console.log('Firebase Auth instance:', auth ? 'Initialized' : 'Not initialized');
      console.log('App name:', auth.app.name);

      try {
        // Using the new modular API
        const confirm = await signInWithPhoneNumber(auth, formattedPhoneNumber);

        console.log('OTP sent successfully - user will receive SMS');
        console.log('Confirmation object received');
        
        currentConfirmation = confirm;
        return { confirm };
      } catch (firebaseError: any) {
        console.error('Firebase Auth Error:', {
          code: firebaseError.code,
          message: firebaseError.message,
          stack: firebaseError.stack
        });

        // Handle specific error for missing client identifier
        if (firebaseError.code === 'auth/missing-client-identifier') {
          throw new Error(
            'Authentication failed. Please make sure you have proper Google Play Services installed and try again.'
          );
        }

        throw firebaseError;
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);

      // Check if error is retryable
      if (isRetryableAuthError(error) && retryCount < maxRetries) {
        console.log(`Retrying OTP send (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise<void>(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return await authService.sendOTP(phoneNumber, retryCount + 1);
      }

      let errorMessage = 'Failed to send OTP';

      // Handle specific Firebase errors based on documentation
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      } else if (error.code === 'auth/invalid-app-credential') {
        errorMessage = 'Invalid app configuration. Please check Firebase setup.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Phone authentication is not enabled in Firebase Console.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please restart the app and try again.';
      }

      return { confirm: null, error: errorMessage };
    }
  },

  /**
   * Verify OTP code
   * @param code - 6-digit OTP code
   * @returns Promise<AuthResult>
   */
  verifyOTP: async (code: string): Promise<AuthResult> => {
    try {
      // Get stored confirmation object
      console.log('verifyOTP - Using stored confirmation object');
      console.log('verifyOTP - Confirm is null:', currentConfirmation === null);
      console.log('verifyOTP - OTP code:', code);

      if (!currentConfirmation) {
        console.error('No confirmation object stored - this usually means the phone number is not a test number');
        return { user: null, error: 'Invalid phone number or test number not configured. Please use +919876543210 for testing.' };
      }

      // Validate OTP code
      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        return { user: null, error: 'Invalid OTP code format' };
      }

      console.log('Verifying OTP code:', code);

      // Confirm the code
      const result = await currentConfirmation.confirm(code);

      if (result && result.user) {
        console.log('OTP verified successfully, user:', obfuscatePhoneNumber(result.user?.phoneNumber || ''));
        return { user: result.user };
      } else {
        console.log('OTP verification failed - no user returned');
        return { user: null, error: 'Verification failed' };
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error?.message || 'Unknown error');
      // Don't log the full error object to avoid deprecation warnings

      let errorMessage = 'Invalid OTP code';

      // Handle specific Firebase errors
      if (error?.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code - please use 654321 for test number +919876543210';
      } else if (error?.code === 'auth/code-expired') {
        errorMessage = 'OTP code has expired';
      } else if (error?.code === 'auth/invalid-verification-id') {
        errorMessage = 'Verification session expired. Please request new OTP.';
      }

      return { user: null, error: errorMessage };
    }
  },

  /**
   * Sign out current user
   * @returns Promise<void>
   */
  signOut: async (): Promise<void> => {
    try {
      // Clear any stored confirmation
      currentConfirmation = null;
      
      // Sign out from Firebase using the new modular API
      await firebaseSignOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   * @returns Promise<AuthResult>
   */
  loginWithEmail: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  /**
   * Signup with email and password
   * @param email - User email
   * @param password - User password
   * @param name - User name
   * @returns Promise<AuthResult>
   */
  signupWithEmail: async (email: string, password: string, name: string): Promise<AuthResult> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update user profile with name
      await userCredential.user.updateProfile({ displayName: name });
      return { user: userCredential.user };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  /**
   * Google Sign-In
   * @returns Promise<GoogleSignInResult>
   */
  googleSignIn: async (): Promise<GoogleSignInResult> => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential((signInResult as any).idToken);
      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      return { user: userCredential.user };
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      let errorMessage = 'Google Sign-In failed';
      if (error.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'IN_PROGRESS') {
        errorMessage = 'Sign-in is already in progress';
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services not available';
      }
      return { user: null, error: errorMessage };
    }
  },

  /**
   * Forgot password
   * @param email - User email
   * @returns Promise<{ success: boolean; error?: string }>
   */
  forgotPassword: async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Google Sign-Out
   * @returns Promise<void>
   */
  googleSignOut: async (): Promise<void> => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google Sign-Out error:', error);
    }
  },
};
