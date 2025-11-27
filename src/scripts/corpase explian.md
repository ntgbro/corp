<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# convert this file in the markdown file

Here is your PDF **converted into Markdown format** (structure, code blocks, and comments preserved):

***

# Firestore Database Structure for Corpease

Complete Commented Guide

***

## Overview

- **Purpose:** This document provides the complete Firestore database structure for Corpease with detailed explanations of each collection, subcollection, and field's purpose and usage in the application ecosystem.

***

## 1. USERS Collection (Main Collection)

- **Path:** `users/{userId}`
- **Purpose:** Central user management system supporting multiple user roles and personalized experiences.
- **Use Cases:**
    - User authentication and profile management
    - Role-based access control (customer, restaurant owner, admin, delivery partner)
    - Preference storage for personalized recommendations
    - Loyalty program and points management
    - Multi-device session tracking

```json
{
  "userId": "string",                   // Firebase Auth UID - unique identifier
  "email": "string",                    // User email - for authentication
  "phone": "string",                    // Phone number - for OTP verification 
  "displayName": "string",              // User's display name
  "profilePhotoURL": "string",          // Firebase Storage URL - profile picture
  "role": "customer | restaurant_owner | admin | delivery_partner", // User type
  "status": "active | suspended | pending_verification | deactivated",
  "preferences": {
    "cuisines": ["string"],             // Preferred cuisines
    "foodTypes": ["string"],            // Dietary preferences (veg, vegan, etc.)
    "notifications": {
      "orderUpdates": "boolean",
      "promotions": "boolean",
      "offers": "boolean"
    }
  },
  "loyaltyPoints": "number",            // Reward points balance
  "totalOrders": "number",              // Lifetime order count
  "joinedAt": "timestamp"               // Account creation date
}
```


***

### NOTIFICATIONS Subcollection

- **Path:** `users/{userId}/notifications/{notificationId}`
- **Purpose:** Personalized notification system for real-time communication.
- **Use Cases:** Order status, promotional campaigns, system announcements.

```json
{
  "notificationId": "string",
  "title": "string",
  "message": "string",
  "type": "order | promotion | payment | general",
  "relatedOrderId": "string",
  "imageURL": "string",
  "isRead": "boolean",
  "createdAt": "timestamp",
  "actionURL": "string"
}
```


***

### ADDRESSES Subcollection

- **Path:** `users/{userId}/addresses/{addressId}`
- **Purpose:** Multiple delivery address management with geolocation support.
- **Use Cases:** Home/work addresses, delivery optimization, soft-delete.

```json
{
  "addressId": "string",
  "label": "Home | Work | Other",
  "line1": "string",
  "line2": "string",
  "city": "string",
  "state": "string",
  "pincode": "string",
  "geoPoint": "geopoint",
  "cityId": "string",
  "contactName": "string",
  "contactPhone": "string",
  "isDefault": "boolean",
  "isActive": "boolean"
}
```


***

### CART Subcollection

- **Path:** `users/{userId}/cart/{cartId}`
- **Purpose:** Shopping cart management for food/warehouse orders.

```json
{
  "cartId": "string",
  "restaurantId": "string",              
  "warehouseId": "string",
  "status": "active | checked_out | abandoned",
  "totalAmount": "number",               
  "itemCount": "number",                 
  "addedAt": "timestamp",
  "updatedAt": "timestamp",
  "deliveryType": "delivery | pickup", 
  "appliedCoupon": {
    "couponId": "string",
    "discountAmount": "number"
  },
  "serviceId": "string"
}
```


#### CART_ITEMS Subcollection

- **Path:** `users/{userId}/cart/{cartId}/cart_items/{itemId}`
- **Purpose:** Individual cart item management and customization.

```json
{
  "itemId": "string",
  "name": "string",
  "price": "number",
  "quantity": "number",
  "totalPrice": "number",
  "customizations": [
    {
      "name": "string",
      "price": "number"
    }
  ],
  "notes": "string",
  "addedAt": "timestamp",
  "serviceId": "string",
  
  "// Only one of the following sets will be populated based on item type:",
  
  "// For Restaurant Items:",
  "menuItemId": "string",     "// The menu item ID",
  "restaurantId": "string",   "// The restaurant ID",
  
  "// For Warehouse Items:",
  "productId": "string",      "// The product ID",
  "warehouseId": "string"    "// The warehouse ID"
}
```


***

### WISHLIST Subcollection

- **Path:** `users/{userId}/wishlist/{wishlistId}`
- **Purpose:** User favorites for reordering/bookmarking.

```json
{
  "wishlistId": "string",
  "type": "restaurant | warehouse | menu_item | product",
  "restaurantId": "string",
  "warehouseId": "string",
  "itemId": "string",
  "addedAt": "timestamp",
  "serviceId": "string",
  "price": "number"
}
```


***

### SESSIONS Subcollection

- **Path:** `users/{userId}/sessions/{sessionId}`
- **Purpose:** Multi-device session tracking and FCM token storage.

