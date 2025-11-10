import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../features/home/screens/HomeScreen';
import RestaurantDetailsScreen from '../features/home/screens/RestaurantDetailsScreen';
import { MainStackParamList } from './types';
import UnifiedHeader from '../components/layout/UnifiedHeader';

// Custom back navigation handler
const handleBackNavigation = (navigation: any) => {
  console.log('[NAVIGATION] Back navigation triggered in HomeStackNavigator');
  
  // First, try to go back within the current stack
  if (navigation.canGoBack()) {
    console.log('[NAVIGATION] Going back within current stack');
    navigation.goBack();
    return;
  }
  
  console.log('[NAVIGATION] Cannot go back within current stack, switching to Home tab');
  
  // If we can't go back within the stack, we need to switch tabs
  try {
    // Get the tab navigator (parent of this stack)
    const tabNavigator = navigation.getParent();
    
    if (tabNavigator) {
      console.log('[NAVIGATION] Navigating to Home tab via parent navigator');
      // Navigate to the Home tab
      tabNavigator.navigate('Home');
    } else {
      // Ultimate fallback
      console.log('[NAVIGATION] Could not get parent navigator, staying on current screen');
    }
  } catch (error) {
    console.error('[NAVIGATION] Error in back navigation:', error);
  }
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
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;