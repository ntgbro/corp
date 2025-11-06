import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { MainStackParamList } from './types';
import ProductScreen from '../features/product/screens/ProductScreen';
import ProductsPage from '../features/product/screens/ProductsPage';
import RestaurantDetailsScreen from '../features/home/screens/RestaurantDetailsScreen';
import ProductDetailsScreen from '../features/product/screens/ProductDetailsScreen';
import SearchResultsScreen from '../features/product/screens/SearchResultsScreen';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import { useThemeContext } from '../contexts/ThemeContext';

const Stack = createStackNavigator<MainStackParamList>();

export const ProductStackNavigator: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => (
          <UnifiedHeader
            title={getHeaderTitle(props.route.name)}
            showBackButton={props.navigation.canGoBack()}
            onBackPress={props.navigation.goBack}
            showLocation={props.route.name === 'Products'}
            showSearch={props.route.name === 'Products'}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Products"
        component={ProductScreen}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: getHeaderTitleForProducts(route),
          header: (props) => (
            <UnifiedHeader
              title={getHeaderTitleForProducts(props.route)}
              showBackButton={props.navigation.canGoBack()}
              onBackPress={props.navigation.goBack}
              showLocation={false}
              showSearch={false}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ProductsPage"
        component={ProductsPage}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: `${(route.params as any)?.category || 'Category'} Restaurants`,
          header: (props) => (
            <UnifiedHeader
              title={`${(props.route.params as any)?.category || 'Category'} Restaurants`}
              showBackButton={props.navigation.canGoBack()}
              onBackPress={props.navigation.goBack}
              showLocation={false}
              showSearch={false}
            />
          ),
        })}
      />
      <Stack.Screen
        name="RestaurantDetails"
        component={RestaurantDetailsScreen}
        options={{
          headerTitle: 'Restaurant Details',
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          headerTitle: 'Product Details',
        }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: `Search: "${(route.params as any)?.searchQuery}"`,
          header: (props) => (
            <UnifiedHeader
              title={`Search: "${(route.params as any)?.searchQuery}"`}
              showBackButton={props.navigation.canGoBack()}
              onBackPress={props.navigation.goBack}
              showLocation={false}
              showSearch={true}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ChefProfile"
        component={ProductsPage}
        options={{
          headerShown: false, // Remove header completely
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

// Helper function to get appropriate header titles
const getHeaderTitle = (routeName: string): string => {
  switch (routeName) {
    case 'Products':
      return 'Browse Products';
    case 'ProductsPage':
      return 'Menu Items';
    case 'RestaurantDetails':
      return 'Restaurant Details';
    case 'ProductDetails':
      return 'Product Details';
    case 'SearchResults':
      return 'Search Results';
    case 'ChefProfile':
      return 'Chef Profile';
    default:
      return 'Products';
  }
};

export default ProductStackNavigator;
