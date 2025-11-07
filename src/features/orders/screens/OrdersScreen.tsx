import React from 'react';
import MainOrdersScreen from './MainOrdersScreen.tsx';

// Re-exporting the MainOrdersScreen component as OrdersScreen
const OrdersScreen: React.FC = () => {
  return <MainOrdersScreen />;
};

export default OrdersScreen;