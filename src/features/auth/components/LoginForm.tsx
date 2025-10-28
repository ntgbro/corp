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
import { Button, Typography, Card, Spacer } from '../../../components/common';
import { useThemeContext } from '../../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  loading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoogleLogin, loading, error }) => {
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
    <Card style={styles.card}>
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
            placeholder="Enter your email"
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
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: passwordError ? '#EF4444' : theme.colors.border
              }
            ]}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.textSecondary}
          />
          {passwordError ? (
            <Typography variant="caption" color="error" style={styles.errorText}>
              {passwordError}
            </Typography>
          ) : null}
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
          title={loading ? "Signing In..." : "Sign In"}
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
          loading={loading}
          style={styles.loginButton}
          fullWidth
        />

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <Typography variant="body2" color="secondary" style={styles.dividerText}>
            OR
          </Typography>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <Button
          title="Continue with Google"
          onPress={onGoogleLogin}
          disabled={loading}
          variant="outline"
          style={styles.googleButton}
          fullWidth
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 2,
    padding: 2,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
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
    marginBottom: 8,
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
  loginButton: {
    marginBottom: 12,
  },
  googleButton: {
    marginBottom: 0,
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
});

export default LoginForm;
