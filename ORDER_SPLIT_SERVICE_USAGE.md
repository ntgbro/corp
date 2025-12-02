# Order Split Service Usage

This document explains how to use the updated OrderSplitService with the special handling for the Fresh Serve service.

## Overview

The OrderSplitService has been updated to handle a special case where items belonging to the "Fresh Serve" service (identified by serviceId `anaJiWM2bcrlRfqsGlVU`) should not include the `chefId` field in the stored order item data.

## How It Works

The service identifies Fresh Serve service items by checking the serviceId:

```typescript
const isFreshServeService = item.serviceId === 'anaJiWM2bcrlRfqsGlVU';
```

Then, when creating order items, it conditionally excludes the chefId:

```typescript
// Only include chefId for restaurant items, but exclude for fresh serve service
...(!isFreshServeService && isRestaurantItem && { chefId: restaurantId }),
```

## Example Usage

To create an order with a "sweets / desserts" item for the Fresh Serve service:

```typescript
const orderData = {
  userId: "xI1PayGaN9ZVHCIPhTt2BdTdiSW2",
  customerId: "xI1PayGaN9ZVHCIPhTt2BdTdiSW2",
  items: [
    {
      category: "sweets / desserts",
      chefId: "REST_MGQK222U_4AXNC", // This will be excluded for Fresh Serve service
      cuisine: "Indian",
      customizations: [],
      name: "Rabri",
      prepTime: "15 mins",
      quantity: 1,
      price: 350,
      restaurantId: "REST_MGQK222U_4AXNC",
      serviceId: "anaJiWM2bcrlRfqsGlVU", // Fresh Serve service ID
      productId: "MENU_MI5W0VQ9_D8RL6",
      type: "menu_item"
    }
  ],
  // ... other order data
};

// Split and store the order
const orderId = await OrderSplitService.splitAndStoreOrder(orderData);
```

## Result

When this order is processed, the stored order item will include all the relevant data except for the `chefId` field since it belongs to the Fresh Serve service.

The final stored data structure will look like:

```json
{
  "category": "sweets / desserts",
  "cuisine": "Indian",
  "customizations": [],
  "links": {
    "menuItemId": "MENU_MI5W0VQ9_D8RL6",
    "restaurantId": "REST_MGQK222U_4AXNC",
    "serviceId": "anaJiWM2bcrlRfqsGlVU"
  },
  "name": "Rabri",
  "prepTime": "15 mins",
  "quantity": 1,
  "status": "pending",
  "totalPrice": 350,
  "type": "menu_item",
  "unitPrice": 350,
  "customerId": "xI1PayGaN9ZVHCIPhTt2BdTdiSW2"
}
```

Note that the `chefId` field is absent from the stored data, as required for the Fresh Serve service.