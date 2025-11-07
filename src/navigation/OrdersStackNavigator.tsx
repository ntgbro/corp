import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainOrdersScreen from '../features/orders/screens/MainOrdersScreen';
import { OrderDetailsScreen } from '../features/orders/screens/OrderDetailsScreen';

export type OrdersStackParamList = {
  MainOrders: undefined;
  OrderDetails: { orderId: string };
};

const Stack = createStackNavigator<OrdersStackParamList>();

export const OrdersStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="MainOrders" 
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