```json
{
  "sessionId": "string",
  "deviceId": "string",
  "platform": "ios | android | web",
  "fcmToken": "string",
  "ipAddress": "string",
  "lastSeenAt": "timestamp",
  "isActive": "boolean",
  "createdAt": "timestamp"
}
```


***

### COUPON_USAGE Subcollection

- **Path:** `users/{userId}/coupon_usage/{usageId}`
- **Purpose:** Coupon tracking, fraud prevention, analytics.

```json
{
  "usageId": "string",
  "couponId": "string",
  "orderId": "string",
  "discountApplied": "number",
  "usedAt": "timestamp"
}
```


***

## 2. RESTAURANTS Collection (Main Collection)

- **Path:** `restaurants/{restaurantId}`
- **Purpose:** Restaurant info, menu, analytics.
- **Design:** Store cuisine/food type directly in menu items for query/cost efficiency.

```json
{
  "restaurantId": "string",
  "name": "string",
  "ownerId": "string",
  "logoURL": "string",
  "bannerURL": "string",
  "galleryURLs": ["string"],
  "description": "string",
  "address": {
    "line1": "string",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "geoPoint": "geopoint"
  },
  "cityId": "string",
  "phone": "string",
  "email": "string",
  "cuisines": ["string"],
  "avgRating": "number",
  "totalRatings": "number",
  "priceRange": "string",
  "openHours": {
    "monday": {"open": "10:00", "close": "23:00"},
    "tuesday": {"open": "10:00", "close": "23:00"},
    "wednesday": {"open": "10:00", "close": "23:00"},
    "thursday": {"open": "10:00", "close": "23:00"},
    "friday": {"open": "10:00", "close": "23:00"},
    "saturday": {"open": "10:00", "close": "23:00"},
    "sunday": {"open": "10:00", "close": "23:00"}
  },
  "deliveryCharges": "number",
  "freeDeliveryAbove": "number",
  "minOrderAmount": "number",
  "maxDeliveryRadius": "number",
  "avgDeliveryTime": "string",
  "isActive": "boolean",
  "isPromoted": "boolean",
  "isPureVeg": "boolean",
  "hasOnlinePayment": "boolean",
  "hasCashOnDelivery": "boolean",
  "orderCount": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "serviceId": "string"
}
```


***

### MENU_ITEMS Subcollection

- **Path:** `restaurants/{restaurantId}/menu_items/{menuItemId}`

```json
{
  "menuItemId": "string",
  "name": "string",
  "description": "string",
  "mainImageURL": "string",
  "galleryURLs": ["string"],
  "price": "number",
  "discountedPrice": "number",
  "category": "string",
  "subCategory": "string",
  "cuisine": "string",
  "foodType": "string",
  "isVeg": "boolean",
  "isAvailable": "boolean",
  "prepTime": "string",
  "spiceLevel": "string",
  "portionSize": "string",
  "tags": ["string"],
  "nutritionalInfo": {
    "calories": "number",
    "protein": "string",
    "carbs": "string",
    "fat": "string",
    "fiber": "string"
  },
  "allergens": ["string"],
  "ingredients": ["string"],
  "customizationOptions": [
    {
      "name": "string",
      "options": [
        {"name": "string", "price": "number"}
      ],
      "isRequired": "boolean"
    }
  ],
  "status": "active | inactive | out_of_stock",
  "orderCount": "number",
  "rating": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "serviceId": "string"
}
```


***

### INVENTORY Subcollection

- **Path:** `restaurants/{restaurantId}/inventory/{inventoryId}`

```json
{
  "inventoryId": "string",
  "ingredientId": "string",
  "name": "string",
  "currentStock": "number",
  "unit": "string",
  "reorderLevel": "number",
  "maxStockLevel": "number",
  "costPerUnit": "number",
  "supplierId": "string",
  "category": "string",
  "expiryDate": "timestamp",
  "batchNumber": "string",
  "lastRestocked": "timestamp",
  "status": "active | low_stock | out_of_stock",
  "totalCost": "number"
}
```


#### MOVEMENTS Subcollection

- **Path:** `restaurants/{restaurantId}/inventory/{inventoryId}/movements/{movementId}`

```json
{
  "movementId": "string",
  "type": "addition | deduction",
  "quantity": "number",
  "unit": "string",
  "reason": "string",
  "doneBy": "string",
  "createdAt": "timestamp"
}
```


***

### CHEFS Subcollection

- **Path:** `restaurants/{restaurantId}/chefs/{chefId}`

```json
{
  "chefId": "string",
  "name": "string",
  "age": "number",
  "gender": "string",
  "experience": "string",
  "availability": "active | break | day_off",
  "photoURL": "string",
  "rating": "number",
  "contact": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```


***

### NOTIFICATIONS Subcollection

- **Path:** `restaurants/{restaurantId}/notifications/{notificationId}`

