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
  Products: undefined;
  RestaurantItems: { restaurantId?: string; category?: string };
  ProductsPage: { category: string }; // Shows restaurants for a category
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