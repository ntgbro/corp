// src/services/firebase/restaurantService.ts
import { collection, doc, getDoc, getDocs, setDoc } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase';
import { Restaurant, MenuItem } from '../../types/firestore';

export class RestaurantService {
  static async getRestaurant(restaurantId: string): Promise<Restaurant | null> {
    const docSnap = await getDoc(doc(collection(db, 'restaurants'), restaurantId));
    return docSnap.exists() ? (docSnap.data() as Restaurant) : null;
  }

  static async getRestaurants(): Promise<Restaurant[]> {
    const snapshot = await getDocs(collection(db, 'restaurants'));
    return snapshot.docs.map(doc => doc.data() as Restaurant);
  }

  static async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const snapshot = await getDocs(collection(db, 'restaurants', restaurantId, 'menu_items'));
    return snapshot.docs.map(doc => doc.data() as MenuItem);
  }

  static async addMenuItem(restaurantId: string, item: Omit<MenuItem, 'menuItemId'>): Promise<void> {
    const docRef = doc(collection(db, 'restaurants', restaurantId, 'menu_items'));
    await setDoc(docRef, { ...item, menuItemId: docRef.id });
  }
}
