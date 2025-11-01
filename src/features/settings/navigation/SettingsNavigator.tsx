import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProfileManagementScreen } from '../screens/ProfileManagementScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { PreferencesScreen } from '../screens/PreferencesScreen';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  ProfileManagement: undefined;
  NotificationSettings: undefined;
  AddressManagement: undefined;
  OrderHistory: undefined;
  Wishlist: undefined;
  Preferences: undefined;
  HelpSupport: undefined;
  Feedback: undefined;
  AppInfo: undefined;
  SocialMedia: undefined;
  CuisinePreferences: undefined;
  FoodTypePreferences: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

export const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsHome"
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="SettingsHome" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="ProfileManagement" 
        component={ProfileManagementScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="Preferences" 
        component={PreferencesScreen}
        options={{ title: 'Preferences' }}
      />
    </Stack.Navigator>
  );
};
