import { db } from '../../../config/firebase';
import { collection, doc, getDocs, getDoc, query, where, collectionGroup } from '@react-native-firebase/firestore';
import { Restaurant, MenuItem, Product, Order, Service } from '../../../types/firestore';

export class HomeService {
  static async getRestaurants(limitCount: number = 10): Promise<Restaurant[]> {
    const restaurantsRef = collection(db, 'restaurants');
    const snapshot = await getDocs(restaurantsRef);
    // @ts-ignore
    return snapshot.docs.map((doc: any) => doc.data() as Restaurant).slice(0, limitCount);
  }

  static async getMenuItems(restaurantId: string, limitCount: number = 10): Promise<MenuItem[]> {
    const menuItemsRef = collection(db, 'restaurants', restaurantId, 'menu_items');
    const snapshot = await getDocs(menuItemsRef);
    // @ts-ignore
    return snapshot.docs.map((doc: any) => doc.data() as MenuItem).slice(0, limitCount);
  }

  static async getProducts(limitCount: number = 10): Promise<Product[]> {
    const productsRef = collectionGroup(db, 'products');
    const snapshot = await getDocs(productsRef);
    // @ts-ignore
    return snapshot.docs.map((doc: any) => doc.data() as Product).slice(0, limitCount);
  }

  static async getOrdersByUser(userId: string, limitCount: number = 10): Promise<Order[]> {
    const ordersRef = collection(db, 'orders');
    const allSnapshot = await getDocs(ordersRef);
    // @ts-ignore
    const userOrders = allSnapshot.docs.map((doc: any) => doc.data() as Order)
      .filter((order: Order) => order.userId === userId);
    return userOrders.slice(0, limitCount);
  }

  static async getAllMenuItems(): Promise<MenuItem[]> {
    const menuItemsRef = collectionGroup(db, 'menu_items');
    const snapshot = await getDocs(menuItemsRef);
    // @ts-ignore
    return snapshot.docs.map((doc: any) => doc.data() as MenuItem);
  }

  static async getRestaurantById(restaurantId: string): Promise<Restaurant | null> {
    try {
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      const restaurantSnap = await getDoc(restaurantRef);

      if (restaurantSnap.exists()) {
        const data = restaurantSnap.data() as Restaurant;
        console.log('Fetched restaurant data:', data);
        return data;
      } else {
        console.log('Restaurant not found with ID:', restaurantId);
        return null;
      }
    } catch (error) {
      console.error('Error fetching restaurant by ID:', error);
      throw error;
    }
  }

  // Add method to fetch warehouse by ID
  static async getWarehouseById(warehouseId: string): Promise<any | null> {
    try {
      const warehouseRef = doc(db, 'warehouses', warehouseId);
      const warehouseSnap = await getDoc(warehouseRef);

      if (warehouseSnap.exists()) {
        const data = warehouseSnap.data();
        console.log('Fetched warehouse data:', data);
        return data;
      } else {
        console.log('Warehouse not found with ID:', warehouseId);
        return null;
      }
    } catch (error) {
      console.error('Error fetching warehouse by ID:', error);
      throw error;
    }
  }

  // Add method to fetch product by ID from warehouses
  static async getProductById(productId: string): Promise<any | null> {
    try {
      const warehousesSnapshot = await getDocs(collection(db, 'warehouses'));
      
      for (const warehouseDoc of warehousesSnapshot.docs) {
        const productRef = doc(db, 'warehouses', warehouseDoc.id, 'products', productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const data = productSnap.data();
          const warehouseData = warehouseDoc.data();
          console.log('Fetched product data:', data);
          return {
            ...data,
            warehouseId: warehouseDoc.id,
            warehouseName: warehouseData?.name || 'Warehouse'
          };
        }
      }
      
      console.log('Product not found with ID:', productId);
      return null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  static async getServices(): Promise<Service[]> {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    // @ts-ignore
    return snapshot.docs.map((doc: any) => doc.data() as Service);
  }

  static async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const menuItemsRef = collectionGroup(db, 'menu_items');
      const snapshot = await getDocs(menuItemsRef);
      console.log(`Fetched ${snapshot.docs.length} menu items for category: ${category}`);
      // @ts-ignore
      const allItems = snapshot.docs.map((doc: any) => {
        const item = doc.data() as MenuItem;
        const pathSegments = doc.ref.path.split('/');
        const restaurantId = pathSegments[pathSegments.indexOf('restaurants') + 1];
        console.log(`Menu item path: ${doc.ref.path}, extracted restaurantId: ${restaurantId}`);
        return { ...item, restaurantId };
      });
      // Filter by category client-side
      const filteredItems = allItems.filter((item: MenuItem) => item.category === category);
      return filteredItems;
    } catch (error) {
      console.error('Error in getMenuItemsByCategory:', error);
      throw error;
    }
  }

  static async getMenuItemById(menuItemId: string): Promise<MenuItem | null> {
    try {
      const menuItemsRef = collectionGroup(db, 'menu_items');
      const snapshot = await getDocs(menuItemsRef);
      console.log(`Fetched ${snapshot.docs.length} menu items for menuItemId: ${menuItemId}`);
      // @ts-ignore
      const allItems = snapshot.docs.map((doc: any) => {
        const item = doc.data() as MenuItem;
        const pathSegments = doc.ref.path.split('/');
        const restaurantId = pathSegments[pathSegments.indexOf('restaurants') + 1];
        console.log(`Menu item path: ${doc.ref.path}, extracted restaurantId: ${restaurantId}`);
        return { ...item, restaurantId };
      });
      // Filter by menuItemId client-side
      const filteredItem = allItems.find((item: MenuItem) => item.menuItemId === menuItemId);
      return filteredItem || null;
    } catch (error) {
      console.error('Error in getMenuItemById:', error);
      throw error;
    }
  }

  static async getRestaurantsByIds(restaurantIds: string[]): Promise<Restaurant[]> {
    const promises = restaurantIds.map(id => this.getRestaurantById(id));
    const restaurants = await Promise.all(promises);
    return restaurants.filter(restaurant => restaurant !== null) as Restaurant[];
  }
};