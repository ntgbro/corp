# Corpease Project Documentation

## Overview

Corpease is a comprehensive B2B commerce platform designed for businesses to order fresh produce, FMCG products, office supplies, and corporate catering services. The platform connects corporate clients with verified suppliers, offering a streamlined procurement process with features like real-time inventory, automated reordering, and comprehensive analytics.

## Technology Stack

### Frontend
- **React Native**: Cross-platform mobile application development
- **TypeScript**: Type-safe JavaScript development
- **Redux Toolkit**: State management with Redux Persist for data persistence
- **React Navigation**: Stack, Tab, and Drawer navigation
- **Firebase**: Authentication, Firestore, Cloud Storage, and Messaging

### Backend
- **Firebase**: Backend-as-a-Service (BaaS) for authentication, database, and cloud functions
- **Node.js**: Server-side runtime environment

### Development Tools
- **Yarn**: Package manager
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Project Structure

```
corpease/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── ChefContext.tsx
│   │   ├── OrderContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── features/
│   │   ├── addresses/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── chef/
│   │   ├── home/
│   │   ├── notifications/
│   │   ├── onboarding/
│   │   ├── orders/
│   │   ├── product/
│   │   ├── profile/
│   │   ├── restaurants/
│   │   ├── search/
│   │   ├── settings/
│   │   │   ├── addresses/
│   │   │   ├── generalInfo/
│   │   │   ├── helpSupport/
│   │   │   ├── notifications/
│   │   │   ├── orders/
│   │   │   ├── preferences/
│   │   │   ├── profile/
│   │   │   ├── socialMedia/
│   │   │   ├── wishlist/
│   │   │   ├── SettingsIndex.tsx
│   │   │   └── index.ts
│   │   └── wishlist/
│   │
│   ├── hooks/
│   │   ├── useLocation.ts
│   │   └── useTheme.ts
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── index.ts
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   └── LoadingScreen.tsx
│   │
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── cartSlice.ts
│   │   │   ├── chefSlice.ts
│   │   │   ├── notificationSlice.ts
│   │   │   ├── orderSlice.ts
│   │   │   └── productSlice.ts
│   │   └── index.ts
│   │
│   ├── styles/
│   │   └── themes.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   │
│   └── App.tsx
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
│
├── package.json
└── README.md
```

## Core Features

### Authentication System
- **Firebase Authentication**: Email/password, phone number, and social login
- **Token Management**: Secure storage and refresh of authentication tokens
- **User Roles**: Support for different user types (corporate clients, suppliers, chefs)

### Product Catalog
- **Multi-category Browsing**: Fresh produce, FMCG, office supplies, and catering
- **Search and Filter**: Advanced search with filters by category, price, and supplier
- **Product Details**: Comprehensive product information with images and specifications

### Shopping Cart
- **Cart Management**: Add, remove, and update quantities
- **Coupon System**: Apply discount codes
- **Multi-supplier Support**: Separate carts for different suppliers

### Order Management
- **Order Placement**: Seamless checkout process
- **Order Tracking**: Real-time status updates
- **Order History**: Comprehensive order history with details

### Corporate Features
- **Bulk Ordering**: Support for large volume orders
- **Budget Management**: Departmental budget tracking
- **Approval Workflows**: Multi-level approval processes for orders

### Chef Services
- **Chef Profiles**: Detailed chef information and specialties
- **Menu Browsing**: Browse chef-created menus
- **Custom Meal Requests**: Request custom meals from chefs

### Analytics and Reporting
- **Spending Analytics**: Track spending patterns
- **Inventory Reports**: Monitor inventory levels
- **Supplier Performance**: Evaluate supplier performance metrics

## Settings Module

### Modular Architecture
The settings module follows a modular architecture pattern with each section organized into its own directory:

```
settings/
│
├── profile/
│   ├── components/
│   │   └── EditProfileForm.tsx
│   ├── screens/
│   │   └── ProfileScreen.tsx
│   └── hooks/
│       └── useProfile.ts
│
├── orders/
│   ├── components/
│   │   └── OrderList.tsx
│   ├── screens/
│   │   └── OrdersScreen.tsx
│   └── hooks/
│       └── useOrders.ts
│
├── wishlist/
│   ├── components/
│   │   └── WishlistItem.tsx
│   ├── screens/
│   │   └── WishlistScreen.tsx
│   └── hooks/
│       └── useWishlist.ts
│
├── addresses/
│   ├── components/
│   │   └── AddressForm.tsx
│   ├── screens/
│   │   └── AddressesScreen.tsx
│   └── hooks/
│       └── useAddresses.ts
│
├── preferences/
│   ├── components/
│   │   └── PreferencesForm.tsx
│   ├── screens/
│   │   └── PreferencesScreen.tsx
│   └── hooks/
│       └── usePreferences.ts
│
├── notifications/
│   ├── components/
│   │   └── NotificationItem.tsx
│   ├── screens/
│   │   └── NotificationsScreen.tsx
│   └── hooks/
│       └── useNotifications.ts
│
├── generalInfo/
│   ├── components/
│   │   └── TermsAndConditions.tsx
│   ├── screens/
│   │   └── GeneralInfoScreen.tsx
│   └── hooks/
│       └── useGeneralInfo.ts
│
├── helpSupport/
│   ├── components/
│   │   └── FAQList.tsx
│   ├── screens/
│   │   └── HelpSupportScreen.tsx
│   └── hooks/
│       └── useFAQs.ts
│
├── socialMedia/
│   ├── components/
│   │   └── SocialMediaRow.tsx
│   ├── screens/
│   │   └── SocialMediaScreen.tsx
│   └── hooks/
│       └── useSocialMedia.ts
│
├── SettingsIndex.tsx
└── index.ts
```

