import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Order } from '../../../types/firestore';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: theme.colors.surface, borderRadius: 8, padding: 10 }}>
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: 'bold' }}>Order #{order.orderId}</Text>
      <Text style={{ color: theme.colors.textSecondary }}>Total: ${order.totalAmount}</Text>
      <Text style={{ color: theme.colors.primary }}>Status: {order.status}</Text>
    </TouchableOpacity>
  );
};

export default OrderCard;
