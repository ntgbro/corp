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
  if (user && user.emailVerified) {
    // If user is verified, show main app
    console.log('AppNavigator: Showing MainNavigator (user verified)');
    return <MainNavigator />;
  }
  
  // For all other cases (no user or user not verified), show AuthNavigator
  // This allows users to login, signup, and verify their email
  console.log('AppNavigator: Showing AuthNavigator');
  return <AuthNavigator />;
};

export default AppNavigator;