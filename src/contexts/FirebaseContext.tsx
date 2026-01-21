import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import {
  auth,
  db,
  firestore,
  storage,
  // analytics
} from '../config/firebase';

interface FirebaseContextType {
  // Services
  auth: any;
  db: any;
  firestore: any;
  storage: any;
  // analytics: any; // Removed analytics

  // Initialization status
  isInitialized: boolean;
  initializationError: string | null;

  // User state
  currentUser: any;
  isAuthenticated: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        console.log('🔥 Initializing Firebase services...');

        // Firebase is already initialized in config/firebase.ts
        // Just verify the services are available
        if (!auth || !db || !firestore || !storage) {
          throw new Error('Firebase services not properly initialized');
        }

        // Set up auth state listener using modular API
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          if (user) {
            console.log('✅ User authenticated:', user.uid);
            // Note: Don't automatically create user profile here
            // Let the AuthContext handle user profile creation
          } else {
            console.log('❌ User not authenticated');
          }
        });

        setIsInitialized(true);
        console.log('✅ Firebase initialization complete');

        // Cleanup function
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        setInitializationError(error instanceof Error ? error.message : 'Unknown error');
        setIsInitialized(true);
      }
    };

    initializeFirebase();
  }, []);

  const value: FirebaseContextType = {
    // Firebase services
    auth,
    db,
    firestore,
    storage,
    // analytics: null, // Removed analytics

    // Status
    isInitialized,
    initializationError,

    // User state
    currentUser,
    isAuthenticated: currentUser !== null,
  };

  // Don't render children until Firebase is initialized
  if (!isInitialized) {
    return null; // Or a loading screen
  }

  // If there's an initialization error, show error screen
  if (initializationError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10, textAlign: 'center' }}>
          Firebase Initialization Error
        </Text>
        <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
          {initializationError}
        </Text>
        <Text style={{ fontSize: 12, textAlign: 'center', color: '#666' }}>
          Please check your Firebase configuration
        </Text>
      </View>
    );
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseProvider;