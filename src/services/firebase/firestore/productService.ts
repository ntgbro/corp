// src/services/firebase/firestore/productService.ts

import { collection, doc, getDocs, query, where } from '@react-native-firebase/firestore';
import { db } from '../config';
import { MenuItem } from '../../../types/firestore';

// Define types based on HomeScreen usage
export interface ProductData {
  id: string;
  name: string;
  price: number;
  imageURL?: string;
  rating?: number;
  isAvailable: boolean;
  category?: string;
  restaurantId?: string;
  restaurantName?: string;
  warehouseId?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  isActive: boolean;
  description: string;
}

// Helper to get restaurants or warehouses based on service
async function getEntitiesForService(serviceId: 'fresh' | 'fmcg' | 'supplies') {
  if (serviceId === 'fresh') {
    // For Fresh Serve, get ALL restaurants (not limited)
    const snapshot = await getDocs(collection(db, 'restaurants'));
    return snapshot.docs.map((doc: any) => ({ id: doc.id, type: 'restaurant', data: doc.data() }));
  } else {
    // For FMCG and Supplies, get warehouses
    const snapshot = await getDocs(collection(db, 'warehouses'));
    return snapshot.docs.map((doc: any) => ({ id: doc.id, type: 'warehouse', data: doc.data() }));
  }
}

// Get categories for a service (dynamically from database)
export async function getCategoriesByService(serviceId: 'fresh' | 'fmcg' | 'supplies'): Promise<ProductCategory[]> {
  try {
    const entities = await getEntitiesForService(serviceId);
    const categoryMap: { [key: string]: { name: string; count: number } } = {};

    for (const entity of entities) {
      if (entity.type === 'restaurant' && serviceId === 'fresh') {
        // Fetch menu items and extract unique categories
        const snapshot = await getDocs(collection(db, 'restaurants', entity.id, 'menu_items'));
        snapshot.docs.forEach((doc: any) => {
          const data = doc.data() as MenuItem;
          if (data.category) {
            if (categoryMap[data.category]) {
              categoryMap[data.category].count += 1;
            } else {
              categoryMap[data.category] = { name: data.category, count: 1 };
            }
          }
        });
      } else if (entity.type === 'warehouse' && (serviceId === 'fmcg' || serviceId === 'supplies')) {
        // For warehouses, assuming products have categories
        const snapshot = await getDocs(collection(db, 'warehouses', entity.id, 'products'));
        snapshot.docs.forEach((doc: any) => {
          const data = doc.data();
          if (data.category) {
            if (categoryMap[data.category]) {
              categoryMap[data.category].count += 1;
            } else {
              categoryMap[data.category] = { name: data.category, count: 1 };
            }
          }
        });
      }
    }

    // Convert to ProductCategory array with icons (use defaults or map based on name)
    return Object.entries(categoryMap).map(([id, cat]) => ({
      id,
      name: cat.name,
      icon: getIconForCategory(cat.name), // Helper function for icons
      productCount: cat.count,
      isActive: true,
      description: `Products in ${cat.name}`,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to static categories if dynamic fetch fails
    return getStaticCategories(serviceId);
  }
}

// Helper to get static categories as fallback
function getStaticCategories(serviceId: 'fresh' | 'fmcg' | 'supplies'): ProductCategory[] {
  if (serviceId === 'fresh') {
    return [
      { id: 'salads', name: 'Salads', icon: '🥗', productCount: 25, isActive: true, description: 'Fresh salads' },
      { id: 'curries', name: 'Curries', icon: '🍛', productCount: 30, isActive: true, description: 'Indian curries' },
      { id: 'pizza', name: 'Pizza', icon: '🍕', productCount: 20, isActive: true, description: 'Fresh pizza' },
      { id: 'burgers', name: 'Burgers', icon: '🍔', productCount: 15, isActive: true, description: 'Juicy burgers' },
      { id: 'desserts', name: 'Desserts', icon: '🍰', productCount: 18, isActive: true, description: 'Sweet treats' },
      { id: 'beverages', name: 'Beverages', icon: '🥤', productCount: 22, isActive: true, description: 'Refreshing drinks' },
    ];
  } else if (serviceId === 'fmcg') {
    return [
      { id: 'snacks', name: 'Snacks', icon: '🍟', productCount: 20, isActive: true, description: 'Crispy snacks' },
      { id: 'beverages', name: 'Beverages', icon: '🥤', productCount: 35, isActive: true, description: 'Drinks' },
    ];
  } else {
    return [
      { id: 'stationery', name: 'Stationery', icon: '📝', productCount: 30, isActive: true, description: 'Office supplies' },
      { id: 'electronics', name: 'Electronics', icon: '💻', productCount: 15, isActive: true, description: 'Tech items' },
    ];
  }
}

// Helper to assign icons based on category name
function getIconForCategory(categoryName: string): string {
  const iconMap: { [key: string]: string } = {
    'salads': '🥗',
    'curries': '🍛',
    'snacks': '🍟',
    'beverages': '🥤',
    'stationery': '📝',
    'electronics': '💻',
  };
  return iconMap[categoryName.toLowerCase()] || '📦'; // Default icon
}

// Get products for a service and category
export async function getProductsByServiceAndCategory(
  serviceId: 'fresh' | 'fmcg' | 'supplies',
  categoryId: string,
  limitCount: number = 10
): Promise<ProductData[]> {
  const entities = await getEntitiesForService(serviceId);

  const allProducts: ProductData[] = [];

  for (const entity of entities) {
    if (entity.type === 'restaurant' && serviceId === 'fresh') {
      // Fetch ALL menu items from restaurants for this category
      const fullSnapshot = await getDocs(query(
        collection(db, 'restaurants', entity.id, 'menu_items'),
        where('category', '==', categoryId)
      ));

      const menuItems = fullSnapshot.docs.map((doc: any) => {
        const data = doc.data() as MenuItem;
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          imageURL: data.mainImageURL,
          rating: data.rating,
          isAvailable: data.isAvailable,
          category: data.category,
          restaurantId: entity.id,
          restaurantName: entity.data.name, // Include restaurant name
        } as ProductData;
      });
      allProducts.push(...menuItems);
    } else if (entity.type === 'warehouse' && (serviceId === 'fmcg' || serviceId === 'supplies')) {
      // For warehouses, assuming products collection exists
      // Note: Based on schema, this might need adjustment if products are structured differently
      const fullSnapshot = await getDocs(query(
        collection(db, 'warehouses', entity.id, 'products'),
        where('category', '==', categoryId)
      ));

      const products = fullSnapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          imageURL: data.imageURL,
          isAvailable: data.isAvailable,
          category: data.category,
          warehouseId: entity.id,
        } as ProductData;
      });
      allProducts.push(...products);
    }
  }

  // Sort by rating (highest first) and then return limited results
  return allProducts
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limitCount);
}

