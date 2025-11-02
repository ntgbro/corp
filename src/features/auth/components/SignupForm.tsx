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

interface SignupFormProps {
  onSignup: (email: string, password: string, name: string) => void;
  onGoogleSignup: () => void;
  loading: boolean;
  error: string | null;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onGoogleSignup, loading, error }) => {
  const { theme } = useThemeContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  useEffect(() => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    setIsFormValid(isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid);
  }, [name, email, password, confirmPassword]);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please correct the errors below');
      return;
    }
    onSignup(email, password, name.trim());
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Typography variant="body2" color="text" style={styles.label}>
          Full Name
        </Typography>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: nameError ? '#EF4444' : theme.colors.border
            }
          ]}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          placeholderTextColor={theme.colors.textSecondary}
        />
        {nameError ? (
          <Typography variant="caption" color="error" style={styles.errorText}>
            {nameError}
          </Typography>
        ) : null}
      </View>

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
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.colors.textSecondary}
        />
        {passwordError ? (
          <Typography variant="caption" color="error" style={styles.errorText}>
            {passwordError}
          </Typography>
        ) : (
          <Typography variant="caption" color="secondary" style={styles.helperText}>
            At least 6 characters
          </Typography>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Typography variant="body2" color="text" style={styles.label}>
          Confirm Password
        </Typography>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: confirmPasswordError ? '#EF4444' : theme.colors.border
            }
          ]}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={theme.colors.textSecondary}
        />
        {confirmPasswordError ? (
          <Typography variant="caption" color="error" style={styles.errorText}>
            {confirmPasswordError}
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
        title={loading ? "Creating Account..." : "Create Account"}
        onPress={handleSubmit}
        disabled={!isFormValid || loading}
        loading={loading}
        style={styles.signupButton}
        fullWidth
      />

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        <Typography variant="body2" color="secondary" style={styles.dividerText}>
          OR
        </Typography>
        <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
      </View>

      {/* Custom Google Button with Icon */}
      <TouchableOpacity
        style={[
          styles.googleButton, 
          styles.googleButtonContainer,
          { 
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.primary,
            opacity: 1
          }
        ]}
        onPress={onGoogleSignup}
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
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 12,
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
  signupButton: {
    marginBottom: 12,
    opacity: 1,
  },
  googleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 44,
    marginBottom: 12,
  },
  googleButton: {
    marginBottom: 0,
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
  helperText: {
    marginTop: 2,
    fontSize: 12,
  },
});

export default SignupForm;
