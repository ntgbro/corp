// Export all settings components, hooks, and screens

// Profile exports
export { EditProfileForm } from './profile/components/EditProfileForm';
export { useProfile } from './profile/hooks/useProfile';
export { ProfileScreen } from './profile/screens/ProfileScreen';

// Orders exports
export { OrderList } from './orders/components/OrderList';
export { useOrders } from './orders/hooks/useOrders';
export { OrdersScreen } from './orders/screens/OrdersScreen';

// Wishlist exports
export { WishlistItem } from './wishlist/components/WishlistItem';
export { useWishlist } from './wishlist/hooks/useWishlist';
export { WishlistScreen } from './wishlist/screens/WishlistScreen';

// Addresses exports
export { AddressForm } from './addresses/components/AddressForm';
export { useAddresses } from './addresses/hooks/useAddresses';
export { AddressesScreen } from './addresses/screens/AddressesScreen';

// Preferences exports
export { PreferencesForm } from './preferences/components/PreferencesForm';
export { usePreferences } from './preferences/hooks/usePreferences';
export { PreferencesScreen } from './preferences/screens/PreferencesScreen';

// Notifications exports
export { NotificationItem } from './notifications/components/NotificationItem';
export { useNotifications } from './notifications/hooks/useNotifications';
export { NotificationsScreen } from './notifications/screens/NotificationsScreen';

// General Info exports
export { TermsAndConditions } from './generalInfo/components/TermsAndConditions';
export { useGeneralInfo } from './generalInfo/hooks/useGeneralInfo';
export { GeneralInfoScreen } from './generalInfo/screens/GeneralInfoScreen';

// Help & Support exports
export { FAQList } from './helpSupport/components/FAQList';
export { useFAQs } from './helpSupport/hooks/useFAQs';
export { HelpSupportScreen } from './helpSupport/screens/HelpSupportScreen';

// Social Media exports
export { SocialMediaRow } from './socialMedia/components/SocialMediaRow';
export { useSocialMedia } from './socialMedia/hooks/useSocialMedia';
export { SocialMediaScreen } from './socialMedia/screens/SocialMediaScreen';

// Main entry point
export { SettingsIndex } from './SettingsIndex';