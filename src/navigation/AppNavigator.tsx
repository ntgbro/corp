import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, AuthNavigator, MainNavigator } from './index';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigatorContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return user ? <MainNavigator /> : <AuthNavigator />;
};

const AppNavigator: React.FC = () => {
  return <AppNavigatorContent />;
};

export default AppNavigator;
