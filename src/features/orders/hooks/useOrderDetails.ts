import { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { doc, getDoc, collection, query, orderBy, getDocs } from '@react-native-firebase/firestore';
import { QueryDocumentSnapshot } from '../../../types/firebase';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: {
    name: string;
    price: number;
  }[];
  category: string;
  cuisine: string;
  prepTime: string;
  status: string;
  type: string;
  links?: {
    restaurantId?: string;
    menuItemId?: string;
  };
  userRating?: number;
  isRated?: boolean;
}

export interface PaymentDetails {
  id: string;
  method: string;
  provider: string;
  status: string;
  amount: number;
  timestamp: any;
  transactionId?: string;
  gatewayTransactionId?: string;
}

export interface StatusHistory {
  id: string;
  status: string;
  timestamp: any;
  notes?: string;
}

export interface OrderDetails {
  id: string;
  orderId: string;
  date: string;
  status: string;
  amount: number;
  items: OrderItem[];
  payment: PaymentDetails[];
  statusHistory: StatusHistory[];
  deliveryAddress?: any;
  deliveryCharges: number;
  discount: number;
  taxes: number;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  instructions?: string;
}

export const useOrderDetails = (orderId: string | null) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch main order document
        const orderDocRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderDocRef);

        if (!orderDoc.exists()) {
          setError('Order not found');
          setLoading(false);
          return;
        }

        const orderData = orderDoc.data();
        if (!orderData) {
          setError('Order data is empty');
          setLoading(false);
          return;
        }

        console.log('Main order data:', orderData);

        // Fetch order items
        const orderItemsRef = collection(db, 'orders', orderId, 'order_items');
        const orderItemsQuery = query(orderItemsRef, orderBy('name'));
        const orderItemsSnapshot = await getDocs(orderItemsQuery);

        console.log('Order items snapshot size:', orderItemsSnapshot.size);

        const items: OrderItem[] = [];
        orderItemsSnapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
          const data = doc.data();
          console.log('Order item data:', data);
          items.push({
            id: doc.id,
            name: data.name,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            totalPrice: data.totalPrice,
            customizations: data.customizations || [],
            category: data.category,
            cuisine: data.cuisine,
            prepTime: data.prepTime,
            status: data.status,
            type: data.type,
            links: data.links,
            userRating: data.userRating,
            isRated: data.isRated,
          });
        });

        console.log('Processed items:', items);

        // Fetch payment details
        const paymentRef = collection(db, 'orders', orderId, 'payment');
        const paymentSnapshot = await getDocs(paymentRef);

        const payments: PaymentDetails[] = [];
        paymentSnapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
          const data = doc.data();
          payments.push({
            id: doc.id,
            method: data.method,
            provider: data.provider,
            status: data.status,
            amount: data.amount,
            timestamp: data.timestamp,
            transactionId: data.transactionId,
            gatewayTransactionId: data.gatewayTransactionId,
          });
        });

        // Fetch status history
        const statusHistoryRef = collection(db, 'orders', orderId, 'status_history');
        const statusHistoryQuery = query(statusHistoryRef, orderBy('timestamp'));
        const statusHistorySnapshot = await getDocs(statusHistoryQuery);

        const statusHistory: StatusHistory[] = [];
        statusHistorySnapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
          const data = doc.data();
          statusHistory.push({
            id: doc.id,
            status: data.status,
            timestamp: data.timestamp,
            notes: data.notes,
          });
        });

        // Handle Firestore timestamps properly
        let orderDate = 'Unknown';
        if (orderData.createdAt) {
          if (orderData.createdAt.toDate) {
            orderDate = orderData.createdAt.toDate().toLocaleDateString();
          } else {
            orderDate = new Date(orderData.createdAt).toLocaleDateString();
          }
        }

        const details: OrderDetails = {
          id: orderDoc.id,
          orderId: orderData.orderId || `#${orderDoc.id.substring(0, 8)}`,
          date: orderDate,
          status: orderData.status || 'Pending',
          amount: orderData.totalAmount || 0,
          items: items,
          payment: payments,
          statusHistory: statusHistory,
          deliveryAddress: orderData.deliveryAddress,
          deliveryCharges: orderData.deliveryCharges || 0,
          discount: orderData.discount || 0,
          taxes: orderData.taxes || 0,
          paymentMethod: orderData.paymentMethod || 'Unknown',
          paymentStatus: orderData.paymentStatus || 'Unknown',
          estimatedDeliveryTime: orderData.estimatedDeliveryTime || 'Unknown',
          actualDeliveryTime: orderData.actualDeliveryTime,
          instructions: orderData.instructions,
        };

        console.log('Final order details:', details);
        setOrderDetails(details);
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        if (err.code === 'firestore/permission-denied') {
          setError('You do not have permission to view this order. Please make sure you are logged in as the order owner.');
        } else {
          setError('Failed to load order details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return {
    orderDetails,
    loading,
    error,
  };
};