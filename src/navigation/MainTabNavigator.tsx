import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { MainTabParamList } from './types';
import HomeScreen from '../features/home/screens/HomeScreen';
import { ProductStackNavigator } from './ProductStackNavigator';
import { CartStackNavigator } from './CartStackNavigator';
import { OrdersScreen } from '../features/settings/orders/screens/OrdersScreen';
import { useCart } from '../contexts/CartContext';
import { SettingsNavigator } from '../features/settings';
import { HomeIcon, CategoryIcon, CartIcon, OrderIcon, ProfileIcon } from '../components/common'; // Import the new SVG icons

// Placeholder Screen Components (to avoid inline functions)
const OrderDetailsScreen: React.FC = () => {
  const { theme } = useThemeContext();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <OrderIcon size={48} color={theme.colors.textSecondary} />
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
      backgroundColor: '#F5DEB3', // Match header color
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

        let displayLabel;

        switch (route.name) {
          case 'Home':
            displayLabel = isFocused ? 'Home' : '';
            break;
          case 'Product':
            displayLabel = isFocused ? 'Products' : '';
            break;
          case 'Cart':
          case 'CartStack':
            displayLabel = isFocused ? 'Cart' : '';
            break;
          case 'Orders':
            displayLabel = isFocused ? 'Orders' : '';
            break;
          case 'Profile':
            displayLabel = isFocused ? 'Profile' : '';
            break;
          default:
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
              {route.name === 'Home' && (
                <HomeIcon 
                  size={26} 
                  color={isFocused ? '#754C29' : 'black'} 
                />
              )}
              {route.name === 'Product' && (
                <CategoryIcon 
                  size={32} 
                  color={isFocused ? '#754C29' : 'black'} 
                />
              )}
              {(route.name === 'Cart' || route.name === 'CartStack') && (
                <CartIcon 
                  size={30} 
                  color={isFocused ? '#754C29' : 'black'} 
                />
              )}
              {route.name === 'Orders' && (
                <OrderIcon 
                  size={34} 
                  color={isFocused ? '#754C29' : 'black'} 
                />
              )}
              {route.name === 'Profile' && (
                <ProfileIcon 
                  size={28} 
                  color={isFocused ? '#754C29' : 'black'} 
                />
              )}
              {(route.name === 'Cart' || route.name === 'CartStack') && cartState.totalItems > 0 && (
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
                color: isFocused ? '#754C29' : theme.colors.textSecondary
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
          tabBarLabel: ({ focused }) => focused ? 'Cart' : '',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <CartIcon size={24} color={color} />
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
          tabBarLabel: ({ focused }) => focused ? 'Orders' : '',
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