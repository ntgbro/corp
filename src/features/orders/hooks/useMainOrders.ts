import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../config/firebase';
import { collection, query, orderBy, where, getDocs } from '@react-native-firebase/firestore';
import { QueryDocumentSnapshot } from '../../../types/firebase';

export interface Order {
  id: string;
  orderId: string;
  date: string;
  status: string;
  amount: number;
  items: any[];
  restaurantName?: string;
  deliveryAddress?: string;
}

export const useMainOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (user?.userId) {
      try {
        setLoading(true);
        setError(null);
        
        // Query the main orders collection where customerId equals the current user's ID
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef, 
          where('customerId', '==', user.userId),
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
          
          // Extract restaurant name if available
          let restaurantName = '';
          if (data.restaurantId) {
            // In a real implementation, you might want to fetch the restaurant name from the restaurant collection
            restaurantName = data.restaurantId; // Placeholder
          }
          
          // Extract delivery address if available
          let deliveryAddress = '';
          if (data.deliveryAddress) {
            deliveryAddress = `${data.deliveryAddress.addressLine1 || ''}, ${data.deliveryAddress.city || ''}`;
          }
          
          ordersData.push({
            id: doc.id,
            orderId: data.orderId || `#${doc.id.substring(0, 8)}`,
            date: orderDate,
            status: data.status || 'Pending',
            amount: data.totalAmount || 0,
            items: data.items || [],
            restaurantName: restaurantName,
            deliveryAddress: deliveryAddress,
          });
        });
        
        setOrders(ordersData);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refreshOrders,
  };
};