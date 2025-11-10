import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { MainStackParamList } from './types';
import ProductScreen from '../features/product/screens/ProductScreen';
import ProductsPage from '../features/product/screens/ProductsPage';
import ProductDetailsScreen from '../features/product/screens/ProductDetailsScreen';
import SearchResultsScreen from '../features/product/screens/SearchResultsScreen';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import { useThemeContext } from '../contexts/ThemeContext';

const Stack = createStackNavigator<MainStackParamList>();

// Custom back navigation handler that properly handles tab navigation
const handleBackNavigation = (navigation: any) => {
  console.log('[NAVIGATION] Back navigation triggered');
  
  // First, try to go back within the current stack
  if (navigation.canGoBack()) {
    console.log('[NAVIGATION] Going back within current stack');
    navigation.goBack();
    return;
  }
  
  console.log('[NAVIGATION] Cannot go back within current stack, switching to Categories tab');
  
  // If we can't go back within the stack, we need to switch tabs
  try {
    // Get the tab navigator (parent of this stack)
    const tabNavigator = navigation.getParent();
    
    if (tabNavigator) {
      console.log('[NAVIGATION] Navigating to Categories tab via parent navigator');
      // Navigate to the Categories tab
      tabNavigator.navigate('Categories');
    } else {
      // If we can't get the tab navigator, try a different approach
      console.log('[NAVIGATION] Attempting alternative navigation approach');
      
      // Try to reset to the main navigator with Categories selected
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              routes: [
                {
                  name: 'Categories'
                }
              ],
              index: 0
            }
          }
        ]
      });
    }
  } catch (error) {
    console.error('[NAVIGATION] Error in back navigation:', error);
    
    // Ultimate fallback - try to navigate directly if possible
    try {
      navigation.navigate('Main', { screen: 'Categories' });
    } catch (finalError) {
      console.error('[NAVIGATION] All navigation attempts failed:', finalError);
    }
  }
};

export const ProductStackNavigator: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={ProductScreen}
        options={({ route, navigation }) => ({
          header: () => {
            console.log('[NAVIGATION] Rendering Products screen header', route.params);
            return (
              <UnifiedHeader
                title={getHeaderTitleForProducts(route)}
                showBackButton={true}
                onBackPress={() => handleBackNavigation(navigation)}
                showLocation={false}
                showSearch={false}
                showNotificationBell={false}
              />
            );
          },
        })}
      />
      <Stack.Screen
        name="ProductsPage"
        component={ProductsPage}
        options={({ route, navigation }) => ({
          header: () => {
            console.log('[NAVIGATION] Rendering ProductsPage screen header', route.params);
            return (
              <UnifiedHeader
                title={`${(route.params as any)?.category || 'Category'} Items`}
                showBackButton={true}
                onBackPress={() => handleBackNavigation(navigation)}
                showLocation={false}
                showSearch={false}
                showNotificationBell={false}
              />
            );
          },
        })}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          header: ({ navigation }) => {
            console.log('[NAVIGATION] Rendering ProductDetails screen header');
            return (
              <UnifiedHeader
                title="Product Details"
                showBackButton={true}
                onBackPress={() => handleBackNavigation(navigation)}
                showLocation={false}
                showSearch={false}
                showNotificationBell={false}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={({ route, navigation }) => ({
          header: () => {
            console.log('[NAVIGATION] Rendering SearchResults screen header', route.params);
            return (
              <UnifiedHeader
                title={`Search: "${(route.params as any)?.searchQuery}"`}
                showBackButton={true}
                onBackPress={() => handleBackNavigation(navigation)}
                showLocation={false}
                showSearch={true}
                showNotificationBell={false}
              />
            );
          },
        })}
      />
      <Stack.Screen
        name="ChefProfile"
        component={ProductsPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

// Helper function to get appropriate header titles for Products screen
const getHeaderTitleForProducts = (route: any): string => {
  const category = (route.params as any)?.category;
  const restaurantId = (route.params as any)?.restaurantId;
  const searchQuery = (route.params as any)?.searchQuery;

  if (searchQuery) {
    return `Search: "${searchQuery}"`;
  }

  if (restaurantId) {
    return `${category || 'Menu'} Items`;
  }

  return category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Products';
};

export default ProductStackNavigator;