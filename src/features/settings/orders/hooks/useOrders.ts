import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { collection, query, orderBy, where, getDocs } from '@react-native-firebase/firestore';
import { QueryDocumentSnapshot } from '../../../../types/firebase';

export interface Order {
  id: string;
  orderId: string;
  date: string;
  status: string;
  amount: number;
  items: any[];
}

export const useOrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderHistory = useCallback(async () => {
    if (user?.userId) {
      try {
        setLoading(true);
        setError(null);
        
        // Query the order_history subcollection under the user
        const orderHistoryRef = collection(db, 'users', user.userId, 'order_history');
        const q = query(
          orderHistoryRef, 
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
          const data = doc.data();
          // Handle Firestore timestamps properly
          let orderDate = 'Unknown';
          if (data.createdAt) {
            if (data.createdAt.toDate) {
              orderDate = data.createdAt.toDate().toLocaleDateString();
            } else {
              orderDate = new Date(data.createdAt).toLocaleDateString();
            }
          }
          
          // Extract orders from the order_history document
          const historyOrders = data.orders || [];
          historyOrders.forEach((order: any) => {
            ordersData.push({
              id: order.id || doc.id,
              orderId: order.orderId || `#${(order.id || doc.id).substring(0, 8)}`,
              date: orderDate,
              status: order.status || 'Pending',
              amount: order.amount || 0,
              items: order.items || [],
            });
          });
        });
        
        setOrders(ordersData);
      } catch (error: any) {
        console.error('Error fetching order history:', error);
        setError('Failed to load order history. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const refreshOrderHistory = useCallback(async () => {
    await fetchOrderHistory();
  }, [fetchOrderHistory]);

  return {
    orders,
    loading,
    error,
    refreshOrderHistory,
  };
};