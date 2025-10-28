import { Middleware } from '@reduxjs/toolkit';

// Analytics middleware to track user actions
export const analyticsMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);
  const typedAction = action as { type: string; payload?: any };

  // Track authentication events
  if (typedAction.type === 'auth/setUser') {
    if (typedAction.payload) {
      // User logged in
      console.log('Analytics: User logged in', {
        userId: typedAction.payload.id,
        phoneNumber: typedAction.payload.phoneNumber,
        role: typedAction.payload.role,
      });

      // Here you would send to your analytics service
      // analytics.track('user_login', { userId: typedAction.payload.id });
    } else {
      // User logged out
      console.log('Analytics: User logged out');

      // analytics.track('user_logout');
    }
  }

  // Track cart events
  if (typedAction.type === 'cart/addToCart') {
    console.log('Analytics: Product added to cart', {
      productId: typedAction.payload?.id,
      productName: typedAction.payload?.name,
      price: typedAction.payload?.price,
      cartItemCount: (store.getState() as any).cart?.totalItems || 0,
    });

    // analytics.track('product_added_to_cart', {
    //   productId: typedAction.payload?.id,
    //   cartItemCount: (store.getState() as any).cart?.totalItems || 0,
    // });
  }

  if (typedAction.type === 'cart/removeFromCart') {
    console.log('Analytics: Product removed from cart', {
      productId: typedAction.payload,
      cartItemCount: (store.getState() as any).cart?.totalItems || 0 - 1,
    });
  }

  // Track order events
  if (typedAction.type === 'orders/addOrder') {
    console.log('Analytics: New order placed', {
      orderId: typedAction.payload?.id,
      totalAmount: typedAction.payload?.totalAmount,
      itemCount: typedAction.payload?.items?.length,
    });

    // analytics.track('order_placed', {
    //   orderId: typedAction.payload?.id,
    //   totalAmount: typedAction.payload?.totalAmount,
    // });
  }

  // Track product views
  if (typedAction.type === 'products/updateProduct') {
    // This could be triggered when a product is viewed
    console.log('Analytics: Product updated in store', {
      productId: typedAction.payload?.id,
    });
  }

  return result;
};
