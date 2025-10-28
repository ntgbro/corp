import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Product interface for store
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  chefId: string;
  rating: number;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

interface ProductFilters {
  categoryId?: string;
  chefId?: string;
  serviceType?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ProductsState {
  products: Product[];
  categories: Category[];
  services: Service[];
  featuredProducts: Product[];
  popularProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  searchQuery: string;
  selectedCategory: string | null;
  selectedService: string | null;
  sortBy: 'name' | 'price' | 'rating' | 'distance' | 'created_at';
  sortOrder: 'asc' | 'desc';
  lastUpdated: Date | null;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const initialProductsState: ProductsState = {
  products: [],
  categories: [],
  services: [],
  featuredProducts: [],
  popularProducts: [],
  loading: false,
  error: null,
  filters: {},
  searchQuery: '',
  selectedCategory: null,
  selectedService: null,
  sortBy: 'created_at',
  sortOrder: 'desc',
  lastUpdated: null,
  hasMore: false,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState: initialProductsState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    addProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = [...state.products, ...action.payload];
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(product => product.id === action.payload.id);

      if (index !== -1) {
        state.products[index] = action.payload;
      }

      // Update in featured/popular arrays if exists
      const featuredIndex = state.featuredProducts.findIndex((p: Product) => p.id === action.payload.id);
      if (featuredIndex !== -1) {
        state.featuredProducts[featuredIndex] = action.payload;
      }

      const popularIndex = state.popularProducts.findIndex((p: Product) => p.id === action.payload.id);
      if (popularIndex !== -1) {
        state.popularProducts[popularIndex] = action.payload;
      }

      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((product: Product) => product.id !== action.payload);

      // Remove from featured/popular arrays
      state.featuredProducts = state.featuredProducts.filter((p: Product) => p.id !== action.payload);
      state.popularProducts = state.popularProducts.filter((p: Product) => p.id !== action.payload);

      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date();
    },

    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },

    setServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload;
      state.loading = false;
      state.error = null;
    },

    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
      state.loading = false;
      state.error = null;
    },

    setPopularProducts: (state, action: PayloadAction<Product[]>) => {
      state.popularProducts = action.payload;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },

    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },

    setSelectedService: (state, action: PayloadAction<string | null>) => {
      state.selectedService = action.payload;
      state.currentPage = 1;
    },

    setSortBy: (state, action: PayloadAction<'name' | 'price' | 'rating' | 'distance' | 'created_at'>) => {
      state.sortBy = action.payload;
    },

    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },

    setPagination: (state, action: PayloadAction<{
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasMore: boolean;
    }>) => {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
      state.hasMore = action.payload.hasMore;
    },

    incrementPage: (state) => {
      if (state.currentPage < state.totalPages) {
        state.currentPage += 1;
      }
    },

    resetPagination: (state) => {
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalCount = 0;
      state.hasMore = false;
    },

    toggleProductFavorite: (state, action: PayloadAction<string>) => {
      const product = state.products.find(p => p.id === action.payload);
      if (product) {
        // This would typically be handled by a backend call
        // For now, we just update the local state
        console.log('Toggling favorite for product:', action.payload);
      }
    },

    clearProducts: (state) => {
      state.products = [];
      state.featuredProducts = [];
      state.popularProducts = [];
      state.loading = false;
      state.error = null;
      state.filters = {};
      state.searchQuery = '';
      state.selectedCategory = null;
      state.selectedService = null;
      state.lastUpdated = null;
      state.hasMore = false;
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
});

export const {
  setProducts,
  addProducts,
  updateProduct,
  removeProduct,
  setCategories,
  setServices,
  setFeaturedProducts,
  setPopularProducts,
  setLoading,
  setError,
  setFilters,
  setSearchQuery,
  setSelectedCategory,
  setSelectedService,
  setSortBy,
  setSortOrder,
  setPagination,
  incrementPage,
  resetPagination,
  toggleProductFavorite,
  clearProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
