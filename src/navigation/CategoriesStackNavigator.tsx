import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CategoriesScreen from '../features/product/screens/CategoriesScreen';
import ProductScreen from '../features/product/screens/ProductScreen';
import ProductDetailsScreen from '../features/product/screens/ProductDetailsScreen';
import UnifiedHeader from '../components/layout/UnifiedHeader';

const Stack = createStackNavigator();

export const CategoriesStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. The Category List */}
      <Stack.Screen 
        name="CategoriesMain" 
        component={CategoriesScreen} 
        options={{ headerShown: false }} 
      />

      {/* 2. The Product List (Internal to this tab) */}
      <Stack.Screen
        name="Products"
        component={ProductScreen}
        options={({ navigation, route }) => ({
          header: () => (
            <UnifiedHeader
              title={(route.params as any)?.category || 'Products'}
              showBackButton={true}
              onBackPress={() => navigation.goBack()}
              showLocation={false}
              showSearch={false}
              showNotificationBell={false}
            />
          ),
          headerShown: true,
        })}
      />

      {/* 3. The Product Details (Internal to this tab) */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ navigation }) => ({
          header: () => (
            <UnifiedHeader
              title="Product Details"
              showBackButton={true}
              onBackPress={() => navigation.goBack()}
              showLocation={false}
              showSearch={false}
              showNotificationBell={false}
            />
          ),
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStackNavigator;