export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  HomeTabs: undefined;
  HomeMain: undefined;  // Changed from Home to HomeMain
  Categories: undefined;
  Product: undefined;
  Products: undefined;
  RestaurantItems: { restaurantId?: string; category?: string; service?: 'fresh' | 'fmcg' | 'supplies' };
  ProductsPage: { category: string; service?: 'fresh' | 'fmcg' | 'supplies' }; // Shows restaurants/warehouses for a category
  SearchResults: { searchQuery: string }; // Make searchQuery required for SearchResults
  ChefProfile: { chefId: string };
  RestaurantDetails: { restaurantId: string };
  ProductDetails: { menuItemId: string };
  ServiceScreen: {
    service: 'fresh' | 'fmcg' | 'supplies';
    title: string;
  };
};

export type CartStackParamList = {
  Cart: undefined;
  Coupons: undefined;
  OrderConfirmation: { orderId: string }; // Add this route
};

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Product: undefined; // Add Product to the type definition
  CartStack: undefined;
  Orders: undefined;
  Profile: undefined;
  OrderDetails: { orderId: string };
};

// Add the Products screen parameters
export type ProductStackParamList = {
  Products: {
    category: string;
    service?: 'fresh' | 'fmcg' | 'supplies';
    restaurantId?: string;
    warehouseId?: string;
  };
  ProductDetails: { menuItemId: string };
  ProductsPage: { category: string; service?: 'fresh' | 'fmcg' | 'supplies' };
};