// Additional utility functions if needed
export async function getAllProductsForService(serviceId: 'fresh' | 'fmcg' | 'supplies', limitCount: number = 50): Promise<ProductData[]> {
  const entities = await getEntitiesForService(serviceId);
  const allProducts: ProductData[] = [];

  for (const entity of entities) {
    if (entity.type === 'restaurant' && serviceId === 'fresh') {
      const fullSnapshot = await getDocs(collection(db, 'restaurants', entity.id, 'menu_items'));
      const snapshot = { docs: fullSnapshot.docs.slice(0, limitCount) };
      const items = snapshot.docs.map((doc: any) => {
        const data = doc.data() as MenuItem;
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          imageURL: data.mainImageURL,
          rating: data.rating,
          isAvailable: data.isAvailable,
          category: data.category,
          restaurantId: entity.id,
          restaurantName: entity.data.name, // Include restaurant name
        } as ProductData;
      });
      allProducts.push(...items);
    } else if (entity.type === 'warehouse') {
      const fullSnapshot = await getDocs(collection(db, 'warehouses', entity.id, 'products'));
      const products = fullSnapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          imageURL: data.imageURL,
          isAvailable: data.isAvailable,
          category: data.category,
          warehouseId: entity.id,
        } as ProductData;
      });
      allProducts.push(...products);
    }
  }

  return allProducts.slice(0, limitCount);
}
