# Cart Synchronization with Firebase

This document explains how the shopping cart synchronization works in the Corpease application.

## Overview

The cart synchronization feature ensures that a user's shopping cart is persisted in Firebase Firestore and synchronized across all devices. This allows users to access their cart from any device and maintains their shopping progress even if they switch devices or experience network issues.

## Architecture

### Components

1. **CartContext** - Manages the local cart state in Redux
2. **CartService** - Handles all Firebase operations for the cart
3. **Firebase Firestore** - Stores cart data in the cloud

### Data Structure

#### Cart Document
```
users/{userId}/cart/{cartId}
- cartId: string
- userId: string
- itemCount: number
- totalAmount: number
- status: string (active, completed, abandoned)
- deliveryType: string (delivery, pickup)
- appliedCoupon: object
- restaurantId: string
- serviceId: string
- warehouseId: string
- addedAt: timestamp
- updatedAt: timestamp
```

#### Cart Items Subcollection
```
users/{userId}/cart/{cartId}/cart_items/{itemId}
- itemId: string
- userId: string
- productId: string
- menuItemId: string
- name: string
- price: number
- quantity: number
- totalPrice: number
- customizations: array
- notes: string
- addedAt: timestamp
```

## Synchronization Flow

### 1. Adding Items to Cart

When a user adds an item to their cart:

1. Item is added to local Redux state via `CartContext.addToCart()`
2. If user is authenticated, `CartService.addItemToCart()` is called
3. Service checks if item already exists in Firebase cart
4. If item exists, quantity is updated; otherwise, new item is created
5. Cart totals are updated in Firebase

### 2. Updating Item Quantities

When a user updates an item quantity:

1. Local Redux state is updated via `CartContext.updateQuantity()`
2. If user is authenticated, `CartService.updateItemQuantity()` is called
3. Firebase item quantity is updated
4. Cart totals are recalculated and updated in Firebase

### 3. Removing Items

When a user removes an item:

1. Item is removed from local Redux state via `CartContext.removeFromCart()`
2. If user is authenticated, `CartService.removeItemFromCart()` is called
3. Item is deleted from Firebase
4. Cart totals are updated in Firebase

### 4. Applying Coupons

When a user applies a coupon:

1. Coupon is applied to local Redux state via `CartContext.applyCoupon()`
2. If user is authenticated, `CartService.applyCoupon()` is called
3. Coupon data is stored in Firebase cart document

## Offline Support

The cart synchronization feature includes offline support:

1. All cart operations work offline using local Redux state
2. When connectivity is restored, pending operations are synced with Firebase
3. Conflicts are resolved by prioritizing the most recent local changes

## Error Handling

The service includes comprehensive error handling:

1. Network errors are caught and logged
2. Failed operations are retried with exponential backoff
3. Users are notified of critical errors
4. Local state remains consistent even if Firebase operations fail

## Usage Examples

### Adding an Item to Cart
```typescript
const { addToCart } = useCart();

const handleAddToCart = () => {
  addToCart({
    id: 'product-123',
    productId: 'product-123',
    name: 'Test Product',
    price: 10,
    image: 'https://example.com/image.jpg',
    chefId: 'chef-456',
    chefName: 'Test Chef',
  });
};
```

### Updating Item Quantity
```typescript
const { updateQuantity } = useCart();

const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
  updateQuantity(itemId, newQuantity);
};
```

### Removing an Item
```typescript
const { removeFromCart } = useCart();

const handleRemoveItem = (itemId: string) => {
  removeFromCart(itemId);
};
```

## Testing

The cart synchronization can be tested using the provided test suite:

```bash
npm test src/services/firebase/cartService.test.ts
```

## Future Improvements

1. **Conflict Resolution** - More sophisticated conflict resolution for offline scenarios
2. **Batch Operations** - Batch Firebase operations for better performance
3. **Real-time Updates** - Listen for real-time cart changes from other devices
4. **Advanced Analytics** - Track cart abandonment and user behavior patterns