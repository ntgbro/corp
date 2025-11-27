import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../features/home/screens/HomeScreen';
import RestaurantDetailsScreen from '../features/home/screens/RestaurantDetailsScreen';
import ProductDetailsScreen from '../features/product/screens/ProductDetailsScreen';
// ✅ Import ProductScreen
import ProductScreen from '../features/product/screens/ProductScreen';
import { MainStackParamList } from './types';
import UnifiedHeader from '../components/layout/UnifiedHeader';

// ... existing handleBackNavigation ...
const handleBackNavigation = (navigation: any) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }
  // Fallback to Home tab root
  try {
    const tabNavigator = navigation.getParent();
    if (tabNavigator) {
      tabNavigator.navigate('Home'); 
    }
  } catch (error) { console.error(error); }
};

const Stack = createStackNavigator<MainStackParamList>();

export const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="RestaurantDetails"
        component={RestaurantDetailsScreen}
        options={({ navigation }) => ({
          header: () => (
            <UnifiedHeader
              title="Restaurant Details"
              showBackButton={true}
              onBackPress={() => handleBackNavigation(navigation)}
              showLocation={false}
              showSearch={false}
              showNotificationBell={false}
            />
          ),
          headerShown: true,
        })}
      />
      
      {/* ✅ ADD THIS: Products List in Home Stack */}
      <Stack.Screen
        name="Products"
        component={ProductScreen}
        options={({ navigation, route }) => ({
          header: () => (
            <UnifiedHeader
              title={(route.params as any)?.category || 'Menu'}
              showBackButton={true}
              onBackPress={() => handleBackNavigation(navigation)}
              showLocation={false}
              showSearch={false}
              showNotificationBell={false}
            />
          ),
          headerShown: true,
        })}
      />

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

export default HomeStackNavigator;