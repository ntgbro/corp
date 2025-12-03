import React, { useState, useEffect } from 'react';
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
  Linking,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Button, Typography, Spacer } from '../../../components/common';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { SafeAreaWrapper } from '../../../components/layout';
import { auth } from '../../../config/firebase';
import { sendEmailVerification } from '@react-native-firebase/auth';

type EmailVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'EmailVerification'>;
type EmailVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EmailVerification'>;

const EmailVerificationScreen: React.FC = () => {
  const route = useRoute<EmailVerificationScreenRouteProp>();
  const navigation = useNavigation<EmailVerificationScreenNavigationProp>();
  const { theme } = useThemeContext();
  const email = route.params?.email || '';
  
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  // Animation values
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.8);

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
    
    // Send verification email on mount
    console.log('EmailVerificationScreen mounted, sending verification email');
    // Add a delay to ensure user is fully created and auth state is stable
    setTimeout(() => {
      sendVerificationEmail();
    }, 3000);
    
    // Set up timer for resend button
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const sendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        console.log('Attempting to send verification email to:', auth.currentUser.email);
        await sendEmailVerification(auth.currentUser);
        console.log('Verification email sent successfully to:', auth.currentUser.email);
        Alert.alert('Verification Email Sent', `We've sent a verification email to ${email}. Please check your inbox and spam/junk folder. The email may take a few minutes to arrive.\n\nIf you don't receive the email:\n1. Check your spam/junk folder\n2. Try resending the email\n3. Verify the email address is correct\n4. Contact support if issues persist`);
      }
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      const errorMessage = error?.message || 'Failed to send verification email. Please try again.';
      
      // Provide more detailed error information
      let detailedErrorMessage = errorMessage;
      if (errorMessage.includes('TOO_MANY_ATTEMPTS')) {
        detailedErrorMessage = 'Too many verification requests. Please wait a few minutes before trying again.';
      } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        detailedErrorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      Alert.alert('Error Sending Email', `${detailedErrorMessage}\n\nPlease try again or contact support if the issue persists.`);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setTimeLeft(60);
    
    // Restart timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    await sendVerificationEmail();
  };

  const handleCheckVerification = async () => {
    setIsVerifying(true);
    try {
      if (auth.currentUser) {
        // Reload user to get updated email verification status
        await auth.currentUser.reload();
        
        if (auth.currentUser.emailVerified) {
          Alert.alert('Success', 'Your email has been verified successfully!');
          // Navigate to login screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } else {
          // Wait a bit more and try again
          await new Promise(resolve => setTimeout(resolve, 2000));
          await auth.currentUser.reload();
          
          if (auth.currentUser.emailVerified) {
            Alert.alert('Success', 'Your email has been verified successfully!');
            // Navigate to login screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } else {
            Alert.alert('Not Verified', 'Your email is not verified yet. Please check your inbox and spam/junk folder for the verification email and click the link. Emails may take a few minutes to arrive.\n\nIf you have clicked the link and are still seeing this message:\n1. Try refreshing this page\n2. Check if the link opened in a different browser\n3. Try resending the verification email\n4. Contact support if issues persist');
          }
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      Alert.alert('Error', 'Failed to check verification status. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenEmailApp = () => {
    const url = Platform.select({
      ios: 'message://',
      android: 'content://com.android.email.provider',
    });
    
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Info', 'Please check your email app for the verification email.');
        }
      });
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
              
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a verification email to {email}. Please check your inbox and spam/junk folder for an email from Firebase. Click the verification link in the email to continue.
              </Text>
            </View>

            {/* Content card */}
            <View style={[styles.card, { backgroundColor: '#FBF5EB' }]}>
              <View style={styles.content}>
                <View style={styles.iconPlaceholder}>
                  <Text style={styles.iconText}>📧</Text>
                </View>
                
                <Text style={styles.instructionText}>
                  Didn't receive the email? Check your spam/junk folder first, then click the button below to resend. Emails may take a few minutes to arrive.
                </Text>
                
                <View style={styles.buttonContainer}>
                  <Button
                    title={canResend ? "Resend Verification Email" : `Resend Email (${timeLeft}s)`}
                    onPress={handleResendEmail}
                    disabled={!canResend}
                    variant="primary"
                    fullWidth
                    style={styles.resendButton}
                  />
                  
                  <Button
                    title="Open Email App"
                    onPress={handleOpenEmailApp}
                    variant="outline"
                    fullWidth
                    style={styles.emailAppButton}
                  />
                  
                  <Button
                    title={isVerifying ? "Verifying..." : "I've Verified My Email"}
                    onPress={handleCheckVerification}
                    loading={isVerifying}
                    variant="primary"
                    fullWidth
                    style={styles.verifyButton}
                  />
                </View>
                
                <View style={styles.helpContainer}>
                  <Text style={styles.helpText}>
                    Need help? Contact support at support@corpease.com
                  </Text>
                </View>
              </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#754C29',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#754C29',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
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
  content: {
    padding: 20,
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5DEB3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 50,
  },
  instructionText: {
    fontSize: 16,
    color: '#754C29',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
  },
  resendButton: {
    marginBottom: 12,
  },
  emailAppButton: {
    marginBottom: 12,
  },
  verifyButton: {
    marginBottom: 12,
  },
  helpContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F5DEB3',
    borderRadius: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#754C29',
    textAlign: 'center',
  },
});

export default EmailVerificationScreen;