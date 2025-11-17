import { collection, doc, setDoc, getDoc, GeoPoint, query, where, getDocs, updateDoc } from '@react-native-firebase/firestore';
import { db } from '../config/firebase';
import { Platform, Dimensions } from 'react-native';
import { DocumentSnapshot } from '../types/firebase';
import { ENVIRONMENT } from '../config/environment';
import DeviceInfo from 'react-native-device-info';

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
      appliedCoupon: null,
      restaurantId: '',
      serviceId: '',
      warehouseId: '',
      userId: userId,
      addedAt: new Date(),
      updatedAt: new Date(),
      usedForOrder: false,
    });
    
    // 5. Create an empty sessions subcollection document
    const sessionRef = doc(collection(db, 'users', userId, 'sessions'));
    
    // Generate a more robust device ID
    const deviceId = `${Platform.OS}_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get comprehensive device information using react-native-device-info
    const deviceInfoObject = {
      platform: Platform.OS,
      osVersion: Platform.Version,
      model: DeviceInfo.getModel ? DeviceInfo.getModel() : 'Unknown Device',
      brand: DeviceInfo.getBrand ? DeviceInfo.getBrand() : 'Unknown',
      deviceId: DeviceInfo.getDeviceId ? DeviceInfo.getDeviceId() : 'Unknown',
      appVersion: ENVIRONMENT.VERSION,
      buildNumber: DeviceInfo.getBuildNumber ? DeviceInfo.getBuildNumber() : 'Unknown',
      screenResolution: `${Dimensions.get('screen').width}x${Dimensions.get('screen').height}`,
      pixelRatio: Dimensions.get('screen').scale,
      fontScale: Dimensions.get('screen').fontScale || 1,
      userAgent: `CorpEaseApp/${ENVIRONMENT.VERSION} (${Platform.OS} ${Platform.Version})`,
      uniqueId: 'Unknown',
      systemName: Platform.OS === 'ios' ? 'iOS' : 'Android',
      systemVersion: DeviceInfo.getSystemVersion ? DeviceInfo.getSystemVersion() : 'Unknown',
      timestamp: new Date().toISOString()
    };
    
    // Try to get additional information safely
    try {
      // Try to get user agent
      if (typeof DeviceInfo.getUserAgentSync === 'function') {
        deviceInfoObject.userAgent = DeviceInfo.getUserAgentSync() || deviceInfoObject.userAgent;
      }
      
      // Try to get unique ID
      if (typeof DeviceInfo.getUniqueIdSync === 'function') {
        deviceInfoObject.uniqueId = DeviceInfo.getUniqueIdSync() || deviceInfoObject.uniqueId;
      }
      
      // Try to get system name for iOS
      if (Platform.OS === 'ios' && typeof DeviceInfo.getSystemName === 'function') {
        deviceInfoObject.systemName = DeviceInfo.getSystemName() || deviceInfoObject.systemName;
      }
    } catch (error) {
      console.warn('Error getting additional device info:', error);
    }
    
    // Create detailed user agent string
    const userAgent = deviceInfoObject.userAgent;
    
    await setDoc(sessionRef, {
      sessionId: sessionRef.id,
      userId: userId,
      deviceId: deviceId,
      platform: Platform.OS,
      fcmToken: '', // Will be updated when FCM token is available
      ipAddress: '', // Could be populated later if needed
      userAgent: userAgent,
      lastActivity: new Date(),
      lastSeenAt: new Date(),
      isActive: true,
      createdAt: new Date(),
      // Store detailed device info as a JSON string
      deviceInfo: JSON.stringify(deviceInfoObject),
      // Also store individual device properties for easier querying
      deviceModel: deviceInfoObject.model,
      deviceBrand: deviceInfoObject.brand,
      osVersion: deviceInfoObject.osVersion,
      appVersion: deviceInfoObject.appVersion,
      systemName: deviceInfoObject.systemName,
      systemVersion: deviceInfoObject.systemVersion
    });
    
    // 6. Initialize coupon_usage subcollection (don't create empty document)
    // The coupon_usage subcollection will be populated when coupons are actually used
    console.log('Initialized coupon_usage subcollection for user:', userId);
    
    // 7. Create an empty cart_items subcollection document (as subcollection of cart)
    // Add a small delay to ensure the cart document is fully created before creating subcollections
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cartItemRef = doc(collection(db, 'users', userId, 'cart', cartRef.id, 'cart_items'));
    await setDoc(cartItemRef, {
      itemId: cartItemRef.id,
      userId: userId,
      productId: 'product123',
      menuItemId: 'menu123',
      name: 'Pizza',
      price: 10,
      quantity: 2,
      totalPrice: 20,
      customizations: [{ name: 'Extra Cheese', price: 2 }],
      notes: 'No onions',
      addedAt: new Date(),
    });
    
    // 8. Create an empty order_history subcollection document
    const orderHistoryRef = doc(collection(db, 'users', userId, 'order_history'));
    await setDoc(orderHistoryRef, {
      historyId: orderHistoryRef.id,
      userId: userId,
      orders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('User subcollections initialized successfully');
  } catch (error: any) {
    console.error('Error initializing user subcollections:', error);
    
    // Check if it's a permission error
    if (error.code === 'firestore/permission-denied') {
      console.error('Permission denied when initializing subcollections. This might be due to security rules.');
      console.error('Please ensure Firestore rules are deployed and include permissions for all user subcollections.');
    }
    
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

/**
 * Update session with FCM token
 * @param userId - The Firebase user ID
 * @param fcmToken - The FCM token to store
 */
export const updateSessionWithFCMToken = async (userId: string, fcmToken: string): Promise<void> => {
  try {
    // Query for active sessions for this user
    const sessionsQuery = query(
      collection(db, 'users', userId, 'sessions'),
      where('isActive', '==', true)
    );
    
    const sessionsSnapshot = await getDocs(sessionsQuery);
    
    // Update all active sessions with the FCM token and last activity
    const updatePromises = sessionsSnapshot.docs.map(async (docSnapshot: DocumentSnapshot<any>) => {
      // Get current session data to preserve device information
      const sessionData = docSnapshot.data();
      
      // Prepare update data
      const updateData: Record<string, any> = {
        fcmToken: fcmToken,
        lastActivity: new Date(),
        lastSeenAt: new Date()
      };
      
      // Preserve device information if it exists
      if (sessionData.deviceInfo) {
        updateData.deviceInfo = sessionData.deviceInfo;
      }
      if (sessionData.deviceModel) {
        updateData.deviceModel = sessionData.deviceModel;
      }
      if (sessionData.deviceBrand) {
        updateData.deviceBrand = sessionData.deviceBrand;
      }
      if (sessionData.osVersion) {
        updateData.osVersion = sessionData.osVersion;
      }
      if (sessionData.appVersion) {
        updateData.appVersion = sessionData.appVersion;
      }
      if (sessionData.systemName) {
        updateData.systemName = sessionData.systemName;
      }
      if (sessionData.systemVersion) {
        updateData.systemVersion = sessionData.systemVersion;
      }
      if (sessionData.userAgent) {
        updateData.userAgent = sessionData.userAgent;
      }
      
      // Update with new FCM token and activity timestamps
      await updateDoc(doc(db, 'users', userId, 'sessions', docSnapshot.id), updateData);
    });
    
    await Promise.all(updatePromises);
    console.log('✅ Session FCM tokens updated successfully');
  } catch (error) {
    console.error('❌ Error updating session with FCM token:', error);
  }
};

/**
 * Update session last activity timestamp
 * @param userId - The Firebase user ID
 * @param sessionId - The session ID to update
 */
export const updateSessionActivity = async (userId: string, sessionId: string): Promise<void> => {
  try {
    // First, get the current session data to preserve device information
    const sessionDocRef = doc(db, 'users', userId, 'sessions', sessionId);
    const sessionDocSnap = await getDoc(sessionDocRef);
    
    // Prepare update data
    const updateData: Record<string, any> = {
      lastActivity: new Date()
    };
    
    // Preserve device information if session exists
    if (sessionDocSnap.exists()) {
      const sessionData = sessionDocSnap.data();
      if (sessionData && sessionData.deviceInfo) {
        updateData.deviceInfo = sessionData.deviceInfo;
      }
      if (sessionData && sessionData.deviceModel) {
        updateData.deviceModel = sessionData.deviceModel;
      }
      if (sessionData && sessionData.deviceBrand) {
        updateData.deviceBrand = sessionData.deviceBrand;
      }
      if (sessionData && sessionData.osVersion) {
        updateData.osVersion = sessionData.osVersion;
      }
      if (sessionData && sessionData.appVersion) {
        updateData.appVersion = sessionData.appVersion;
      }
      if (sessionData && sessionData.systemName) {
        updateData.systemName = sessionData.systemName;
      }
      if (sessionData && sessionData.systemVersion) {
        updateData.systemVersion = sessionData.systemVersion;
      }
      if (sessionData && sessionData.userAgent) {
        updateData.userAgent = sessionData.userAgent;
      }
    }
    
    await updateDoc(sessionDocRef, updateData);
    console.log('✅ Session activity updated successfully');
  } catch (error) {
    console.error('❌ Error updating session activity:', error);
  }
};

/**
 * Update session activity with additional data
 * @param userId - The Firebase user ID
 * @param sessionId - The session ID to update
 * @param additionalData - Additional data to update in the session
 */
export const updateSessionWithData = async (
  userId: string, 
  sessionId: string, 
  additionalData: Record<string, any> = {}
): Promise<void> => {
  try {
    // First, get the current session data to preserve device information
    const sessionDocRef = doc(db, 'users', userId, 'sessions', sessionId);
    const sessionDocSnap = await getDoc(sessionDocRef);
    
    // Use Record<string, any> to allow dynamic properties
    const updateData: Record<string, any> = {
      lastActivity: new Date(),
      ...additionalData
    };
    
    // Preserve device information if session exists
    if (sessionDocSnap.exists()) {
      const sessionData = sessionDocSnap.data();
      if (sessionData && sessionData.deviceInfo) {
        updateData.deviceInfo = sessionData.deviceInfo;
      }
      if (sessionData && sessionData.deviceModel) {
        updateData.deviceModel = sessionData.deviceModel;
      }
      if (sessionData && sessionData.deviceBrand) {
        updateData.deviceBrand = sessionData.deviceBrand;
      }
      if (sessionData && sessionData.osVersion) {
        updateData.osVersion = sessionData.osVersion;
      }
      if (sessionData && sessionData.appVersion) {
        updateData.appVersion = sessionData.appVersion;
      }
      if (sessionData && sessionData.systemName) {
        updateData.systemName = sessionData.systemName;
      }
      if (sessionData && sessionData.systemVersion) {
        updateData.systemVersion = sessionData.systemVersion;
      }
      if (sessionData && sessionData.userAgent) {
        updateData.userAgent = sessionData.userAgent;
      }
    }
    
    await updateDoc(sessionDocRef, updateData);
    console.log('✅ Session updated successfully with additional data');
  } catch (error) {
    console.error('❌ Error updating session with data:', error);
  }
};

/**
 * Add coupon usage record to user's coupon_usage subcollection
 * @param userId - The Firebase user ID
 * @param couponId - The ID of the coupon used
 * @param orderId - The ID of the order the coupon was applied to
 * @param discountAmount - The discount amount applied
 */
export const addCouponUsage = async (
  userId: string,
  couponId: string,
  orderId: string,
  discountAmount: number
): Promise<void> => {
  try {
    console.log('Adding coupon usage record:', { userId, couponId, orderId, discountAmount });
    
    // Validate inputs
    if (!userId || !couponId || !orderId) {
      console.warn('⚠️ Missing required parameters for addCouponUsage');
      return;
    }
    
    if (typeof discountAmount !== 'number' || isNaN(discountAmount)) {
      console.warn('⚠️ Invalid discount amount for addCouponUsage:', discountAmount);
      return;
    }
    
    const couponUsageRef = doc(collection(db, 'users', userId, 'coupon_usage'));
    
    const couponUsageData = {
      usageId: couponUsageRef.id,
      userId: userId,
      couponId: couponId,
      orderId: orderId,
      discountAmount: discountAmount,
      usageDate: new Date(),
      status: 'active'
    };
    
    console.log('Creating coupon usage document with data:', couponUsageData);
    await setDoc(couponUsageRef, couponUsageData);
    console.log('✅ Coupon usage record added successfully with ID:', couponUsageRef.id);
  } catch (error) {
    console.error('❌ Error adding coupon usage record:', error);
  }
};
