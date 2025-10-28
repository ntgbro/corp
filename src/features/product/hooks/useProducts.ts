// src/features/product/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { getProductsByServiceAndCategory, getAllProductsForService, getCategoriesByService } from '../../../services/firebase/firestore/productService';

// Use the ProductData from productService
import { ProductData, ProductCategory } from '../../../services/firebase/firestore/productService';

export const useProductsByService = (serviceId: 'fresh' | 'fmcg' | 'supplies', limit: number = 20) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProductsForService(serviceId, limit);
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [serviceId, limit]);

  return { products, loading, error };
};

export const useProductsByCategory = (serviceId: 'fresh' | 'fmcg' | 'supplies', categoryId: string, limit: number = 20) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByServiceAndCategory(serviceId, categoryId, limit);
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [serviceId, categoryId, limit]);

  return { products, loading, error };
};

export const useCategories = (serviceId: 'fresh' | 'fmcg' | 'supplies') => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategoriesByService(serviceId);
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [serviceId]);

  return { categories, loading, error };
};

export const useProductSearch = (searchQuery: string, serviceId: 'fresh' | 'fmcg' | 'supplies') => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProductsForService(serviceId, 100);

        // Simple text search
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setProducts(filtered.slice(0, 20));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, serviceId]);

  return { products, loading, error };
};