```json
{
  "notificationId": "string",
  "title": "string",
  "message": "string",
  "type": "order | promotion | payment | inventory",
  "relatedOrderId": "string",
  "isRead": "boolean",
  "createdAt": "timestamp"
}
```


***

### REVIEWS Subcollection

- **Path:** `restaurants/{restaurantId}/reviews/{reviewId}`

```json
{
  "reviewId": "string",
  "userId": "string",
  "orderId": "string",
  "rating": "number",
  "comment": "string",
  "imageURLs": ["string"],
  "isVerified": "boolean",
  "helpfulCount": "number",
  "createdAt": "timestamp",
  "restaurantReply": {
    "message": "string",
    "repliedAt": "timestamp"
  }
}
```


***

## 3. ORDERS Collection (Main Collection)

- **Path:** `orders/{orderId}`
- **Purpose:** Complete order lifecycle management.

```json
{
  "orderId": "string",
  "userId": "string",
  "restaurantId": "string",
  "warehouseId": "string",
  "deliveryPartnerId": "string",
  "type": "restaurant | warehouse",
  "deliveryType": "delivery | pickup",
  "status": "pending | confirmed | preparing | ready | out_for_delivery | delivered | cancelled",
  "totalAmount": "number",
  "discount": "number",
  "deliveryCharges": "number",
  "taxes": "number",
  "finalAmount": "number",
  "paymentStatus": "paid | pending | failed | refunded",
  "paymentMethod": "UPI | card | cod | wallet",
  "deliveryAddress": {
    "addressId": "string",
    "line1": "string",
    "line2": "string",
    "city": "string",
    "pincode": "string",
    "geoPoint": "geopoint",
    "contactName": "string",
    "contactPhone": "string",
    "saveForFuture": "boolean"
  },
  "estimatedDeliveryTime": "string",
  "actualDeliveryTime": "string",
  "instructions": "string",
  "appliedCoupons": [
    {
      "couponId": "string",
      "discountAmount": "number"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "scheduledFor": "timestamp",
  "cancellationReason": "string",
  "refundAmount": "number"
}
```


#### ORDER_ITEMS Subcollection

- **Path:** `orders/{orderId}/order_items/{itemId}`

```json
{
  "itemId": "string",
  "name": "string",
  "quantity": "number",
  "unitPrice": "number",
  "totalPrice": "number",
  "type": "menu_item | product",
  "category": "string",
  "cuisine": "string",
  "foodType": "string",
  "customizations": [
    {
      "name": "string",
      "price": "number"
    }
  ],
  "links": {
    "menuItemId": "string",
    "productId": "string",
    "restaurantId": "string",
    "warehouseId": "string"
  },
  "chefId": "string",
  "prepTime": "string",
  "status": "pending | preparing | ready"
}
```


#### STATUS_HISTORY Subcollection

- **Path:** `orders/{orderId}/status_history/{statusId}`

```json
{
  "statusId": "string",
  "status": "string",
  "updatedBy": "restaurant | delivery_partner | system | user",
  "timestamp": "timestamp",
  "remarks": "string",
  "location": {
    "lat": "number",
    "lng": "number"
  },
  "estimatedTime": "string"
}
```


#### PAYMENT Subcollection

- **Path:** `orders/{orderId}/payment/{transactionId}`

```json
{
  "transactionId": "string",
  "amount": "number",
  "status": "success | pending | failed",
  "method": "string",
  "provider": "string",
  "gateway": "string",
  "gatewayTransactionId": "string",
  "timestamp": "timestamp",
  "failureReason": "string",
  "refundTransactionId": "string"
}
```


***

## 4. Additional Collections

- **PROMOTIONS Collection:** Marketing campaign management with usage tracking
- **COUPONS Collection:** Discount management, validation
- **CITIES Collection:** Service area/delivery zone boundaries and config
- **DELIVERY_PARTNERS Collection:** Delivery personnel info, location tracking, KYC, etc.
- **PAYMENTS Collection:** Central payment processing/receipts
- **SUPPORT_TICKETS Collection:** Customer support and issue resolution system

***

## Firebase Storage Structure

- **Entity-based folder organization**
- **User Profile Images, Restaurant Branding, Menu Photos, Delivery Partner KYC, Promotional Materials, Receipts, Support Ticket Attachments**

***

## Design \& Integration Points

- **Direct string fields for cuisine/food in menu items**
- **Geopoints throughout for mapping**
- **Custom OTP system for delivery**
- **Order addresses stored as snapshots for history**
- **Files organized in Firebase Storage, referenced in Firestore**
- **Google Maps API, Payment gateways, SMS (OTP), Push (FCM) integrated**

***

## Conclusion

This database structure is designed for **scalable, high-performance, real-world apps**, supporting complex business workflows in a food delivery/e-commerce app.

***

If you want this as a downloadable Markdown file, let me know your preferred filename!
<span style="display:none">[^1]</span>

<div align="center">⁂</div>

[^1]: firestore-database-complete-commented.pdf

