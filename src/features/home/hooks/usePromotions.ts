import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from '@react-native-firebase/firestore';
import { db } from '../../../config/firebase';

export interface Promotion {
  promotionId: string;
  title: string;
  description: string;
  bannerImage: string;
  bannerImageURL: string;
  type: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  validFrom: Date;
  validTill: Date;
  isActive: boolean;
  priority: number;
  targetType: 'all' | 'specific';
  targetAudience: {
    cities?: string[];
    restaurants?: string[];
    zones?: string[];
    userType?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export const usePromotions = (limitCount: number = 5) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Query active promotions ordered by creation date (requires composite index)
    const promotionsQuery = query(
      collection(db, 'promotions'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount * 3) // Fetch more to account for date filtering
    );

    const unsubscribe = onSnapshot(
      promotionsQuery,
      (snapshot) => {
        const now = new Date();
        const promotionsData: Promotion[] = [];
        const allPromotionsData: Promotion[] = []; // To see all promotions before filtering
        
        snapshot.forEach((doc: any) => {
          const data = doc.data();
          const validFrom = data.validFrom.toDate();
          const validTill = data.validTill.toDate();
          
          const promotion = {
            promotionId: data.promotionId || doc.id,
            title: data.title,
            description: data.description,
            bannerImage: data.bannerImage,
            bannerImageURL: data.bannerImageURL,
            type: data.type,
            discountValue: data.discountValue,
            maxDiscountAmount: data.maxDiscountAmount,
            minOrderAmount: data.minOrderAmount,
            validFrom: validFrom,
            validTill: validTill,
            isActive: data.isActive,
            priority: data.priority,
            targetType: data.targetType || 'all',
            targetAudience: data.targetAudience || {},
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            createdBy: data.createdBy,
          };
          
          // Store all promotions for debugging
          allPromotionsData.push(promotion);
          
          // Filter for currently valid promotions in memory
          if (validFrom <= now && validTill >= now) {
            promotionsData.push(promotion);
          }
        });
        
        console.log('All promotions from DB:', allPromotionsData.length, allPromotionsData);
        console.log('Valid promotions:', promotionsData.length, promotionsData);
        
        // Sort by priority and then by creation date
        promotionsData.sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        
        // Limit to the requested count
        const limitedPromotions = promotionsData.slice(0, limitCount);
        
        setPromotions(limitedPromotions);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching promotions:', err);
        setError('Failed to load promotions. Please create the required Firestore index.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { promotions, loading, error };
};