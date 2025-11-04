import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { MainTabParamList } from './types';
import HomeScreen from '../features/home/screens/HomeScreen';
import { ProductStackNavigator } from './ProductStackNavigator';
import { CartStackNavigator } from './CartStackNavigator';
import { useCart } from '../contexts/CartContext';
import { SettingsNavigator } from '../features/settings/navigation/SettingsNavigator';

// Placeholder Screen Components (to avoid inline functions)
const OrdersScreen: React.FC = () => {
  const { theme } = useThemeContext();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 48, color: theme.colors.textSecondary }}>📦</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.text, marginTop: 16 }}>📦 Orders</Text>
      <Text style={{ fontSize: 14, marginTop: 8, color: theme.colors.textSecondary }}>Order management coming soon!</Text>
    </View>
  );
};

const OrderDetailsScreen: React.FC = () => {
  const { theme } = useThemeContext();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 48, color: theme.colors.textSecondary }}>📋</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.text, marginTop: 16 }}>Order Details</Text>
    </View>
  );
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { theme } = useThemeContext();
  const { state: cartState } = useCart();

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 0,
      height: 60,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
        const isFocused = state.index === index;

        // Don't render the OrderDetails tab
        if (route.name === 'OrderDetails') return null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let icon;
        let displayLabel;

        switch (route.name) {
          case 'Home':
            icon = '🏠';
            displayLabel = isFocused ? 'Home' : '';
            break;
          case 'Product':
            icon = '🛍️';
            displayLabel = isFocused ? 'Products' : '';
            break;
          case 'CartStack':
            icon = '🛒';
            displayLabel = isFocused ? 'Cart' : 'Cart';
            break;
          case 'Orders':
            icon = '📦';
            displayLabel = isFocused ? 'Orders' : 'Orders';
            break;
          case 'Profile':
            icon = '👤';
            displayLabel = isFocused ? 'Profile' : '';
            break;
          default:
            icon = '🛒';
            displayLabel = route.name;
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 0,
              marginHorizontal: 0,
            }}
          >
            <View style={{ position: 'relative' }}>
              <Text style={{
                fontSize: 24,
                color: isFocused ? theme.colors.primary : theme.colors.textSecondary
              }}>
                {icon}
              </Text>
              {route.name === 'CartStack' && cartState.totalItems > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: theme.colors.error,
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 6,
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 'bold'
                  }}>
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </Text>
                </View>
              )}
            </View>
            {displayLabel ? (
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                marginTop: 2,
                color: isFocused ? theme.colors.primary : theme.colors.textSecondary
              }}>
                {displayLabel}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => focused ? 'Home' : '',
        }}
      />
      <Tab.Screen
        name="Product"
        component={ProductStackNavigator}
        options={{
          tabBarLabel: ({ focused }) => focused ? 'Products' : '',
        }}
      />
      <Tab.Screen
        name="CartStack"
        component={CartStackNavigator}
        options={{
          tabBarLabel: 'Cart',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, color }}>🛒</Text>
              {useCart().state.totalItems > 0 && (
                <View style={{
                  position: 'absolute',
                  right: -8,
                  top: -4,
                  backgroundColor: 'red',
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {useCart().state.totalItems}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: ({ focused }) => focused ? 'Orders' : 'Orders',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsNavigator}
        options={{
          tabBarLabel: ({ focused }) => focused ? 'Profile' : '',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;