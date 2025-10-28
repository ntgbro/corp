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
import { ForgotPasswordForm } from '../components';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { SafeAreaWrapper } from '../../../components/layout';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { theme } = useThemeContext();
  const { forgotPassword, loading } = useEmailAuth();

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
  backButton: {
    marginBottom: 0,
  },
});

export default ForgotPasswordScreen;
