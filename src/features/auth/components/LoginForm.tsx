import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Button, Typography, Spacer } from '../../../components/common';
import { useThemeContext } from '../../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  loading: boolean;
  error: string | null;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoogleLogin, loading, error, onForgotPassword }) => {
  const { theme } = useThemeContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  useEffect(() => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please correct the errors below');
      return;
    }
    onLogin(email, password);
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
              backgroundColor: '#FBF5EB',
              color: theme.colors.text,
              borderColor: emailError ? '#EF4444' : theme.colors.border
            }
          ]}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#6b7280"
        />
        {emailError ? (
          <Typography variant="caption" color="error" style={styles.errorText}>
            {emailError}
          </Typography>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <Typography variant="body2" color="text" style={styles.label}>
          Password
        </Typography>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: '#FBF5EB',
              color: theme.colors.text,
              borderColor: passwordError ? '#EF4444' : theme.colors.border
            }
          ]}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#6b7280"
        />
        {passwordError ? (
          <Typography variant="caption" color="error" style={styles.errorText}>
            {passwordError}
          </Typography>
        ) : null}
      </View>

      {/* Forgot Password Button - Positioned to the right below password field */}
      {onForgotPassword && (
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={onForgotPassword}>
            <Typography variant="body1" color="primary" style={styles.forgotPasswordText}>
              Forgot Password?
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <>
          <Typography variant="body2" color="error" style={styles.errorText}>
            {error}
          </Typography>
          <Spacer height={4} />
        </>
      )}

      <Button
        title={loading ? "Signing In..." : "Sign In"}
        onPress={handleSubmit}
        disabled={!isFormValid || loading}
        loading={loading}
        style={styles.loginButton}
        textStyle={styles.loginButtonText}
        fullWidth
      />

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        <Typography variant="body2" color="secondary" style={styles.dividerText}>
          OR
        </Typography>
        <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
      </View>

      {/* Google Button moved to LoginScreen */}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 0,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
    marginTop: 12, // Adding padding above the label
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FBF5EB',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  forgotPasswordText: {
    fontWeight: '500',
    fontSize: 16,
  },
  loginButton: {
    marginBottom: 12,
    zIndex: 1,
    opacity: 1,
  },
  loginButtonText: {
    color: '#ffffff',
    zIndex: 2,
  },
  googleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: 'transparent',
    minHeight: 44,
    opacity: 1,
  },
  googleButton: {
    marginBottom: 0,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 2,
    fontSize: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

export default LoginForm;