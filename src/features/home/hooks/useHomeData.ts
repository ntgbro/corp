import { useState, useEffect } from 'react';
import { HomeService } from '../services/homeService';
import { Restaurant, MenuItem, Product, Order, Service } from '../../../types/firestore';
import { useAuth } from '../../../contexts/AuthContext';

export const useRestaurants = (limit: number = 10) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await HomeService.getRestaurants(limit);
        setRestaurants(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [limit]);

  return { restaurants, loading, error };
};

export const useMenuItems = (restaurantId: string, limit: number = 10) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await HomeService.getMenuItems(restaurantId, limit);
        setMenuItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [restaurantId, limit]);

  return { menuItems, loading, error };
};

export const useProducts = (limit: number = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await HomeService.getProducts(limit);
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useOrders = (limit: number = 10) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const data = await HomeService.getOrdersByUser(user.userId, limit);
          setOrders(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, limit]);

  return { orders, loading, error };
};

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await HomeService.getServices();
        setServices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return { services, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching restaurants for categories...');
        const restaurants = await HomeService.getRestaurants(50);
        console.log('Fetched restaurants:', restaurants.length);
        
        const allCategories: string[] = [];
        for (const restaurant of restaurants) {
          const menuItems = await HomeService.getMenuItems(restaurant.restaurantId, 50);
          const restaurantCategories = menuItems.map((item: any) => item.category).filter(Boolean);
          allCategories.push(...restaurantCategories);
        }
        
        const uniqueCategories = Array.from(new Set(allCategories));
        console.log('Unique categories:', uniqueCategories);
        setCategories(uniqueCategories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useRestaurantDetails = (restaurantId: string) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<any[]>([]); // Assuming Review type, but using any for now
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching restaurant with ID:', restaurantId);
        const restaurantData = await HomeService.getRestaurantById(restaurantId);
        console.log('Restaurant data fetched:', restaurantData);
        setRestaurant(restaurantData);

        if (restaurantData) {
          const menuData = await HomeService.getMenuItems(restaurantId, 50);
          console.log('Menu items fetched:', menuData.length);
          setMenuItems(menuData);

          // const reviewsData = await HomeService.getReviews(restaurantId, 10);
          // console.log('Reviews fetched:', reviewsData.length);
          // setReviews(reviewsData);
          setReviews([]); // Temporary: no reviews
        }
      } catch (err: any) {
        console.error('Error fetching restaurant details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetails();
  }, [restaurantId]);

  return { restaurant, menuItems, reviews, loading, error };
};

export const useMenuItemsByCategory = (category: string) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItemsByCategory = async () => {
      try {
        setLoading(true);
        const data = await HomeService.getMenuItemsByCategory(category);
        setMenuItems(data);
      } catch (err: any) {
        console.error('Error fetching menu items for category:', category, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (category) fetchMenuItemsByCategory();
  }, [category]);

  return { menuItems, loading, error };
};
