import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { collection, query, orderBy, getDocs } from '@react-native-firebase/firestore';
import { QueryDocumentSnapshot } from '../../../../types/firebase';

export interface Order {
  id: string;
  orderId: string;
  date: string;
  status: string;
  amount: number;
  items: any[];
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const ordersRef = collection(db, 'users', user.userId, 'orders');
          const q = query(ordersRef, orderBy('orderDate', 'desc'));
          const querySnapshot = await getDocs(q);
          
          const ordersData: Order[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
            const data = doc.data();
            ordersData.push({
              id: doc.id,
              orderId: data.orderId || `#${doc.id.substring(0, 8)}`,
              date: data.orderDate ? new Date(data.orderDate).toLocaleDateString() : 'Unknown',
              status: data.status || 'Pending',
              amount: data.totalAmount || 0,
              items: data.items || [],
            });
          });
          
          setOrders(ordersData);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setOrders([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.userId]);

  const refreshOrders = () => {
    // In a real implementation, this would fetch fresh data from Firebase
    // For now, we'll just simulate a refresh
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    orders,
    loading,
    refreshOrders,
  };
};