import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
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

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.user) {
      // Navigation will be handled by AuthContext
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
      Alert.alert('Google Sign-In Failed', result.error || 'Failed to sign in with Google');
    }
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <StatusBar
        barStyle={theme.colors.background === '#000000' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Login Form */}
          <LoginForm
            onLogin={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            loading={loading}
            error={null}
          />

          {/* Navigation Buttons */}
          <View style={styles.navigationSection}>
            <Button
              title="Create New Account"
              onPress={() => navigation.navigate('Signup')}
              variant="outline"
              style={styles.signupButton}
              fullWidth
            />

            <Spacer height={4} />

            <Button
              title="Forgot Password?"
              onPress={() => navigation.navigate('ForgotPassword')}
              variant="outline"
              style={styles.forgotButton}
              fullWidth
            />
          </View>

          <Spacer height={8} />
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
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  navigationSection: {
    marginTop: 12,
  },
  signupButton: {
    marginBottom: 0,
  },
  forgotButton: {
    marginBottom: 0,
  },
});

export default LoginScreen;
