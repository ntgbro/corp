import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppNavigator } from './navigation';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useThemeContext } from './contexts/ThemeContext';
import { store, persistor } from './store';

// Google Sign-In configuration
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LocationProvider } from './contexts/LocationContext';

// Helper function to validate Google Sign-In configuration
const validateGoogleSignInConfig = async () => {
  try {
    // Check if Google Sign-In is available
    if (!GoogleSignin) {
      console.warn('Google Sign-In is not available');
      return false;
    }
    
    // Check if Play Services are available
    const hasPlayServices = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
    if (!hasPlayServices) {
      console.warn('Google Play Services not available');
      return false;
    }
    
    console.log('Google Sign-In configuration appears to be valid');
    return true;
  } catch (error) {
    console.warn('Google Sign-In configuration error:', error);
    return false;
  }
};

const AppContent: React.FC = () => {
  const { theme } = useThemeContext();
  const [appReady, setAppReady] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  // Create navigation theme based on current theme
  const navigationTheme = {
    dark: theme.colors.background === '#000000',
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '600' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
    },
  };

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Configure Google Sign-In with the Web Client ID from your google-services.json
        // Based on your updated google-services.json, this should be the Web Client ID:
        const webClientId = '371942129309-66v94c22rh7j5uo4f3k6qnpkebocat8u.apps.googleusercontent.com';
        
        // Configure Google Sign-In if we have a valid webClientId
        if (webClientId) {
          GoogleSignin.configure({
            webClientId: webClientId,
            offlineAccess: true, // Ensures we get a refresh token
          });
          
          // Validate Google Sign-In configuration
          await validateGoogleSignInConfig();
        } else {
          console.log('Google Sign-In not configured - skipping configuration');
        }
        
        // Add any initialization logic here
        // For now, just add a small delay to simulate loading
        setTimeout(() => {
          setAppReady(true);
        }, 1000);
      } catch (error) {
        console.error('App initialization error:', error);
        setAppError('Failed to initialize app');
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  // Loading screen
  if (!appReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading Corpease...
        </Text>
        <Text style={[styles.loadingSubtext, { color: theme.colors.textSecondary }]}>
          Setting up your experience
        </Text>
      </View>
    );
  }

  // Error screen
  if (appError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {appError}
        </Text>
        <Text style={[styles.errorSubtext, { color: theme.colors.textSecondary }]}>
          Please restart the app
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <LocationProvider>
            <FirebaseProvider>
              <AuthProvider>
                <NotificationProvider>
                  <CartProvider>
                    <AppContent />
                  </CartProvider>
                </NotificationProvider>
              </AuthProvider>
            </FirebaseProvider>
          </LocationProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default App;