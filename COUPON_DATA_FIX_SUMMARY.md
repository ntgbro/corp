# Coupon Data Fix Summary

## Issue Description
The coupon data in carts was being stored with excessive information, including full coupon details like `applicableFor`, `cities`, `dayOfWeek`, `restaurants`, `services`, and `zones`. According to project specifications, only essential coupon information should be stored to avoid data duplication.

## Root Cause
1. In the `CartService.applyCoupon` method, the entire coupon object was being spread into the saved data
2. In the `CartContext` reducer's `APPLY_COUPON` action, the entire coupon object was also being stored

## Fixes Implemented

### 1. CartService.applyCoupon Method (cartService.ts)
- Modified to store only essential coupon information:
  - `id` and `code` (required identifiers)
  - `discountType` and `discountValue` (for discount calculation)
  - `maxDiscountAmount`, `minOrderAmount`, `minOrderCount` (constraint fields)
  - `appliedAt` (timestamp)

### 2. CartContext Reducer APPLY_COUPON Action (CartContext.tsx)
- Updated to follow the same pattern as CartService
- Stores only essential fields needed for coupon functionality
- Includes all required fields from the AppliedCoupon interface

### 3. TypeScript Error Fixes (CartContext.tsx)
- Fixed type issues with optional fields
- Ensured productIdToUse is always a string when passed to CartService.getProductDetails

### 4. Cleanup Script (fixCouponData.ts)
- Created a script to fix existing carts with excessive coupon data
- Identifies carts with coupons containing more than 10 fields (indicating excessive data)
- Extracts and stores only essential coupon information
- Can be run to clean up existing data in the database

## Benefits
1. **Reduced Data Size**: Eliminates storage of unnecessary coupon details in each cart
2. **Improved Performance**: Less data to transfer and process
3. **Cost Efficiency**: Reduced Firebase storage and bandwidth costs
4. **Data Consistency**: Follows the project specification for coupon data storage
5. **Backward Compatibility**: Existing carts can be cleaned up with the provided script

## How to Run Cleanup
To fix existing carts with excessive coupon data:

```bash
# Run the cleanup script
npx ts-node src/scripts/fixCouponData.ts
```

This will:
1. Scan all users and their carts
2. Identify carts with excessive coupon data
3. Extract only essential fields and update the cart
4. Report the number of carts processed and fixed

## Verification
After implementing these changes:
1. New coupons will be stored with only essential information
2. Existing carts can be cleaned up with the provided script
3. The coupon functionality remains fully intact
4. Data duplication is eliminated