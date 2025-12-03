import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Button, Typography, Spacer } from '../../../components/common';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { LoginForm } from '../components';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { SafeAreaWrapper } from '../../../components/layout';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { theme } = useThemeContext();
  const { login, googleSignIn, loading } = useEmailAuth();
  
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start the logo animation when the component mounts
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.user) {
      // Navigation will be handled by AuthContext
    } else if (result.error === 'EMAIL_NOT_VERIFIED') {
      // Show alert with guidance then navigate to email verification screen
      Alert.alert(
        'Email Not Verified',
        'Please check your email (and spam/junk folder) for a verification email from Firebase. Click the verification link to activate your account. If you cannot find the email, we can resend it.',
        [
          {
            text: 'Resend Email',
            onPress: () => {
              // Navigate to email verification screen
              navigation.navigate('EmailVerification' as any, { email });
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } else {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await googleSignIn();
    if (result.user) {
      Alert.alert('Success', 'Logged in with Google!');
      // Navigation will be handled by AuthContext
    } else {
      // Provide more specific error message for configuration issues
      let errorMessage = result.error || 'Failed to sign in with Google';
      if (errorMessage.includes('configured') || errorMessage.includes('DEVELOPER_ERROR') || errorMessage.includes('apiClient is null')) {
        errorMessage += '\n\nTo fix this issue:\n' +
          '1. Add your app\'s SHA-1 fingerprint in Firebase Console > Project Settings > General\n' +
          '2. Enable Google Sign-In in Firebase Console > Authentication > Sign-in method\n' +
          '3. Ensure google-services.json is in android/app/\n\n' +
          'Note: Web Client ID appears to be configured correctly now.';
      }
      Alert.alert('Google Sign-In Failed', errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: '#F5DEB3' }}>
      <StatusBar
        barStyle={theme.colors.background === '#000000' ? 'light-content' : 'dark-content'}
        backgroundColor="#F5DEB3"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* CorpEase Logo at the top with animation */}
            <View style={styles.logoContainer}>
              <Animated.View
                style={[
                  styles.logoWrapper,
                  {
                    opacity: logoOpacity,
                    transform: [{ scale: logoScale }],
                  },
                ]}
              >
                <Image
                  source={require('../../../assets/Corpeas_new.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Animated.View>
              {/* Tagline below the logo */}
              <Text style={styles.tagline}>
                The modern platform for fresh produce, FMCG, and supply chain-built for business
              </Text>
            </View>

            {/* All content wrapped in a View with card-like styling at the bottom */}
            <View style={[styles.card, { backgroundColor: '#FBF5EB' }]}>
              <LoginForm
                onLogin={handleLogin}
                onGoogleLogin={handleGoogleLogin}
                loading={loading}
                error={null}
                onForgotPassword={handleForgotPassword}
              />

              {/* Navigation Buttons - Reordered */}
              <View style={styles.navigationSection}>
                <Button
                  title="Create New Account"
                  onPress={() => navigation.navigate('Signup')}
                  variant="primary"
                  style={styles.signupButton}
                  fullWidth
                />
                
                {/* Continue with Google Button - Moved here and placed after Create New Account */}
                <TouchableOpacity
                  style={[
                    styles.googleButtonContainer,
                    { 
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderColor: theme.colors.primary,
                      opacity: 1
                    }
                  ]}
                  onPress={handleGoogleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('../../../assets/icons/google_icon.png')}
                    style={styles.googleIcon}
                  />
                  <Text style={[styles.googleButtonText, { color: theme.colors.primary }]}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              </View>

              <Spacer height={8} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F5DEB3',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  logoWrapper: {
    // This wrapper helps with the animation
  },
  logo: {
    width: 320,
    height: 150,
  },
  tagline: {
    color: '#754C29',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  card: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  navigationSection: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  signupButton: {
    marginBottom: 12, // Add margin to separate buttons
  },
  googleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 44,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

export default LoginScreen;