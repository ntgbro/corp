import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useThemeContext } from '../contexts/ThemeContext';
import CartScreen from '../features/cart/screens/CartScreen';
import CouponsScreen from '../features/cart/coupons/CouponsScreen';
import OrderConfirmationScreen from '../features/cart/screens/OrderConfirmationScreen'; // Add this import

export type CartStackParamList = {
  Cart: undefined;
  Coupons: undefined;
  OrderConfirmation: { orderId: string }; // Add this route
};

const Stack = createStackNavigator<CartStackParamList>();

export const CartStackNavigator: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: 'My Cart' }}
      />
      <Stack.Screen 
        name="Coupons" 
        component={CouponsScreen} 
        options={{ title: 'Available Coupons' }}
      />
      <Stack.Screen 
        name="OrderConfirmation" 
        component={OrderConfirmationScreen} 
        options={{ title: 'Order Confirmed' }}
      />
    </Stack.Navigator>
  );
};

export default CartStackNavigator;