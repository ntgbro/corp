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
import { SignupForm } from '../components';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { SafeAreaWrapper } from '../../../components/layout';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { theme } = useThemeContext();
  const { signup, googleSignIn, loading } = useEmailAuth();

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
  loginButton: {
    marginBottom: 0,
  },
});

export default SignupScreen;
