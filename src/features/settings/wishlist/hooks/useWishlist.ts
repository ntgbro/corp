import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from '@react-native-firebase/firestore';
import { QueryDocumentSnapshot } from '../../../../types/firebase';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  itemId: string;
  restaurantId: string;
  serviceId: string;
  warehouseId: string;
  type: string;
  addedAt: any;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const wishlistRef = collection(db, 'users', user.userId, 'wishlist');
          const q = query(wishlistRef);
          const querySnapshot = await getDocs(q);
          
          const wishlistData: WishlistItem[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
            const data = doc.data();
            wishlistData.push({
              id: doc.id,
              name: data.name || `Item ${data.itemId || doc.id}`,
              price: data.price || 0,
              image: data.image || 'https://via.placeholder.com/150',
              itemId: data.itemId || '',
              restaurantId: data.restaurantId || '',
              serviceId: data.serviceId || '',
              warehouseId: data.warehouseId || '',
              type: data.type || '',
              addedAt: data.addedAt || new Date(),
            });
          });
          
          setWishlist(wishlistData);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlist([]);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user?.userId]);

  const removeFromWishlist = async (id: string) => {
    try {
      if (user?.userId) {
        const wishlistDocRef = doc(db, 'users', user.userId, 'wishlist', id);
        await deleteDoc(wishlistDocRef);
        
        setWishlist(prev => prev.filter(item => item.id !== id));
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    }
  };

  const addToCart = async (id: string) => {
    // Add to cart logic
    console.log('Adding to cart:', id);
    // This would integrate with the cart context/system
  };

  return {
    wishlist,
    loading,
    removeFromWishlist,
    addToCart,
  };
};