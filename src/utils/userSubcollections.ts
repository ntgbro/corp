import { collection, doc, setDoc, GeoPoint } from '@react-native-firebase/firestore';
import { db } from '../config/firebase';

/**
 * Initialize all required user subcollections
 * @param userId - The Firebase user ID
 * @param retryCount - Number of retry attempts (for internal use)
 */
export const initializeUserSubcollections = async (userId: string, retryCount = 0): Promise<void> => {
  try {
    console.log('Initializing user subcollections for user:', userId);
    
    // Create all required user subcollections with initial data
    
    // 1. Create a default address document
    const addressRef = doc(collection(db, 'users', userId, 'addresses'));
    await setDoc(addressRef, {
      addressId: 'default',
      city: '',
      cityId: '',
      contactName: '',
      contactPhone: '',
      geoPoint: new GeoPoint(0, 0),
      isActive: true,
      isDefault: true,
      label: 'home',
      line1: '',
      line2: '',
      pincode: '',
      state: '',
    });
    
    // 2. Create an empty cart document
    const cartRef = doc(collection(db, 'users', userId, 'cart'));
    await setDoc(cartRef, {
      cartId: 'default',
      itemCount: 0,
      totalAmount: 0,
      status: 'active',
      deliveryType: 'delivery',
      appliedCoupon: {},
      restaurantId: '',
      serviceId: '',
      warehouseId: '',
      addedAt: new Date(),
      updatedAt: new Date(),
    });
    
    // 3. Create an empty cart_items subcollection (no initial documents needed)
    
    // 4. Create an empty coupon_usage subcollection (no initial documents needed)
    
    // 5. Create a welcome notification
    const notificationRef = doc(collection(db, 'users', userId, 'notifications'));
    await setDoc(notificationRef, {
      title: 'Welcome!',
      message: 'Welcome to our app. This is your notifications center where you will receive important updates.',
      type: 'welcome',
      isRead: false,
      createdAt: new Date(),
      actionURL: '',
      imageURL: '',
      notificationId: 'welcome',
      relatedOrderId: '',
    });
    
    // 6. Create an empty sessions subcollection (no initial documents needed)
    
    // 7. Create an empty wishlist subcollection (no initial documents needed)
    
    console.log('User subcollections initialized successfully');
  } catch (error: any) {
    console.error('Error initializing user subcollections:', error);
    
    // Retry up to 3 times with exponential backoff
    if (retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      console.log(`Retrying subcollection initialization in ${delay}ms (attempt ${retryCount + 1}/3)`);
      setTimeout(() => {
        initializeUserSubcollections(userId, retryCount + 1);
      }, delay);
    } else {
      console.error('Failed to initialize user subcollections after 3 attempts:', error);
      // Don't throw the error to avoid breaking the registration process
    }
  }
};