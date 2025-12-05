import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, AuthNavigator, MainNavigator } from './index';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    console.log('AppNavigator: Loading auth state');
    return null; // Or a loading screen
  }

  console.log('AppNavigator: User state:', user ? 'Logged in' : 'Not logged in');
  if (user) {
    console.log('AppNavigator: User email verified:', user.emailVerified);
  }

  // Check if user exists and is email verified
  // If user exists but is not verified, show AuthNavigator instead
  // Exception: Allow users to access AuthNavigator even if they're not verified
  // so they can complete the email verification process
  if (user) {
    // If user is verified, show main app
    if (user.emailVerified) {
      console.log('AppNavigator: Showing MainNavigator (user verified)');
      return <MainNavigator />;
    }
    // If user is not verified, still show AuthNavigator to allow verification
    // The EmailVerification screen will be accessible through the AuthNavigator
    console.log('AppNavigator: Showing AuthNavigator (user not verified)');
    return <AuthNavigator />;
  }
  
  // No user, show AuthNavigator
  console.log('AppNavigator: Showing AuthNavigator (no user)');
  return <AuthNavigator />;
};

export default AppNavigator;