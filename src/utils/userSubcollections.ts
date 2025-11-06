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
      addressId: addressRef.id,
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
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // 2. Create an empty wishlist document
    const wishlistRef = doc(collection(db, 'users', userId, 'wishlist'));
    await setDoc(wishlistRef, {
      wishlistId: wishlistRef.id,
      items: [],
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // 3. Create a welcome notification
    const notificationRef = doc(collection(db, 'users', userId, 'notifications'));
    await setDoc(notificationRef, {
      notificationId: notificationRef.id,
      title: 'Welcome!',
      message: 'Welcome to our app. This is your notifications center where you will receive important updates.',
      type: 'welcome',
      isRead: false,
      userId: userId,
      createdAt: new Date(),
      actionURL: '',
      imageURL: '',
      relatedOrderId: '',
    });
    
    // 4. Create an empty cart document
    const cartRef = doc(collection(db, 'users', userId, 'cart'));
    await setDoc(cartRef, {
      cartId: cartRef.id,
      itemCount: 0,
      totalAmount: 0,
      status: 'active',
      deliveryType: 'delivery',
      appliedCoupon: {},
      restaurantId: '',
      serviceId: '',
      warehouseId: '',
      userId: userId,
      addedAt: new Date(),
      updatedAt: new Date(),
    });
    
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