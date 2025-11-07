import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainOrdersScreen from '../features/orders/screens/MainOrdersScreen';
import { OrderDetailsScreen } from '../features/orders/screens/OrderDetailsScreen';
import { MainTabParamList } from './types';

const Stack = createStackNavigator<MainTabParamList>();

export const OrdersStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Orders" 
        component={MainOrdersScreen} 
      />
      <Stack.Screen 
        name="OrderDetails" 
        component={OrderDetailsScreen} 
        options={{
          headerShown: true,
          title: 'Order Details',
        }}
      />
    </Stack.Navigator>
  );
};