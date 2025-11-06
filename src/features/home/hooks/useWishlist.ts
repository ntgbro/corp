import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from '@react-native-firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: Date;
  [key: string]: any; // Allow additional properties
}

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to wishlist changes in Firebase
  useEffect(() => {
    if (!user?.userId) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const wishlistQuery = query(
      collection(db, 'users', user.userId, 'wishlist'),
      where('userId', '==', user.userId)
    );

    const unsubscribe = onSnapshot(
      wishlistQuery,
      (snapshot) => {
        const wishlistItems: WishlistItem[] = [];
        snapshot.forEach((doc: any) => {
          wishlistItems.push({
            id: doc.id,
            ...doc.data(),
          } as WishlistItem);
        });
        setWishlist(wishlistItems);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to wishlist:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.userId]);

  const addToWishlist = async (productId: string, productData: any = {}) => {
    if (!user?.userId) {
      throw new Error('User not authenticated');
    }

    try {
      const wishlistItemRef = doc(collection(db, 'users', user.userId, 'wishlist'));
      const wishlistItem = {
        productId,
        userId: user.userId,
        addedAt: new Date(),
        ...productData,
      };

      await setDoc(wishlistItemRef, wishlistItem);
      return wishlistItemRef.id;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user?.userId) {
      throw new Error('User not authenticated');
    }

    try {
      // Find the wishlist item by productId
      const itemToRemove = wishlist.find(item => item.productId === productId);
      if (itemToRemove) {
        await deleteDoc(doc(db, 'users', user.userId, 'wishlist', itemToRemove.id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};