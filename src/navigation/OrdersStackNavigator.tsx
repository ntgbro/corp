import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainOrdersScreen } from '../features/orders/screens/MainOrdersScreen';
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
          headerStyle: {
            backgroundColor: '#F5DEB3',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
          headerTitleStyle: {
            color: '#000000',
            fontWeight: '600',
          },
          headerTintColor: '#000000',
        }}
      />
    </Stack.Navigator>
  );
};