### Settings Functionality
1. **Profile Management**: Edit personal information
2. **Order History**: View past orders
3. **Wishlist**: Manage saved items
4. **Address Book**: Manage delivery addresses
5. **Preferences**: Customize app settings
6. **Notifications**: Control notification preferences
7. **General Information**: App version and terms
8. **Help & Support**: FAQ and contact options
9. **Social Media**: Connect to social platforms

## State Management

### Redux Store
The application uses Redux Toolkit for state management with the following slices:

- **authSlice**: User authentication state
- **cartSlice**: Shopping cart state
- **chefSlice**: Chef-related data
- **notificationSlice**: Notification settings
- **orderSlice**: Order history and status
- **productSlice**: Product catalog data

### Context API
Additional state management is handled through React Context:

- **AuthContext**: Authentication state and methods
- **CartContext**: Cart operations and calculations
- **ChefContext**: Chef-related state
- **OrderContext**: Order processing state
- **ThemeContext**: Application theme management

## Navigation Structure

### Main Navigation
- **Authentication Stack**: Login, signup, and onboarding flows
- **Main Tab Navigator**: Home, search, cart, orders, and profile
- **Drawer Navigator**: Additional options and settings

### Feature Navigation
Each feature module has its own navigation structure:
- **Settings Navigator**: All settings-related screens
- **Order Navigator**: Order placement and tracking
- **Product Navigator**: Product browsing and details

## Firebase Integration

### Authentication
- **Email/Password**: Traditional authentication
- **Phone Auth**: SMS-based verification
- **Social Login**: Google, Facebook, and Apple integration

### Firestore
- **User Data**: Profile information and preferences
- **Product Catalog**: Product details and inventory
- **Orders**: Order history and status tracking
- **Chefs**: Chef profiles and menus

### Cloud Storage
- **Images**: Product images, profile pictures, and chef photos
- **Documents**: Business documents and contracts

### Cloud Messaging
- **Push Notifications**: Order updates and promotional messages
- **In-app Messaging**: Real-time communication

## Recent Changes and Improvements

### Settings Module Refactoring
The settings module has been completely refactored to follow a modular architecture pattern:
- Organized related functionality into separate directories
- Implemented consistent component, screen, and hook structure
- Added proper TypeScript typing throughout
- Integrated theme support for consistent styling

### Performance Improvements
- **Code Splitting**: Implemented lazy loading for better performance
- **Bundle Optimization**: Reduced app size through dependency optimization
- **Caching**: Implemented efficient data caching strategies

### UI/UX Enhancements
- **Responsive Design**: Improved layout for different screen sizes
- **Accessibility**: Enhanced accessibility features
- **Loading States**: Added proper loading and error states

## Future Development Roadmap

### Short-term Goals
1. **Enhanced Analytics**: More detailed reporting and visualization
2. **Advanced Search**: AI-powered search with recommendations
3. **Supplier Portal**: Dedicated interface for suppliers

### Long-term Vision
1. **AI Integration**: Machine learning for demand forecasting
2. **IoT Integration**: Smart inventory management
3. **Blockchain**: Supply chain transparency

## Development Guidelines

### Coding Standards
- **TypeScript**: All components and functions must be properly typed
- **ESLint**: Code must pass linting checks
- **Prettier**: Code must be properly formatted

### Component Structure
- **Functional Components**: Use React hooks instead of class components
- **Props Interface**: Define clear prop interfaces for all components
- **Default Exports**: Export components as default exports

### State Management
- **Redux**: Use Redux for global state management
- **Context**: Use Context API for localized state
- **Immutability**: Maintain immutable state updates

### Testing
- **Unit Tests**: Write unit tests for all utility functions
- **Component Tests**: Test all components with Jest and React Testing Library
- **Integration Tests**: Test critical user flows

## Deployment

### Build Process
- **Development**: `yarn start` for local development
- **Production**: `yarn build` for production builds
- **Testing**: `yarn test` for running tests

### Environment Configuration
- **Environment Variables**: Use .env files for configuration
- **Feature Flags**: Implement feature flags for gradual rollouts
- **Analytics**: Integrate analytics for user behavior tracking

## Troubleshooting

### Common Issues
1. **Firebase Connection**: Check API keys and network connectivity
2. **Authentication Errors**: Verify token validity and refresh logic
3. **Performance Issues**: Profile components and optimize rendering

### Debugging Tools
- **React DevTools**: Component hierarchy inspection
- **Redux DevTools**: State management debugging
- **Network Inspector**: API call monitoring

## Support and Maintenance

### Documentation
- **Code Comments**: Maintain clear and concise code comments
- **API Documentation**: Document all API endpoints
- **User Guides**: Provide comprehensive user documentation

### Updates and Patches
- **Dependency Updates**: Regularly update dependencies for security
- **Bug Fixes**: Promptly address reported issues
- **Feature Enhancements**: Continuously improve user experience

This documentation provides a comprehensive overview of the Corpease project, covering its architecture, features, and development guidelines. It serves as a reference for current and future development efforts.