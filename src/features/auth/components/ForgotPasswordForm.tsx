import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Button, Typography, Spacer } from '../../../components/common';
import { useThemeContext } from '../../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface ForgotPasswordFormProps {
  onForgotPassword: (email: string) => void;
  loading: boolean;
  error: string | null;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onForgotPassword, loading, error }) => {
  const { theme } = useThemeContext();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  useEffect(() => {
    setIsFormValid(validateEmail(email));
  }, [email]);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    onForgotPassword(email);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Typography variant="body2" color="text" style={styles.label}>
          Email Address
        </Typography>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: emailError ? '#EF4444' : theme.colors.border
            }
          ]}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={theme.colors.textSecondary}
        />
        {emailError ? (
          <Typography variant="caption" color="error" style={styles.errorText}>
            {emailError}
          </Typography>
        ) : (
          <Typography variant="caption" color="secondary" style={styles.helperText}>
            We'll send a password reset link to this email
          </Typography>
        )}
      </View>

      {error && (
        <>
          <Typography variant="body2" color="error" style={styles.errorText}>
            {error}
          </Typography>
          <Spacer height={4} />
        </>
      )}

      <Button
        title={loading ? "Sending Reset Link..." : "Send Reset Link"}
        onPress={handleSubmit}
        disabled={!isFormValid || loading}
        loading={loading}
        style={styles.resetButton}
        fullWidth
      />

      <Spacer height={16} />

      <View style={styles.infoBox}>
        <Typography variant="body2" color="secondary" style={styles.infoText}>
          📧 Check your email after submitting and follow the instructions to reset your password.
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  resetButton: {
    marginBottom: 8,
    opacity: 1,
  },
  errorText: {
    marginTop: 2,
    fontSize: 12,
  },
  helperText: {
    marginTop: 2,
    fontSize: 12,
  },
  infoBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: {
    textAlign: 'center',
    lineHeight: 16,
    fontSize: 13,
  },
});

export default ForgotPasswordForm;
