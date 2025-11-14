import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsIndex } from '../SettingsIndex';
import { ProfileScreen } from '../profile/screens/ProfileScreen';
import { WishlistScreen } from '../wishlist/screens/WishlistScreen';
import { AddressesScreen } from '../addresses/screens/AddressesScreen';
import { PreferencesScreen } from '../preferences/screens/PreferencesScreen';
import { NotificationsScreen } from '../notifications/screens/NotificationsScreen';
import { GeneralInfoScreen } from '../generalInfo/screens/GeneralInfoScreen';
import { HelpSupportScreen } from '../helpSupport/screens/HelpSupportScreen';
import { SocialMediaScreen } from '../socialMedia/screens/SocialMediaScreen'; // Added back the import

export type SettingsStackParamList = {
  SettingsHome: undefined;
  SettingsProfile: undefined;
  Wishlist: undefined;
  Addresses: undefined;
  Preferences: undefined;
  Notifications: undefined;
  GeneralInfo: undefined;
  HelpSupport: undefined;
  SocialMedia: undefined; // Added back SocialMedia to the type definition
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
        headerStyle: {
          backgroundColor: '#F5DEB3',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
        },
        headerTintColor: '#000000',
      }}
    >
      <Stack.Screen 
        name="SettingsHome" 
        component={SettingsIndex}
        options={{ 
          title: 'Settings',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="SettingsProfile"
        component={ProfileScreen}
        options={{ 
          title: 'Profile',
        }}
      />
      <Stack.Screen 
        name="Wishlist" 
        component={WishlistScreen}
        options={{ 
          title: 'Wishlist',
          headerStyle: {
            backgroundColor: '#F5DEB3',
          },
          headerTitleStyle: {
            color: '#000000',
            fontWeight: '600',
          },
          headerTintColor: '#000000',
        }}
      />
      <Stack.Screen 
        name="Addresses" 
        component={AddressesScreen}
        options={{ 
          title: 'Addresses',
        }}
      />
      <Stack.Screen 
        name="Preferences" 
        component={PreferencesScreen}
        options={{ 
          title: 'Preferences',
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
        }}
      />
      <Stack.Screen 
        name="GeneralInfo" 
        component={GeneralInfoScreen}
        options={{ 
          title: 'General Information',
        }}
      />
      <Stack.Screen 
        name="HelpSupport" 
        component={HelpSupportScreen}
        options={{ 
          title: 'Help & Support',
        }}
      />
      <Stack.Screen 
        name="SocialMedia" 
        component={SocialMediaScreen}
        options={{ 
          title: 'Follow Us',
        }}
      />
    </Stack.Navigator>
  );
};