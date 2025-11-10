import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../features/home/screens/HomeScreen';
import RestaurantDetailsScreen from '../features/home/screens/RestaurantDetailsScreen';
import { MainStackParamList } from './types';

const Stack = createStackNavigator<MainStackParamList>();

export const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;