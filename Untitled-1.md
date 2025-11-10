# File Tree: corpease

**Generated:** 11/10/2025, 11:48:16 AM
**Root Path:** `d:\corpease`

```
├── 📁 .bundle
│   └── 📄 config
├── 📁 __tests__
│   └── 📄 App.test.tsx
├── 📁 android
│   ├── 📁 app
│   │   ├── 📁 src
│   │   │   └── 📁 main
│   │   │       ├── 📁 java
│   │   │       │   └── 📁 com
│   │   │       │       └── 📁 corpease
│   │   │       │           ├── ☕ MainActivity.kt
│   │   │       │           └── ☕ MainApplication.kt
│   │   │       ├── 📁 res
│   │   │       │   ├── 📁 drawable
│   │   │       │   │   └── ⚙️ rn_edit_text_material.xml
│   │   │       │   ├── 📁 mipmap-hdpi
│   │   │       │   │   ├── 🖼️ ic_launcher.png
│   │   │       │   │   └── 🖼️ ic_launcher_round.png
│   │   │       │   ├── 📁 mipmap-mdpi
│   │   │       │   │   ├── 🖼️ ic_launcher.png
│   │   │       │   │   └── 🖼️ ic_launcher_round.png
│   │   │       │   ├── 📁 mipmap-xhdpi
│   │   │       │   │   ├── 🖼️ ic_launcher.png
│   │   │       │   │   └── 🖼️ ic_launcher_round.png
│   │   │       │   ├── 📁 mipmap-xxhdpi
│   │   │       │   │   ├── 🖼️ ic_launcher.png
│   │   │       │   │   └── 🖼️ ic_launcher_round.png
│   │   │       │   ├── 📁 mipmap-xxxhdpi
│   │   │       │   │   ├── 🖼️ ic_launcher.png
│   │   │       │   │   └── 🖼️ ic_launcher_round.png
│   │   │       │   └── 📁 values
│   │   │       │       ├── ⚙️ strings.xml
│   │   │       │       └── ⚙️ styles.xml
│   │   │       └── ⚙️ AndroidManifest.xml
│   │   └── 📄 proguard-rules.pro
│   ├── 📁 gradle
│   │   └── 📁 wrapper
│   │       ├── 📄 gradle-wrapper.jar
│   │       └── 📄 gradle-wrapper.properties
│   ├── 📄 build.gradle
│   ├── 📄 gradle.properties
│   ├── 📄 gradlew
│   ├── 📄 gradlew.bat
│   └── 📄 settings.gradle
├── 📁 ios
│   ├── 📁 corpease
│   │   ├── 📁 Images.xcassets
│   │   │   ├── 📁 AppIcon.appiconset
│   │   │   │   └── ⚙️ Contents.json
│   │   │   └── ⚙️ Contents.json
│   │   ├── 🍎 AppDelegate.swift
│   │   ├── 📄 Info.plist
│   │   ├── 📄 LaunchScreen.storyboard
│   │   └── 📄 PrivacyInfo.xcprivacy
│   ├── 📁 corpease.xcodeproj
│   │   ├── 📁 xcshareddata
│   │   │   └── 📁 xcschemes
│   │   │       └── 📄 corpease.xcscheme
│   │   └── 📄 project.pbxproj
│   ├── ⚙️ .xcode.env
│   └── 📄 Podfile
├── 📁 src
│   ├── 📁 assets
│   │   ├── 📁 animations
│   │   │   ├── 📝 ANIMATION_SETUP_GUIDE.md
│   │   │   ├── 📝 README.md
│   │   │   ├── ⚙️ empty_cart.json
│   │   │   ├── ⚙️ error.json
│   │   │   ├── ⚙️ loading.json
│   │   │   ├── ⚙️ order_complete.json
│   │   │   └── ⚙️ success_check.json
│   │   ├── 📁 fonts
│   │   │   ├── 📁 static
│   │   │   │   ├── 📄 Inter_18pt-Black.ttf
│   │   │   │   ├── 📄 Inter_18pt-BlackItalic.ttf
│   │   │   │   ├── 📄 Inter_18pt-Bold.ttf
│   │   │   │   ├── 📄 Inter_18pt-BoldItalic.ttf
│   │   │   │   ├── 📄 Inter_18pt-ExtraBold.ttf
│   │   │   │   ├── 📄 Inter_18pt-ExtraBoldItalic.ttf
│   │   │   │   ├── 📄 Inter_18pt-ExtraLight.ttf
│   │   │   │   ├── 📄 Inter_18pt-ExtraLightItalic.ttf
│   │   │   │   ├── 📄 Inter_18pt-Italic.ttf
│   │   │   │   ├── 📄 Inter_18pt-Light.ttf
│   │   │   │   ├── 📄 Inter_18pt-LightItalic.ttf
│   │   │   │   ├── 📄 Inter_18pt-Medium.ttf
│   │   │   │   ├── 📄 Inter_18pt-MediumItalic.ttf
│   │   │   │   ├── 📄 Inter_18pt-Regular.ttf
│   │   │   │   ├── 📄 Inter_18pt-SemiBold.ttf
│   │   │   │   ├── 📄 Inter_18pt-SemiBoldItalic.ttf
│   │   │   │   ├── 📄 Inter_18pt-Thin.ttf
│   │   │   │   ├── 📄 Inter_18pt-ThinItalic.ttf
│   │   │   │   ├── 📄 Inter_24pt-Black.ttf
│   │   │   │   ├── 📄 Inter_24pt-BlackItalic.ttf
│   │   │   │   ├── 📄 Inter_24pt-Bold.ttf
│   │   │   │   ├── 📄 Inter_24pt-BoldItalic.ttf
│   │   │   │   ├── 📄 Inter_24pt-ExtraBold.ttf
│   │   │   │   ├── 📄 Inter_24pt-ExtraBoldItalic.ttf
│   │   │   │   ├── 📄 Inter_24pt-ExtraLight.ttf
│   │   │   │   ├── 📄 Inter_24pt-ExtraLightItalic.ttf
│   │   │   │   ├── 📄 Inter_24pt-Italic.ttf
│   │   │   │   ├── 📄 Inter_24pt-Light.ttf
│   │   │   │   ├── 📄 Inter_24pt-LightItalic.ttf
│   │   │   │   ├── 📄 Inter_24pt-Medium.ttf
│   │   │   │   ├── 📄 Inter_24pt-MediumItalic.ttf
│   │   │   │   ├── 📄 Inter_24pt-Regular.ttf
│   │   │   │   ├── 📄 Inter_24pt-SemiBold.ttf
│   │   │   │   ├── 📄 Inter_24pt-SemiBoldItalic.ttf
│   │   │   │   ├── 📄 Inter_24pt-Thin.ttf
│   │   │   │   ├── 📄 Inter_24pt-ThinItalic.ttf
│   │   │   │   ├── 📄 Inter_28pt-Black.ttf
│   │   │   │   ├── 📄 Inter_28pt-BlackItalic.ttf
│   │   │   │   ├── 📄 Inter_28pt-Bold.ttf
│   │   │   │   ├── 📄 Inter_28pt-BoldItalic.ttf
│   │   │   │   ├── 📄 Inter_28pt-ExtraBold.ttf
│   │   │   │   ├── 📄 Inter_28pt-ExtraBoldItalic.ttf
│   │   │   │   ├── 📄 Inter_28pt-ExtraLight.ttf
│   │   │   │   ├── 📄 Inter_28pt-ExtraLightItalic.ttf
│   │   │   │   ├── 📄 Inter_28pt-Italic.ttf
│   │   │   │   ├── 📄 Inter_28pt-Light.ttf
│   │   │   │   ├── 📄 Inter_28pt-LightItalic.ttf
│   │   │   │   ├── 📄 Inter_28pt-Medium.ttf
│   │   │   │   ├── 📄 Inter_28pt-MediumItalic.ttf
│   │   │   │   ├── 📄 Inter_28pt-Regular.ttf
│   │   │   │   ├── 📄 Inter_28pt-SemiBold.ttf
│   │   │   │   ├── 📄 Inter_28pt-SemiBoldItalic.ttf
│   │   │   │   ├── 📄 Inter_28pt-Thin.ttf
│   │   │   │   └── 📄 Inter_28pt-ThinItalic.ttf
│   │   │   ├── 📝 FONT_SETUP_GUIDE.md
│   │   │   ├── 📄 Inter-Bold.ttf
│   │   │   ├── 📄 Inter-Italic-Variable.ttf
│   │   │   ├── 📄 Inter-Italic-VariableFont_opsz,wght.ttf
│   │   │   ├── 📄 Inter-Medium.ttf
│   │   │   ├── 📄 Inter-Regular.ttf
│   │   │   ├── 📄 Inter-SemiBold.ttf
│   │   │   ├── 📄 Inter-Variable.ttf
│   │   │   ├── 📄 Inter-VariableFont_opsz,wght.ttf
│   │   │   ├── 📄 OFL.txt
│   │   │   ├── 📝 README.md
│   │   │   └── 📄 README.txt
│   │   ├── 📁 icons
│   │   │   ├── 📝 README.md
│   │   │   ├── 🖼️ cart_icon.svg
│   │   │   ├── 🖼️ category_icon.svg
│   │   │   ├── 🖼️ google_icon.png
│   │   │   ├── 🖼️ home_icon.svg
│   │   │   ├── 🖼️ location_icon.svg
│   │   │   ├── 🖼️ logout_icon.svg
│   │   │   ├── 🖼️ love_icon.svg
│   │   │   ├── 🖼️ notification_icon.svg
│   │   │   ├── 🖼️ order_icon.svg
│   │   │   └── 🖼️ profile_icon.svg
│   │   ├── 📁 images
│   │   │   └── 📝 README.md
│   │   └── 🖼️ Corpeas_new.png
│   ├── 📁 components
│   │   ├── 📁 common
│   │   │   ├── 📄 Accordion.tsx
│   │   │   ├── 📄 AddToCartButton.tsx
│   │   │   ├── 📄 Avatar.tsx
│   │   │   ├── 📄 Badge.tsx
│   │   │   ├── 📄 Brand.tsx
│   │   │   ├── 📄 Button.tsx
│   │   │   ├── 📄 Card.tsx
│   │   │   ├── 📄 Carousel.tsx
│   │   │   ├── 📄 CartIcon.tsx
│   │   │   ├── 📄 CategoryIcon.tsx
│   │   │   ├── 📄 Checkbox.tsx
│   │   │   ├── 📄 Chip.tsx
│   │   │   ├── 📄 ConfirmationDialog.tsx
│   │   │   ├── 📄 DatePicker.tsx
│   │   │   ├── 📄 Divider.tsx
│   │   │   ├── 📄 EmptyState.tsx
│   │   │   ├── 📄 ErrorBoundary.tsx
│   │   │   ├── 📄 ErrorMessage.tsx
│   │   │   ├── 📄 FavoriteButton.tsx
│   │   │   ├── 📄 HeaderText.tsx
│   │   │   ├── 📄 HomeIcon.tsx
│   │   │   ├── 📄 IconButton.tsx
│   │   │   ├── 📄 ImagePicker.tsx
│   │   │   ├── 📄 ListItem.tsx
│   │   │   ├── 📄 Loader.tsx
│   │   │   ├── 📄 LocationIcon.tsx
│   │   │   ├── 📄 Modal.tsx
│   │   │   ├── 📄 NotificationIcon.tsx
│   │   │   ├── 📄 OrderIcon.tsx
│   │   │   ├── 📄 PlaceholderIcon.tsx
│   │   │   ├── 📄 ProfileIcon.tsx
│   │   │   ├── 📄 ProgressBar.tsx
│   │   │   ├── 📄 QuantityStepper.tsx
│   │   │   ├── 📄 RadioButton.tsx
│   │   │   ├── 📄 SearchInput.tsx
│   │   │   ├── 📄 Snackbar.tsx
│   │   │   ├── 📄 Spacer.tsx
│   │   │   ├── 📄 StarRating.tsx
│   │   │   ├── 📄 StepIndicator.tsx
│   │   │   ├── 📄 Switch.tsx
│   │   │   ├── 📄 TabBar.tsx
│   │   │   ├── 📄 TextInput.tsx
│   │   │   ├── 📄 TimePicker.tsx
│   │   │   ├── 📄 Tooltip.tsx
│   │   │   ├── 📄 Typography.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📁 layout
│   │       ├── 📄 Backdrop.tsx
│   │       ├── 📄 BottomNavBar.tsx
│   │       ├── 📄 CartSummaryBar.tsx
│   │       ├── 📄 CategorySections.tsx
│   │       ├── 📄 ChefCard.tsx
│   │       ├── 📄 ChefList.tsx
│   │       ├── 📄 DualHeaderLayout.tsx
│   │       ├── 📄 FloatingActionButton.tsx
│   │       ├── 📄 Header.tsx
│   │       ├── 📄 ProductCard.tsx
│   │       ├── 📄 ProductCardStyles.ts
│   │       ├── 📄 ProductGrid.tsx
│   │       ├── 📄 PromoBanner.tsx
│   │       ├── 📄 SafeAreaWrapper.tsx
│   │       ├── 📄 SectionHeader.tsx
│   │       ├── 📄 ServiceTabs.tsx
│   │       ├── 📄 SideDrawer.tsx
│   │       ├── 📄 StepsBar.tsx
│   │       ├── 📄 StickyFooter.tsx
│   │       ├── 📄 UnifiedHeader.tsx
│   │       └── 📄 index.ts
│   ├── 📁 config
│   │   ├── 📄 constants.ts
│   │   ├── 📄 countryCodes.ts
│   │   ├── 📄 environment.ts
│   │   ├── 📄 firebase.ts
│   │   ├── 📄 index.ts
│   │   ├── 📄 notifications.ts
│   │   ├── 📄 servicesConfig.ts
│   │   └── 📄 theme.ts
│   ├── 📁 constants
│   │   └── 📄 ui.ts
│   ├── 📁 contexts
│   │   ├── 📄 AuthContext.tsx
│   │   ├── 📄 CartContext.tsx
│   │   ├── 📄 FirebaseContext.tsx
│   │   ├── 📄 LocationContext.tsx
│   │   ├── 📄 NotificationContext.tsx
│   │   └── 📄 ThemeContext.tsx
│   ├── 📁 features
│   │   ├── 📁 auth
│   │   │   ├── 📁 components
│   │   │   │   ├── 📄 ForgotPasswordForm.tsx
│   │   │   │   ├── 📄 LoginForm.tsx
│   │   │   │   ├── 📄 SignupForm.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 hooks
│   │   │   │   ├── 📄 useEmailAuth.ts
│   │   │   │   └── 📄 useResendCountdown.ts
│   │   │   ├── 📁 screens
│   │   │   │   ├── 📄 ForgotPasswordScreen.tsx
│   │   │   │   ├── 📄 LoginScreen.tsx
│   │   │   │   └── 📄 SignupScreen.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 cart
│   │   │   ├── 📁 coupons
│   │   │   │   └── 📄 CouponsScreen.tsx
│   │   │   └── 📁 screens
│   │   │       ├── 📄 CartScreen.tsx
│   │   │       └── 📄 OrderConfirmationScreen.tsx
│   │   ├── 📁 home
│   │   │   ├── 📁 components
│   │   │   │   ├── 📄 HomeHeader.tsx
│   │   │   │   ├── 📄 MenuItemCard.tsx
│   │   │   │   ├── 📄 OrderCard.tsx
│   │   │   │   ├── 📄 ProductCard.tsx
│   │   │   │   ├── 📄 RestaurantCard.tsx
│   │   │   │   └── 📄 ServiceCard.tsx
│   │   │   ├── 📁 hooks
│   │   │   │   ├── 📄 useHomeData.ts
│   │   │   │   ├── 📄 usePromotions.ts
│   │   │   │   └── 📄 useWishlist.ts
│   │   │   ├── 📁 screens
│   │   │   │   ├── 📄 HomeScreen.tsx
│   │   │   │   └── 📄 RestaurantDetailsScreen.tsx
│   │   │   └── 📁 services
│   │   │       └── 📄 homeService.ts
│   │   ├── 📁 orders
│   │   │   ├── 📁 components
│   │   │   │   └── 📄 OrderList.tsx
│   │   │   ├── 📁 hooks
│   │   │   │   ├── 📁 __tests__
│   │   │   │   ├── 📄 useMainOrders.ts
│   │   │   │   └── 📄 useOrderDetails.ts
│   │   │   └── 📁 screens
│   │   │       ├── 📄 MainOrdersScreen.tsx
│   │   │       ├── 📄 OrderDetailsScreen.tsx
│   │   │       └── 📄 OrdersScreen.tsx
│   │   ├── 📁 product
│   │   │   ├── 📁 hooks
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 useProducts.ts
│   │   │   ├── 📁 screens
│   │   │   │   ├── 📄 CategoriesScreen.tsx
│   │   │   │   ├── 📄 ProductDetailsScreen.tsx
│   │   │   │   ├── 📄 ProductScreen.tsx
│   │   │   │   ├── 📄 ProductsPage.tsx
│   │   │   │   └── 📄 SearchResultsScreen.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 services
│   │   │   ├── 📁 screens
│   │   │   │   └── 📄 ServiceScreen.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📁 settings
│   │       ├── 📁 addresses
│   │       │   ├── 📁 components
│   │       │   │   └── 📄 AddressForm.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   └── 📄 useAddresses.ts
│   │       │   └── 📁 screens
│   │       │       └── 📄 AddressesScreen.tsx
│   │       ├── 📁 generalInfo
│   │       │   ├── 📁 components
│   │       │   │   └── 📄 TermsAndConditions.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   └── 📄 useGeneralInfo.ts
│   │       │   └── 📁 screens
│   │       │       └── 📄 GeneralInfoScreen.tsx
│   │       ├── 📁 helpSupport
│   │       │   ├── 📁 components
│   │       │   │   └── 📄 FAQList.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   └── 📄 useFAQs.ts
│   │       │   └── 📁 screens
│   │       │       └── 📄 HelpSupportScreen.tsx
│   │       ├── 📁 navigation
│   │       │   └── 📄 SettingsNavigator.tsx
│   │       ├── 📁 notifications
│   │       │   ├── 📁 components
│   │       │   │   └── 📄 NotificationItem.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   └── 📄 useNotifications.ts
│   │       │   └── 📁 screens
│   │       │       └── 📄 NotificationsScreen.tsx
│   │       ├── 📁 orders
│   │       │   ├── 📁 components
│   │       │   │   └── 📄 OrderList.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   ├── 📁 __tests__
│   │       │   │   ├── 📄 useOrderDetails.ts
│   │       │   │   └── 📄 useOrders.ts
│   │       │   ├── 📁 screens
│   │       │   │   ├── 📄 OrderDetailsScreen.tsx
│   │       │   │   └── 📄 OrdersScreen.tsx
│   │       │   └── 📄 index.ts
│   │       ├── 📁 preferences
│   │       │   ├── 📁 components
│   │       │   │   └── 📄 PreferencesForm.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   └── 📄 usePreferences.ts
│   │       │   └── 📁 screens
│   │       │       └── 📄 PreferencesScreen.tsx
│   │       ├── 📁 profile
│   │       │   ├── 📁 components
│   │       │   │   └── 📄 EditProfileForm.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   └── 📄 useProfile.ts
│   │       │   └── 📁 screens
│   │       │       └── 📄 ProfileScreen.tsx
│   │       ├── 📁 socialMedia
│   │       │   ├── 📁 components
│   │       │   │   └── 📄 SocialMediaRow.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   └── 📄 useSocialMedia.ts
│   │       │   └── 📁 screens
│   │       │       └── 📄 SocialMediaScreen.tsx
│   │       ├── 📁 wishlist
│   │       │   ├── 📁 components
│   │       │   │   ├── 📄 WishlistButton.tsx
│   │       │   │   └── 📄 WishlistItem.tsx
│   │       │   ├── 📁 hooks
│   │       │   │   └── 📄 useWishlist.ts
│   │       │   └── 📁 screens
│   │       │       └── 📄 WishlistScreen.tsx
│   │       ├── 📄 SettingsIndex.tsx
│   │       └── 📄 index.ts
│   ├── 📁 hooks
│   │   └── 📄 index.ts
│   ├── 📁 navigation
│   │   ├── 📄 AppNavigator.tsx
│   │   ├── 📄 AuthNavigator.tsx
│   │   ├── 📄 CartStackNavigator.tsx
│   │   ├── 📄 MainNavigator.tsx
│   │   ├── 📄 MainTabNavigator.tsx
│   │   ├── 📄 OrdersStackNavigator.tsx
│   │   ├── 📄 ProductStackNavigator.tsx
│   │   ├── 📄 index.ts
│   │   └── 📄 types.ts
│   ├── 📁 scripts
│   │   ├── 📝 corpase explian.md
│   │   └── 📄 firebase-seed.js
│   ├── 📁 services
│   │   └── 📁 firebase
│   │       ├── 📁 auth
│   │       │   ├── 📄 authHelpers.ts
│   │       │   └── 📄 authService.ts
│   │       ├── 📁 firestore
│   │       │   └── 📄 productService.ts
│   │       ├── 📄 cartService.test.ts
│   │       ├── 📄 cartService.ts
│   │       ├── 📄 config.ts
│   │       ├── 📄 orderService.ts
│   │       ├── 📄 orderSplitService.ts
│   │       ├── 📄 otherServices.ts
│   │       ├── 📄 restaurantService.ts
│   │       └── 📄 userService.ts
│   ├── 📁 store
│   │   ├── 📁 middleware
│   │   │   ├── 📄 analyticsMiddleware.ts
│   │   │   ├── 📄 authMiddleware.ts
│   │   │   └── 📄 persistenceMiddleware.ts
│   │   ├── 📁 slices
│   │   │   ├── 📄 appStore.ts
│   │   │   ├── 📄 authSlice.ts
│   │   │   ├── 📄 authThunks.ts
│   │   │   ├── 📄 cartSlice.ts
│   │   │   ├── 📄 locationSlice.ts
│   │   │   ├── 📄 notificationStore.ts
│   │   │   ├── 📄 ordersSlice.ts
│   │   │   ├── 📄 productsSlice.ts
│   │   │   └── 📄 userSlice.ts
│   │   ├── 📄 index.ts
│   │   └── 📄 persistConfig.ts
│   ├── 📁 types
│   │   ├── 📄 chef.ts
│   │   ├── 📄 common.ts
│   │   ├── 📄 coupon.ts
│   │   ├── 📄 firebase.ts
│   │   ├── 📄 firestore.ts
│   │   ├── 📄 index.ts
│   │   ├── 📄 navigation.ts
│   │   ├── 📄 order.ts
│   │   ├── 📄 product.ts
│   │   ├── 📄 react-native-vector-icons.d.ts
│   │   └── 📄 user.ts
│   ├── 📁 utils
│   │   ├── 📁 firebase
│   │   │   ├── 📄 converters.ts
│   │   │   ├── 📄 errorHandlers.ts
│   │   │   ├── 📄 offline.ts
│   │   │   ├── 📄 security.ts
│   │   │   └── 📄 validators.ts
│   │   ├── 📄 dateHelpers.ts
│   │   ├── 📄 firestoreHelpers.ts
│   │   ├── 📄 formatters.ts
│   │   ├── 📄 helpers.ts
│   │   ├── 📄 imageHelpers.ts
│   │   ├── 📄 locationHelpers.ts
│   │   ├── 📄 permissions.ts
│   │   ├── 📄 userSubcollections.ts
│   │   └── 📄 validators.ts
│   └── 📄 App.tsx
├── ⚙️ .env.example
├── 📄 .eslintrc.js
├── ⚙️ .gitignore
├── 📄 .prettierrc.js
├── ⚙️ .watchmanconfig
├── 📝 CART_SYNC.md
├── 📝 GOOGLE_SIGN_IN_SETUP.md
├── 📄 Gemfile
├── 📝 ImplementationAnalysis.md
├── 📝 PROJECT_DOCUMENTATION.md
├── 📝 README.md
├── ⚙️ app.json
├── 📄 babel.config.js
├── 📄 create-structure.js
├── ⚙️ firebase-service-account-key.example.json
├── 📄 firestore.rules
├── 📄 index.js
├── 📄 jest.config.js
├── 📄 metro.config.js
├── ⚙️ package.json
├── 📄 react-native.config.js
├── ⚙️ tsconfig.json
└── 📦 yarn.lock
```

---
*Generated by FileTree Pro Extension*