# Order Split Service Example

This document demonstrates how the OrderSplitService handles the specific case of a "sweets / desserts" category item with the provided data structure.

## Sample Data Structure

The service handles items with the following structure:

```json
{
  "category": "sweets / desserts",
  "chefId": "REST_MGQK222U_4AXNC",
  "cuisine": "Indian",
  "customerId": "xI1PayGaN9ZVHCIPhTt2BdTdiSW2",
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
  "unitPrice": 350
}
```

## Special Handling for Fresh Serve Service

For items with serviceId "anaJiWM2bcrlRfqsGlVU" (Fresh Serve Service), the chefId field is excluded from the stored data as it's not required.

This is implemented in the [orderSplitService.ts](src/services/firebase/orderSplitService.ts) file with the following logic:

```typescript
const isFreshServeService = item.serviceId === 'anaJiWM2bcrlRfqsGlVU'; // Fresh serve service ID

// Only include chefId for restaurant items, but exclude for fresh serve service
...(!isFreshServeService && isRestaurantItem && { chefId: restaurantId }),
```

This ensures that when processing items for the Fresh Serve service, the chefId field is omitted from the stored order item data while preserving all other relevant information.