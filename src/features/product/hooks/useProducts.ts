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
        const allProducts = await getAllProductsForService(serviceId, 200); // Increase limit for better search results

        // Enhanced text search with multiple criteria
        const filtered = allProducts.filter(product => {
          const searchTerm = searchQuery.toLowerCase();
          
          // Check multiple fields with different weights
          const nameMatch = product.name.toLowerCase().includes(searchTerm);
          const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
          const restaurantMatch = product.restaurantName?.toLowerCase().includes(searchTerm);
          
          // Calculate relevance score
          let score = 0;
          if (nameMatch) score += 3; // Highest weight for name match
          if (categoryMatch) score += 2; // Medium weight for category match
          if (restaurantMatch) score += 1; // Lower weight for restaurant match
          
          // Also check for partial matches (split search term)
          const searchTerms = searchTerm.split(' ');
          searchTerms.forEach(term => {
            if (term.length > 1) { // Only consider terms with more than 1 character
              if (product.name.toLowerCase().includes(term)) score += 1;
              if (product.category?.toLowerCase().includes(term)) score += 0.5;
              if (product.restaurantName?.toLowerCase().includes(term)) score += 0.3;
            }
          });
          
          return score > 0;
        });

        // Sort by relevance score and then by rating
        const sorted = filtered.sort((a, b) => {
          // Calculate relevance scores
          const aScore = calculateRelevanceScore(a, searchQuery);
          const bScore = calculateRelevanceScore(b, searchQuery);
          
          // Sort by relevance score first, then by rating
          if (bScore !== aScore) {
            return bScore - aScore; // Higher score first
          }
          
          // If scores are equal, sort by rating
          return (b.rating || 0) - (a.rating || 0);
        });

        setProducts(sorted.slice(0, 30)); // Return top 30 results
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

// Helper function to calculate relevance score
const calculateRelevanceScore = (product: ProductData, searchQuery: string): number => {
  const searchTerm = searchQuery.toLowerCase();
  let score = 0;
  
  // Exact match in name (highest weight)
  if (product.name.toLowerCase() === searchTerm) {
    score += 10;
  }
  // Starts with match in name
  else if (product.name.toLowerCase().startsWith(searchTerm)) {
    score += 7;
  }
  // Contains match in name
  else if (product.name.toLowerCase().includes(searchTerm)) {
    score += 5;
  }
  
  // Category matches
  if (product.category?.toLowerCase() === searchTerm) {
    score += 4;
  } else if (product.category?.toLowerCase().includes(searchTerm)) {
    score += 2;
  }
  
  // Restaurant name matches
  if (product.restaurantName?.toLowerCase() === searchTerm) {
    score += 3;
  } else if (product.restaurantName?.toLowerCase().includes(searchTerm)) {
    score += 1;
  }
  
  return score;
};
