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
import { ForgotPasswordForm } from '../components';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { SafeAreaWrapper } from '../../../components/layout';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { theme } = useThemeContext();
  const { forgotPassword, loading } = useEmailAuth();
  
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

  const handleForgotPassword = async (email: string) => {
    const result = await forgotPassword(email);
    if (result.success) {
      Alert.alert(
        'Reset Link Sent!',
        `We've sent a password reset link to ${email}. Please check your email and follow the instructions to reset your password.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to send reset email');
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

          {/* All content wrapped in a single card */}
          <View style={[styles.card, { backgroundColor: '#FBF5EB' }]}>
            {/* Forgot Password Form */}
            <ForgotPasswordForm
              onForgotPassword={handleForgotPassword}
              loading={loading}
              error={null}
            />

            {/* Navigation Buttons */}
            <View style={styles.navigationSection}>
              <Button
                title="Back to Sign In"
                onPress={() => navigation.goBack()}
                variant="outline"
                style={styles.backButton}
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
    justifyContent: 'center',
    padding: 16,
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
  backButton: {
    marginBottom: 0,
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
});

export default ForgotPasswordScreen;
