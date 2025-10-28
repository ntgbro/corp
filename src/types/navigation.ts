import { NavigatorScreenParams } from '@react-navigation/native';

// Navigation parameter types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { productId: string };
  ChefDetail: { chefId: string };
  Cart: undefined;
  Checkout: { orderId?: string };
  Orders: undefined;
  OrderDetail: { orderId: string };
  Profile: undefined;
  Settings: undefined;
  AddressBook: undefined;
  AddAddress: undefined;
  EditAddress: { addressId: string };
  Notifications: undefined;
  ProductReviews: { productId: string };
  ChefReviews: { chefId: string };
  Search: { query?: string };
};

export type AuthStackParamList = {
  PhoneAuth: undefined;
  OTPVerification: {
    phoneNumber: string;
    confirmation: any;
  };
  ProfileSetup: {
    phoneNumber: string;
    userId: string;
  };
};

export type HomeTabParamList = {
  Home: undefined;
  Search: undefined;
  Categories: undefined;
  Featured: undefined;
};

export type ProductTabParamList = {
  AllProducts: undefined;
  ByCategory: { categoryId: string };
  ByChef: { chefId: string };
  Favorites: undefined;
};

export type CartTabParamList = {
  Cart: undefined;
  Checkout: undefined;
  Payment: undefined;
  OrderConfirmation: { orderId: string };
};

export type OrdersTabParamList = {
  AllOrders: undefined;
  ActiveOrders: undefined;
  PastOrders: undefined;
  OrderDetail: { orderId: string };
};

export type ProfileTabParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Preferences: undefined;
  Addresses: NavigatorScreenParams<AddressStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
  Help: undefined;
  About: undefined;
};

export type AddressStackParamList = {
  AddressList: undefined;
  AddAddress: undefined;
  EditAddress: { addressId: string };
  SelectLocation: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Privacy: undefined;
  Terms: undefined;
  Help: undefined;
  About: undefined;
  Notifications: undefined;
};

// Combined types for easier imports
export type MainTabParamList = HomeTabParamList &
  ProductTabParamList &
  CartTabParamList &
  OrdersTabParamList &
  ProfileTabParamList;

// Screen props types
export type PhoneAuthScreenProps = {
  navigation: any;
  route: any;
};

export type HomeScreenProps = {
  navigation: any;
  route: any;
};

export type ProductDetailScreenProps = {
  navigation: any;
  route: { params: { productId: string } };
};

export type CartScreenProps = {
  navigation: any;
  route: any;
};

export type CheckoutScreenProps = {
  navigation: any;
  route: { params?: { orderId: string } };
};

// Deep linking configuration
export type DeepLinkParams = {
  screen: keyof RootStackParamList;
  params?: any;
};
