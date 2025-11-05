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
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Button, Typography, Spacer } from '../../../components/common';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { SignupForm } from '../components';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { SafeAreaWrapper } from '../../../components/layout';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { theme } = useThemeContext();
  const { signup, googleSignIn, loading } = useEmailAuth();
  
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

  const handleSignup = async (email: string, password: string, name: string) => {
    const result = await signup(email, password, name);
    if (result.user) {
      Alert.alert('Success', 'Account created successfully!');
      // Navigation will be handled by AuthContext
    } else {
      Alert.alert('Signup Failed', result.error || 'Failed to create account');
    }
  };

  const handleGoogleSignup = async () => {
    const result = await googleSignIn();
    if (result.user) {
      Alert.alert('Success', 'Account created with Google!');
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          </View>

          {/* All content wrapped in a View with card-like styling */}
          <View style={[styles.card, { backgroundColor: '#FBF5EB' }]}>
            {/* Signup Form */}
            <SignupForm
              onSignup={handleSignup}
              onGoogleSignup={handleGoogleSignup}
              loading={loading}
              error={null}
            />

            {/* Navigation Buttons */}
            <View style={styles.navigationSection}>
              <Button
                title="Already have an account? Sign In"
                onPress={() => navigation.navigate('Login')}
                variant="outline"
                style={styles.loginButton}
                fullWidth
              />
            </View>

            <Spacer height={8} />
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
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoWrapper: {
    // This wrapper helps with the animation
  },
  logo: {
    width: 320,
    height: 150,
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
  loginButton: {
    marginBottom: 0,
  },
});

export default SignupScreen;