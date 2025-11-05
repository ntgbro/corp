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
// Google Sign-In Troubleshooting:
// If you get "DEVELOPER_ERROR", check:
// 1. Web Client ID is correct (from Firebase Console > Project Settings > General)
// 2. SHA-1 fingerprint is added to Firebase Console > Project Settings > General
// 3. Google Sign-In is enabled in Firebase Console > Authentication > Sign-in method
// 4. google-services.json is properly placed in android/app/ (for Android)
// 5. For iOS, ensure GoogleService-Info.plist is properly configured
//
// To get your Web Client ID:
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Select your project
// 3. Go to Project Settings > General
// 4. Under "Your apps", find your web app (or create one)
// 5. Copy the Web Client ID
//
// To get your SHA-1 fingerprint for development:
// keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
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
        const fbCode = firebaseError?.code ?? '';
        const fbMessage = firebaseError?.message ?? String(firebaseError ?? '');
        const fbStack = firebaseError?.stack ?? '';

        console.error('Firebase Auth Error:', { code: fbCode, message: fbMessage, stack: fbStack, raw: firebaseError });

        // Handle specific error for missing client identifier
        if (fbCode === 'auth/missing-client-identifier') {
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
      if (error && typeof error === 'object') {
        if (error && error.code && error.code === 'auth/invalid-phone-number') {
          errorMessage = 'Invalid phone number format';
        } else if (error && error.code && error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (error && error.code && error.code === 'auth/quota-exceeded') {
          errorMessage = 'SMS quota exceeded. Please try again later.';
        } else if (error && error.code && error.code === 'auth/invalid-app-credential') {
          errorMessage = 'Invalid app configuration. Please check Firebase setup.';
        } else if (error && error.code && error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Phone authentication is not enabled in Firebase Console.';
        } else if (error && error.code && error.code === 'auth/requires-recent-login') {
          errorMessage = 'Please restart the app and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = error.toString();
        }
      } else if (error) {
        errorMessage = error.toString();
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
      const code = error?.code ?? '';
      const message = error?.message ?? String(error ?? '');
      console.error('Error verifying OTP:', { code, message, raw: error });

      let errorMessage = 'Invalid OTP code';

      if (code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code. Please check the code and try again.';
      } else if (code === 'auth/session-expired' || code === 'auth/code-expired') {
        errorMessage = 'Verification code expired. Please request a new code.';
      } else if (code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (message) {
        errorMessage = message;
      }

      return { user: null, error: errorMessage };
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
      // Add proper error checking
      if (error && typeof error === 'object' && error.message) {
        return { user: null, error: error.message };
      } else if (error) {
        return { user: null, error: error.toString() };
      }
      return { user: null, error: 'An unknown error occurred' };
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
      // Add proper error checking
      if (error && typeof error === 'object' && error.message) {
        return { user: null, error: error.message };
      } else if (error) {
        return { user: null, error: error.toString() };
      }
      return { user: null, error: 'An unknown error occurred' };
    }
  },

  /**
   * Google Sign-In
   * @returns Promise<GoogleSignInResult>
   */
  /**
   * Google Sign-In (defensive: supports multiple result shapes)
   */
  googleSignIn: async (): Promise<GoogleSignInResult> => {
    try {
      if (!GoogleSignin) {
        return { user: null, error: 'Google Sign-In is not available. Please check your app setup.' };
      }

      // Ensure Play Services (Android)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Do the sign in call
      const signInResult = await GoogleSignin.signIn();

      // Helpful debug: print the top-level shape so you can inspect it from the device log
      try {
        // Avoid JSON.stringify blowing up for circular structures
        console.log('googleSignIn - signInResult (top-level keys):', Object.keys(signInResult ?? {}));
      } catch {
        console.log('googleSignIn - signInResult (raw):', signInResult);
      }

      // Defensive extraction of idToken from multiple possible shapes:
      // - { idToken: '...' }
      // - { data: { idToken: '...' } } (some wrappers)
      // - { data: { id_token: '...' } } (different naming)
      // - { user: { idToken: '...' } }
      // - { authentication: { idToken: '...' } }
      const asAny: any = signInResult ?? {};
      const idToken =
        (asAny?.idToken as string) ??
        (asAny?.data?.idToken as string) ??
        (asAny?.data?.id_token as string) ??
        (asAny?.data?.authentication?.idToken as string) ??
        (asAny?.authentication?.idToken as string) ??
        (asAny?.user?.idToken as string) ??
        '';

      if (!idToken) {
        // Provide a helpful log of nested fields so you can inspect token location
        console.error('Google Sign-In missing idToken: ', signInResult);
        // also log common fallback tokens if present
        const accessToken =
          asAny?.accessToken ?? asAny?.data?.accessToken ?? asAny?.data?.access_token ?? asAny?.authentication?.accessToken ?? '';
        console.error('googleSignIn - found other tokens:', { accessToken });

        return { user: null, error: 'Google Sign-In failed: missing idToken from Google response.' };
      }

      // Create credential and sign in with Firebase
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      return { user: userCredential.user };
    } catch (error: any) {
      const code = error?.code ?? '';
      const message = error?.message ?? String(error ?? '');
      console.error('Google Sign-In error (safe):', { code, message, raw: error });

      let errorMessage = 'Google Sign-In failed';

      if (message.includes('apiClient is null')) {
        errorMessage = 'Google Sign-In is not properly configured. Make sure GoogleSignin.configure({ webClientId }) runs before sign in.';
      } else if (message.includes('DEVELOPER_ERROR') || code === 'DEVELOPER_ERROR') {
        errorMessage = 'Configuration error: verify your webClientId, SHA-1 and Firebase Console settings.';
      } else if (code === 'SIGN_IN_CANCELLED' || message.toLowerCase().includes('cancel')) {
        errorMessage = 'Sign-in was cancelled';
      } else if (code === 'IN_PROGRESS') {
        errorMessage = 'Sign-in is already in progress';
      } else if (code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services not available';
      } else if (message) {
        errorMessage = message;
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
      // Add proper error checking
      if (error && typeof error === 'object' && error.message) {
        return { success: false, error: error.message };
      } else if (error) {
        return { success: false, error: error.toString() };
      }
      return { success: false, error: 'An unknown error occurred' };
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
    } catch (error: any) {
      console.error('Google Sign-Out error:', error);
      // Don't throw the error to prevent app crashes, just log it
    }
  },

  /**
   * Sign out from Firebase
   * @returns Promise<void>
   */
  signOut: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
};