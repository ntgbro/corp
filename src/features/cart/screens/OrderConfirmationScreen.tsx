import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaWrapper } from '../../../components/layout';
import { Button } from '../../../components/common';
import { useTheme } from '@react-navigation/native';
import { CartStackParamList } from '../../../navigation/CartStackNavigator'; // Import the correct type

type OrderConfirmationRouteProp = RouteProp<CartStackParamList, 'OrderConfirmation'>;
type OrderConfirmationNavigationProp = StackNavigationProp<CartStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen: React.FC = () => {
  const route = useRoute<OrderConfirmationRouteProp>();
  const navigation = useNavigation<OrderConfirmationNavigationProp>();
  const { orderId } = route.params;
  const { colors } = useTheme();

  const handleContinueShopping = () => {
    // Navigate back to home or product listing
    navigation.navigate('Cart' as any); // Navigate back to cart screen
  };

  const handleViewOrder = () => {
    // For now, we can go back to the cart
    navigation.navigate('Cart' as any);
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Order Confirmed!
          </Text>
          
          <Text style={[styles.message, { color: colors.text }]}>
            Your order has been successfully placed.
          </Text>
          
          <View style={styles.orderInfo}>
            <Text style={[styles.orderIdLabel, { color: colors.text }]}>
              Order ID:
            </Text>
            <Text style={[styles.orderId, { color: colors.primary }]}>
              {orderId}
            </Text>
          </View>
          
          <Text style={[styles.details, { color: colors.text }]}>
            You will receive a confirmation email shortly with order details and delivery information.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Continue Shopping" 
              onPress={handleContinueShopping}
              style={styles.button}
            />
            <Button 
              title="View Order Details" 
              onPress={handleViewOrder}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderIdLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginVertical: 10,
  },
});

export default OrderConfirmationScreen;