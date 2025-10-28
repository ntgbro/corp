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
  SearchResults: { searchQuery?: string; category?: string; restaurantId?: string };
  ChefProfile: { chefId: string };
  RestaurantDetails: { restaurantId: string };
  ProductDetails: { menuItemId: string };
  ServiceScreen: {
    service: 'fresh' | 'fmcg' | 'supplies';
    title: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Product: undefined;
  Products: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
  ProductDetails: { menuItemId: string };
  OrderDetails: { orderId: string };
  SearchResults: { searchQuery?: string; category?: string; restaurantId?: string };
};
