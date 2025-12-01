import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../config/firebase';
import { collection, query, orderBy, where, getDocs, doc, getDoc } from '@react-native-firebase/firestore';
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
  otp?: string;
  deliveryPartnerName?: string; // Add delivery partner name
  deliveryPartnerPhone?: string; // Add delivery partner phone
}

export const useMainOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ OPTIMIZED FUNCTION
  const fetchDeliveryPartnerDetails = async (deliveryPartnerId: string) => {
    try {
      const deliveryPartnerDoc = await getDoc(doc(db, 'delivery_partners', deliveryPartnerId));
      if (deliveryPartnerDoc.exists()) {
        const data = deliveryPartnerDoc.data();
        return {
          name: data?.name || 'Delivery Partner',
          phone: data?.phone || '',
        };
      }
    } catch (error: any) {
      // ✅ Just return default values silently instead of spamming console with "Expected" errors
      return { name: 'Delivery Partner', phone: '' };
    }
    return { name: 'Delivery Partner', phone: '' };
  };

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
        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
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

          // Extract OTP if available and status is out_for_delivery
          let otp: string | undefined;
          if (data.otp && data.status && data.status.toLowerCase() === 'out_for_delivery') {
            otp = data.otp;
          }

          // ✅ UPDATED PARTNER LOGIC
          // 1. Check if the order ALREADY has the name/phone (Fastest & Best)
          let deliveryPartnerName = data.deliveryPartnerName;
          let deliveryPartnerPhone = data.deliveryPartnerPhone;
          
          // 2. Only fetch if missing AND we have an ID AND status is relevant
          if (!deliveryPartnerName && data.deliveryPartnerId) {
             const status = data.status ? data.status.toLowerCase() : '';
             // Fetch for both 'out_for_delivery' AND 'assigned'
             if (status === 'out_for_delivery' || status === 'assigned') {
                const partnerDetails = await fetchDeliveryPartnerDetails(data.deliveryPartnerId);
                deliveryPartnerName = partnerDetails.name;
                deliveryPartnerPhone = partnerDetails.phone;
             }
          }

          ordersData.push({
            id: docSnapshot.id,
            orderId: data.orderId || `#${docSnapshot.id.substring(0, 8)}`,
            date: orderDate,
            status: data.status || 'Pending',
            amount: data.totalAmount || 0,
            items: data.items || [],
            restaurantName: restaurantName,
            deliveryAddress: deliveryAddress,
            otp: otp,
            deliveryPartnerName: deliveryPartnerName,
            deliveryPartnerPhone: deliveryPartnerPhone,
          });
        }

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