// src/services/firebase/restaurantService.ts
import { collection, doc, getDoc, getDocs, setDoc, runTransaction, updateDoc } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { Restaurant, MenuItem } from '../../types/firestore';

export class RestaurantService {
  static async getRestaurant(restaurantId: string): Promise<Restaurant | null> {
    const docSnap = await getDoc(doc(collection(db, 'restaurants'), restaurantId));
    return docSnap.exists() ? (docSnap.data() as Restaurant) : null;
  }

  static async getRestaurants(): Promise<Restaurant[]> {
    const snapshot = await getDocs(collection(db, 'restaurants'));
    return snapshot.docs.map((doc: any) => doc.data() as Restaurant);
  }

  static async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const snapshot = await getDocs(collection(db, 'restaurants', restaurantId, 'menu_items'));
    return snapshot.docs.map((doc: any) => doc.data() as MenuItem);
  }

  static async addMenuItem(restaurantId: string, item: Omit<MenuItem, 'menuItemId'>): Promise<void> {
    const docRef = doc(collection(db, 'restaurants', restaurantId, 'menu_items'));
    await setDoc(docRef, { ...item, menuItemId: docRef.id });
  }

  /**
   * Updates the rating of a specific menu item.
   * This uses a transaction to ensure the average is calculated correctly even if multiple users rate at once.
   */
  static async rateMenuItem(restaurantId: string, menuItemId: string, userRating: number): Promise<void> {
    const itemRef = doc(db, 'restaurants', restaurantId, 'menu_items', menuItemId);

    try {
      await runTransaction(db, async (transaction) => {
        const itemDoc = await transaction.get(itemRef);

        if (!itemDoc.exists) {
          throw new Error('Menu item does not exist!');
        }

        const data = itemDoc.data();
        
        // Get current values, defaulting to 0 if they don't exist yet
        const currentAverage = data?.rating || 0;
        const currentCount = data?.ratingCount || 0;

        // Calculate new average
        const newCount = currentCount + 1;
        const newAverage = ((currentAverage * currentCount) + userRating) / newCount;

        // Update the document
        transaction.update(itemRef, {
          rating: newAverage,
          ratingCount: newCount, // We add this field to track total votes
        });
      });
      console.log(`Rating updated successfully for restaurant ${restaurantId}, menu item ${menuItemId}`);
    } catch (error: any) {
      console.error('Error updating rating:', error);
      // Provide more specific error message for permission issues
      if (error?.code === 'permission-denied') {
        throw new Error('You do not have permission to rate this item. Please make sure you are logged in and have ordered this item.');
      }
      throw error;
    }
  }

  /**
   * Saves the user's rating to the specific order item document.
   * This prevents users from rating the same item multiple times.
   */
  static async saveUserRatingToOrder(orderId: string, itemId: string, rating: number): Promise<void> {
    try {
      // This assumes your order items are stored in a subcollection: orders/{orderId}/order_items/{itemId}
      const orderItemRef = doc(db, 'orders', orderId, 'order_items', itemId);
      
      await updateDoc(orderItemRef, {
        userRating: rating, // Persist the rating here
        isRated: true       // Flag to lock the UI
      });
      console.log('Order item marked as rated');
    } catch (error) {
      console.error('Failed to save rating to order:', error);
      throw error;
    }
  }
}
