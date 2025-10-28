// Firebase Seed Script
// This script seeds the Firestore database with sample data based on the provided structure.
// Run this in a Node.js environment with Firebase Admin SDK installed.
// Ensure you have a service account key JSON file.

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Replace with your service account key path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/project/corpeas-ee450/storage/corpeas-ee450.firebasestorage.app/files' // Replace with your database URL
});

const db = admin.firestore();

// Helper function to add a document and return its reference
async function addDocument(collectionPath, data) {
  // Split the path by '/' to handle nested collections
  const pathSegments = collectionPath.split('/');
  let ref;
  
  // If there's only one segment, it's a top-level collection
  if (pathSegments.length === 1) {
    ref = db.collection(collectionPath).doc();
  } 
  // If there are multiple segments, build the reference properly
  else if (pathSegments.length % 2 === 1) {
    // Odd number of segments means it's a document reference
    ref = db.doc(collectionPath);
  } else {
    // Even number of segments means it's a collection reference
    ref = db.collection(collectionPath).doc();
  }
  
  await ref.set(data);
  console.log(`Added document to ${collectionPath} with ID: ${ref.id}`);
  return ref;
}

// Helper function for GeoPoint
function geoPoint(lat, lng) {
  return new admin.firestore.GeoPoint(lat, lng);
}

// Helper function to add subcollection document
async function addSubDocument(parentRef, subCollectionName, data) {
  const ref = parentRef.collection(subCollectionName).doc();
  await ref.set(data);
  console.log(`Added subdocument to ${subCollectionName} under ${parentRef.path} with ID: ${ref.id}`);
  return ref;
}

// Seed Functions for each collection

async function seedReports() {
  // GLOBAL_REPORTS: Under reports/global/{monthId}
  const globalDocRef = db.collection('reports').doc('global');
  await globalDocRef.set({}); // Dummy parent if needed
  const globalReportData = {
    monthId: '2025-10',
    totalOrders: 1000,
    completedOrders: 900,
    cancelledOrders: 100,
    totalRevenue: 50000,
    totalRefunds: 5000,
    averageDeliveryTime: 30,
    newUsers: 200,
    activeUsers: 800,
    topCity: 'New York',
    topRestaurantId: 'restaurant1',
    topRestaurantName: 'Top Restaurant',
    generatedAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(globalDocRef, '2025-10', globalReportData); // Note: monthId as subcollection name? Wait, path is reports/global/{monthId} as doc

  // Actually, {monthId} is document ID, subcollection is implicit. No, path: reports/global/{monthId} means doc 'global' then subcollection with name? Wait, looking back:
  // Path: reports/global/{monthId} (format: YYYY-MM) — this means 'global' is doc ID, {monthId} is doc ID in collection 'reports'? No.
  // Wait, it's reports/ (collection) then doc 'global', then subcollection implied as monthly or something? The doc says "Subcollection Path: reports/global/{monthId}"
  // I think the subcollection is under 'reports/global', and docs are {monthId}
  await globalDocRef.collection('monthly').doc('2025-10').set(globalReportData); // Assuming subcollection name 'monthly' — adjust if needed. The doc doesn't specify subcollection name, but path suggests no subcollection name, but Firestore paths are collection/doc/collection/doc.
  // To match path reports/global/{monthId}, it's collection 'reports', doc 'global', then subcollection '{monthId}'? No, {monthId} is doc ID.
  // Wait, probably the "subcollection" is the docs under 'reports', but it's mislabeled.
  // To simplify, I'll add as doc in 'reports' with ID 'global-2025-10', but to follow, I'll use doc 'global', then subcollection 'reports', doc '2025-10'

  // Let's assume for GLOBAL_REPORTS: collection 'reports', doc 'global', subcollection 'monthly_reports', doc '2025-10'
  const globalMonthlyRef = await addSubDocument(globalDocRef, 'monthly_reports', globalReportData);

  // DAILY_GLOBAL_REPORTS: Path: reports/global/daily/{date}
  const dailyGlobalData = {
    date: '2025-10-10',
    totalOrders: 50,
    completedOrders: 45,
    cancelledOrders: 5,
    totalRevenue: 2500,
    newUsers: 10,
    averageOrderValue: 50,
    peakHour: 18,
    generatedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(globalDocRef, 'daily', dailyGlobalData); // Assuming subcollection 'daily', doc ID '2025-10-10'

  // RESTAURANT_REPORTS: Path: reports/restaurants/{restaurantId}/monthly/{monthId}
  const restaurantReportParent = db.collection('reports').doc('restaurants');
  await restaurantReportParent.set({});
  const restaurantIdDoc = restaurantReportParent.collection('restaurant123').doc(); // Under {restaurantId} as subcollection? Path suggests reports/restaurants/{restaurantId}/monthly/{monthId}
  // So, collection 'reports', doc 'restaurants', subcollection {restaurantId}, doc 'monthly', subcollection {monthId}? No.
  // Path: reports/restaurants/{restaurantId}/monthly/{monthId} means collection 'reports', doc 'restaurants', subcollection {restaurantId}, doc 'monthly', subcollection {monthId} — it's chained.
  // To match, collection 'reports', doc 'restaurants', subcollection '{restaurantId}', doc 'monthly', subcollection '{monthId}' — but 'monthly' is doc? No.
  // Likely, subcollection 'restaurants' under 'reports', then doc '{restaurantId}', then subcollection 'monthly', doc '{monthId}'
  const reportsRef = db.collection('reports');
  const restaurantReportsRef = reportsRef.doc('restaurants'); // Dummy if needed
  await restaurantReportsRef.set({});
  const restaurantIdRef = restaurantReportsRef.collection('restaurants').doc('restaurant123'); // Misnaming, but to match path, perhaps collection 'reports', subcollection 'restaurants' isn't standard.
  // Standard way: the main collection is 'reports', then subcollection 'restaurants' under a dummy doc? But to make it work, I'll create a dummy doc in 'reports', but actually, for such structures, often it's flat, but to follow literal path, the path is reports/restaurants/{restaurantId}/monthly/{monthId}, so 'restaurants' is doc ID in 'reports', then subcollection '{restaurantId}', but that doesn't make sense.
  // Looking back: "RESTAURANT_REPORTS Subcollection Path: reports/restaurants/{restaurantId}/monthly/{monthId}"
  // This is a full path to the doc, so the structure is:
  // collection 'reports', doc 'restaurants', subcollection '{restaurantId}', doc 'monthly', subcollection '{monthId}', but 'monthly' is not.
  // Probably 'monthly' is subcollection under {restaurantId}.
  // Yes, doc path is reports/restaurants/{restaurantId}/monthly/{monthId}, so collection 'reports', doc 'restaurants', subcollection '{restaurantId}', doc 'monthly', subcollection '{monthId}' — but '{restaurantId}' is subcollection name? No, in Firestore, subcollection names are fixed, doc IDs are variable.
  // Firestore path is collection/doc/collection/doc...
  // So for path reports/restaurants/{restaurantId}/monthly/{monthId}, it means:
  // collection 'reports', doc 'restaurants', subcollection '{restaurantId}', doc 'monthly', subcollection '{monthId}' — but that can't be, because {restaurantId} would be subcollection name, which is variable, but subcollection names are fixed.
  // This is a common mistake in documentation. Likely, the intent is collection 'reports', subcollection 'restaurants', doc '{restaurantId}', subcollection 'monthly', doc '{monthId}'.
  // Yes, that makes sense, the path is reports/{docId?} but the doc skips the dummy doc, but to fix, many designs use collection 'restaurant_reports', but to seed, I'll use collection 'reports', subcollection 'restaurant_reports', doc 'restaurant123', subcollection 'monthly', doc '2025-10'.

  // Create restaurant report document
  const restaurantReportRef = db.collection('restaurant_reports').doc('restaurant123');
  await restaurantReportRef.set({
    restaurantId: 'restaurant123',
    restaurantName: 'Sample Restaurant',
    createdAt: admin.firestore.Timestamp.now()
  });
  
  // Add monthly report subcollection
  const monthlyRestaurantData = {
    monthId: '2025-10',
    restaurantId: 'restaurant123',
    restaurantName: 'Sample Restaurant',
    totalOrders: 200,
    completedOrders: 180,
    cancelledOrders: 20,
    totalRevenue: 10000,
    averageOrderValue: 50,
    averagePreparationTime: 15,
    averageRating: 4.5,
    totalRatings: 100,
    topItems: [{ name: 'Pizza', count: 50 }, { name: 'Burger', count: 30 }],
    generatedAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await restaurantReportRef.collection('monthly').doc('2025-10').set(monthlyRestaurantData);

  // Add daily restaurant report
  const dailyRestaurantData = {
    date: '2025-10-10',
    restaurantId: 'restaurant123',
    totalOrders: 10,
    completedOrders: 9,
    cancelledOrders: 1,
    totalRevenue: 500,
    peakHour: 12,
    generatedAt: admin.firestore.Timestamp.now()
  };
  await restaurantReportRef.collection('daily').doc('2025-10-10').set(dailyRestaurantData);

  // DELIVERY_PARTNER_REPORTS
  const deliveryPartnerReportRef = db.collection('delivery_partner_reports').doc('partner123');
  await deliveryPartnerReportRef.set({
    partnerId: 'partner123',
    partnerName: 'Sample Partner',
    createdAt: admin.firestore.Timestamp.now()
  });

  // Add monthly delivery partner report
  const monthlyPartnerData = {
    monthId: '2025-10',
    partnerId: 'partner123',
    partnerName: 'Sample Partner',
    totalDeliveries: 150,
    completedDeliveries: 140,
    cancelledDeliveries: 10,
    totalEarnings: 7500,
    averageRating: 4.8,
    averageDeliveryTime: 25,
    totalDistanceCovered: 300,
    onTimePercentage: 95,
    generatedAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await deliveryPartnerReportRef.collection('monthly').doc('2025-10').set(monthlyPartnerData);

  // Add daily delivery partner report
  const dailyPartnerData = {
    date: '2025-10-10',
    partnerId: 'partner123',
    totalDeliveries: 15,
    completedDeliveries: 14,
    totalEarnings: 750,
    totalDistance: 30,
    averageDeliveryTime: 25,
    generatedAt: admin.firestore.Timestamp.now()
  };
  await deliveryPartnerReportRef.collection('daily').doc('2025-10-10').set(dailyPartnerData);
}

async function seedUsers() {
  const userData = {
    userId: 'user123',
    email: 'user@example.com',
    phone: '1234567890',
    displayName: 'John Doe',
    profilePhotoURL: 'https://storage.example.com/profile.jpg',
    role: 'customer',
    status: 'active',
    preferences: {
      cuisines: ['Italian', 'Chinese'],
      foodTypes: ['Veg', 'Non-Veg'],
      notifications: {
        orderUpdates: true,
        promotions: true,
        offers: true
      }
    },
    loyaltyPoints: 100,
    totalOrders: 10,
    joinedAt: admin.firestore.Timestamp.now()
  };
  const userRef = await addDocument('users', userData);

  // NOTIFICATIONS Subcollection
  const notificationData = {
    notificationId: 'notif123',
    title: 'Order Confirmed',
    message: 'Your order has been confirmed.',
    type: 'order',
    relatedOrderId: 'order123',
    imageURL: 'https://storage.example.com/image.jpg',
    isRead: false,
    createdAt: admin.firestore.Timestamp.now(),
    actionURL: 'app://order/123'
  };
  await addSubDocument(userRef, 'notifications', notificationData);

  // ADDRESSES Subcollection
  const addressData = {
    addressId: 'addr123',
    label: 'home',
    line1: '123 Main St',
    line2: 'Apt 4',
    city: 'New York',
    state: 'NY',
    pincode: '10001',
    geoPoint: geoPoint(40.7128, -74.0060),
    cityId: 'city123',
    contactName: 'John Doe',
    contactPhone: '1234567890',
    isDefault: true,
    isActive: true
  };
  await addSubDocument(userRef, 'addresses', addressData);

  // CART Subcollection
  const cartData = {
    cartId: 'cart123',
    restaurantId: 'restaurant123',
    warehouseId: 'warehouse123',
    status: 'active',
    totalAmount: 100,
    itemCount: 2,
    addedAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    deliveryType: 'delivery',
    appliedCoupon: {
      couponId: 'coupon123',
      discountAmount: 10
    },
    serviceId: 'service123'
  };
  const cartRef = await addSubDocument(userRef, 'cart', cartData);

  // CART_ITEMS Subcollection
  const cartItemData = {
    itemId: 'item123',
    menuItemId: 'menu123',
    productId: 'product123',
    name: 'Pizza',
    price: 10,
    quantity: 2,
    totalPrice: 20,
    customizations: [{ name: 'Extra Cheese', price: 2 }],
    notes: 'No onions',
    addedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(cartRef, 'cart_items', cartItemData);

  // WISHLIST Subcollection
  const wishlistData = {
    wishlistId: 'wish123',
    type: 'restaurant',
    restaurantId: 'restaurant123',
    warehouseId: 'warehouse123',
    itemId: 'item123',
    addedAt: admin.firestore.Timestamp.now(),
    serviceId: 'service123',
    price: 10
  };
  await addSubDocument(userRef, 'wishlist', wishlistData);

  // SESSIONS Subcollection
  const sessionData = {
    sessionId: 'sess123',
    deviceId: 'device123',
    platform: 'ios',
    fcmToken: 'token123',
    ipAddress: '192.168.1.1',
    lastSeenAt: admin.firestore.Timestamp.now(),
    isActive: true,
    createdAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(userRef, 'sessions', sessionData);

  // COUPON_USAGE Subcollection
  const couponUsageData = {
    usageId: 'usage123',
    couponId: 'coupon123',
    orderId: 'order123',
    discountApplied: 10,
    usedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(userRef, 'coupon_usage', couponUsageData);
}

async function seedRestaurants() {
  const restaurantData = {
    restaurantId: 'restaurant123',
    name: 'Sample Restaurant',
    ownerId: 'user123',
    logoURL: 'https://storage.example.com/logo.jpg',
    bannerURL: 'https://storage.example.com/banner.jpg',
    galleryURLs: ['https://storage.example.com/gallery1.jpg'],
    description: 'Great food',
    address: {
      line1: '456 Food St',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      geoPoint: geoPoint(40.7128, -74.0060)
    },
    cityId: 'city123',
    phone: '9876543210',
    email: 'restaurant@example.com',
    cuisines: ['Italian', 'Mediterranean'],
    avgRating: 4.5,
    totalRatings: 100,
    priceRange: '₹₹',
    openHours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '09:00', close: '21:00' }
    },
    deliveryCharges: 5,
    freeDeliveryAbove: 50,
    minOrderAmount: 20,
    maxDeliveryRadius: 10,
    avgDeliveryTime: '25-35 mins',
    isActive: true,
    isPromoted: false,
    isPureVeg: true,
    hasOnlinePayment: true,
    hasCashOnDelivery: true,
    orderCount: 200,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    serviceId: 'service123'
  };
  const restaurantRef = db.collection('restaurants').doc(restaurantData.restaurantId);
  await restaurantRef.set(restaurantData);
  console.log(`Added document to restaurants with ID: ${restaurantRef.id}`);

  // MENU_ITEMS Subcollection
  const menuItemData = {
    menuItemId: 'menu123',
    name: 'Pizza',
    description: 'Delicious pizza',
    mainImageURL: 'https://storage.example.com/pizza.jpg',
    galleryURLs: ['https://storage.example.com/pizza_gallery.jpg'],
    price: 10,
    discountedPrice: 8,
    category: 'Main',
    subCategory: 'Italian',
    cuisine: 'Italian',
    foodType: 'salads',
    isVeg: true,
    isAvailable: true,
    prepTime: '15-20 mins',
    spiceLevel: 'Mild',
    portionSize: 'Large',
    tags: ['Cheesy', 'Hot'],
    nutritionalInfo: {
      calories: 300,
      protein: '10g',
      carbs: '40g',
      fat: '15g',
      fiber: '5g'
    },
    allergens: ['Gluten', 'Dairy'],
    ingredients: ['ingredient123'],
    customizationOptions: [{ name: 'Toppings', options: [{ name: 'Cheese', price: 2 }] }],
    status: 'active',
    orderCount: 50,
    rating: 4.7,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    serviceId: 'service123'
  };
  await addSubDocument(restaurantRef, 'menu_items', menuItemData);

  // INVENTORY Subcollection
  const inventoryData = {
    inventoryId: 'inv123',
    ingredientId: 'ingredient123',
    name: 'Flour',
    currentStock: 100,
    unit: 'kg',
    reorderLevel: 20,
    maxStockLevel: 200,
    costPerUnit: 1,
    supplierId: 'supplier123',
    category: 'grains',
    expiryDate: admin.firestore.Timestamp.fromDate(new Date('2026-01-01')),
    batchNumber: 'batch123',
    lastRestocked: admin.firestore.Timestamp.now(),
    status: 'active',
    totalCost: 100
  };
  const inventoryRef = await addSubDocument(restaurantRef, 'inventory', inventoryData);

  // MOVEMENTS Subcollection under Inventory
  const movementData = {
    movementId: 'move123',
    type: 'addition',
    quantity: 50,
    unit: 'kg',
    reason: 'Restock',
    doneBy: 'chef123',
    createdAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(inventoryRef, 'movements', movementData);

  // CHEFS Subcollection
  const chefData = {
    chefId: 'chef123',
    name: 'Chef John',
    age: 35,
    gender: 'male',
    experience: '10 years',
    availability: 'active',
    photoURL: 'https://storage.example.com/chef.jpg',
    rating: 4.9,
    contact: 'chef@example.com',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(restaurantRef, 'chefs', chefData);

  // NOTIFICATIONS Subcollection
  const restaurantNotifData = {
    notificationId: 'notif456',
    title: 'New Order',
    message: 'You have a new order.',
    type: 'order',
    relatedOrderId: 'order123',
    isRead: false,
    createdAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(restaurantRef, 'notifications', restaurantNotifData);

  // REVIEWS Subcollection
  const reviewData = {
    reviewId: 'review123',
    userId: 'user123',
    orderId: 'order123',
    rating: 5,
    comment: 'Great food!',
    imageURLs: ['https://storage.example.com/review.jpg'],
    isVerified: true,
    helpfulCount: 10,
    createdAt: admin.firestore.Timestamp.now(),
    restaurantReply: {
      message: 'Thank you!',
      repliedAt: admin.firestore.Timestamp.now()
    }
  };
  await addSubDocument(restaurantRef, 'reviews', reviewData);
}

async function seedWarehouses() {
  const warehouseData = {
    warehouseId: 'warehouse123',
    name: 'Sample Warehouse',
    ownerId: 'user123',
    address: {
      line1: '789 Storage St',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      geoPoint: geoPoint(40.7128, -74.0060)
    },
    cityId: 'city123',
    phone: '5555555555',
    email: 'warehouse@example.com',
    avgRating: 4.2,
    totalRatings: 50,
    openHours: {
      monday: { open: '08:00', close: '20:00' },
      // ... similar for other days
    },
    deliveryCharges: 3,
    freeDeliveryAbove: 30,
    minOrderAmount: 10,
    maxDeliveryRadius: 5,
    avgDeliveryTime: '15-25 mins',
    isActive: true,
    orderCount: 100,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  const warehouseRef = await addDocument('warehouses', warehouseData);

  // PRODUCTS Subcollection
  const productData = {
    productId: 'product123',
    name: 'Grocery Item',
    description: 'Fresh groceries',
    price: 5,
    discountedPrice: 4,
    category: 'Groceries',
    isAvailable: true,
    tags: ['Fresh', 'Organic'],
    imageURL: 'https://storage.example.com/product.jpg',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(warehouseRef, 'products', productData);

  // INVENTORY Subcollection
  const warehouseInventoryData = {
    inventoryId: 'inventory123',
    warehouseId: 'warehouse123',
    items: [
      {
        itemId: 'item123',
        name: 'Fresh Vegetables',
        category: 'Produce',
        quantity: 100,
        unit: 'kg',
        lastRestocked: admin.firestore.Timestamp.now(),
        expiryDate: admin.firestore.Timestamp.fromDate(new Date('2025-12-31')),
        status: 'in_stock',
        minStockLevel: 20,
        maxStockLevel: 200,
        supplier: 'Local Farm',
        costPerUnit: 2.5,
        sellingPrice: 3.5,
        barcode: '123456789012',
        location: 'Aisle 3, Shelf 2',
        notes: 'Organic vegetables',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      }
    ],
    totalItems: 1,
    lowStockItems: 0,
    outOfStockItems: 0,
    lastUpdated: admin.firestore.Timestamp.now()
  };
  await addSubDocument(warehouseRef, 'inventory', warehouseInventoryData);

  // REVIEWS Subcollection
  const warehouseReviewData = {
    reviewId: 'review456',
    userId: 'user123',
    orderId: 'order123',
    rating: 4,
    comment: 'Good service',
    imageURLs: ['https://storage.example.com/review2.jpg'],
    isVerified: true,
    helpfulCount: 5,
    createdAt: admin.firestore.Timestamp.now(),
    warehouseReply: {
      message: 'Thanks!',
      repliedAt: admin.firestore.Timestamp.now()
    }
  };
  await addSubDocument(warehouseRef, 'reviews', warehouseReviewData);
}

async function seedOrders() {
  const orderData = {
    orderId: 'order123',
    userId: 'user123',
    restaurantId: 'restaurant123',
    warehouseId: 'warehouse123',
    deliveryPartnerId: 'partner123',
    type: 'restaurant',
    deliveryType: 'delivery',
    status: 'pending',
    totalAmount: 100,
    discount: 10,
    deliveryCharges: 5,
    taxes: 5,
    finalAmount: 100,
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    deliveryAddress: {
      addressId: 'addr123',
      line1: '123 Main St',
      line2: 'Apt 4',
      city: 'New York',
      pincode: '10001',
      geoPoint: geoPoint(40.7128, -74.0060),
      contactName: 'John Doe',
      contactPhone: '1234567890',
      saveForFuture: true
    },
    estimatedDeliveryTime: '30 mins',
    actualDeliveryTime: '25 mins',
    instructions: 'Leave at door',
    appliedCoupons: [{ couponId: 'coupon123', discountAmount: 10 }],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    scheduledFor: admin.firestore.Timestamp.fromDate(new Date('2025-10-11')),
    cancellationReason: 'None',
    refundAmount: 0
  };
  const orderRef = await addDocument('orders', orderData);

  // ORDER_ITEMS Subcollection
  const orderItemData = {
    itemId: 'item456',
    name: 'Pizza',
    quantity: 1,
    unitPrice: 10,
    totalPrice: 10,
    type: 'menu_item',
    category: 'Main',
    cuisine: 'Italian',
    foodType: 'Veg',
    customizations: [{ name: 'Extra Cheese', price: 2 }],
    links: {
      menuItemId: 'menu123',
      productId: 'product123',
      restaurantId: 'restaurant123',
      warehouseId: 'warehouse123'
    },
    chefId: 'chef123',
    prepTime: '15 mins',
    status: 'pending'
  };
  await addSubDocument(orderRef, 'order_items', orderItemData);

  // STATUS_HISTORY Subcollection
  const statusHistoryData = {
    statusId: 'status123',
    status: 'pending',
    updatedBy: 'system',
    timestamp: admin.firestore.Timestamp.now(),
    remarks: 'Order placed',
    location: geoPoint(40.7128, -74.0060),
    estimatedTime: '30 mins'
  };
  await addSubDocument(orderRef, 'status_history', statusHistoryData);

  // PAYMENT Subcollection
  const paymentData = {
    transactionId: 'trans123',
    amount: 100,
    status: 'success',
    method: 'UPI',
    provider: 'Google Pay',
    gatewayTransactionId: 'gate123',
    timestamp: admin.firestore.Timestamp.now(),
    failureReason: '',
    refundTransactionId: ''
  };
  await addSubDocument(orderRef, 'payment', paymentData);
}

async function seedPromotions() {
  const promotionData = {
    promotionId: 'promo123',
    title: 'Big Sale',
    description: '20% off',
    bannerImageURL: 'https://storage.example.com/banner.jpg',
    type: 'percentage',
    discountValue: 20,
    minOrderAmount: 50,
    maxDiscountAmount: 100,
    targetAudience: {
      userType: 'all',
      cities: ['city123'],
      restaurants: ['restaurant123'],
      warehouses: ['warehouse123']
    },
    validFrom: admin.firestore.Timestamp.now(),
    validTill: admin.firestore.Timestamp.fromDate(new Date('2025-12-31')),
    usageLimit: {
      totalUsage: 1000,
      usedCount: 0,
      perUserLimit: 1
    },
    isActive: true,
    priority: 1,
    termsAndConditions: 'Terms apply',
    createdBy: 'user123',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await addDocument('promotions', promotionData);
}

async function seedCoupons() {
  const couponData = {
    couponId: 'coupon123',
    code: 'SAVE20',
    title: 'Save 20%',
    description: '20% off on orders',
    imageURL: 'https://storage.example.com/coupon.jpg',
    type: 'percentage',
    discountValue: 20,
    minOrderAmount: 50,
    maxDiscountAmount: 100,
    usageLimit: {
      totalUsage: 500,
      usedCount: 0,
      perUserLimit: 1
    },
    applicableFor: {
      userType: 'all',
      cities: ['city123'],
      restaurants: ['restaurant123'],
      warehouses: ['warehouse123'],
      categories: ['Food'],
      minOrderCount: 1,
      dayOfWeek: ['Monday', 'Tuesday']
    },
    validFrom: admin.firestore.Timestamp.now(),
    validTill: admin.firestore.Timestamp.fromDate(new Date('2025-12-31')),
    isActive: true,
    isStackable: false,
    termsAndConditions: 'Terms apply',
    createdBy: 'user123',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await addDocument('coupons', couponData);
}

async function seedCities() {
  const cityData = {
    cityId: 'city123',
    name: 'New York',
    state: 'NY',
    country: 'USA',
    coordinates: geoPoint(40.7128, -74.0060),
    timezone: 'America/New_York',
    isServiceable: true,
    deliveryZones: [{ name: 'Zone1', pincodes: ['10001'], deliveryFee: 5, freeDeliveryAbove: 50 }],
    popularAreas: ['Manhattan', 'Brooklyn'],
    currency: 'USD',
    taxRate: 8.875,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    status: 'active',
    isActive: true
  };
  await addDocument('cities', cityData);
}

async function seedDeliveryPartners() {
  const partnerData = {
    partnerId: 'partner123',
    userId: 'user123',
    name: 'Delivery John',
    phone: '1111111111',
    email: 'partner@example.com',
    profilePhotoURL: 'https://storage.example.com/partner.jpg',
    vehicleType: 'bike',
    vehicleNumber: 'ABC123',
    licenseNumber: 'LIC123',
    licenseImageURL: 'https://storage.example.com/license.jpg',
    aadharNumber: 'AAD123',
    aadharImageURL: 'https://storage.example.com/aadhar.jpg',
    bankDetails: {
      accountNumber: '123456789',
      ifscCode: 'IFSC123',
      accountHolderName: 'John Doe'
    },
    currentLocation: {
      lat: 40.7128,
      lng: -74.0060,
      lastUpdated: admin.firestore.Timestamp.now()
    },
    status: 'online',
    rating: 4.8,
    totalRatings: 50,
    totalDeliveries: 100,
    cityId: 'city123',
    serviceAreas: ['Manhattan'],
    isVerified: true,
    kycVerified: true,
    isAvailable: true,
    joinedAt: admin.firestore.Timestamp.now(),
    lastActive: admin.firestore.Timestamp.now(),
    earnings: {
      totalEarned: 5000,
      thisMonth: 1000,
      pendingAmount: 200
    }
  };
  const partnerRef = await addDocument('delivery_partners', partnerData);

  // NOTIFICATIONS Subcollection
  const partnerNotifData = {
    notificationId: 'notif789',
    title: 'New Delivery',
    message: 'New delivery assigned.',
    type: 'order',
    createdAt: admin.firestore.Timestamp.now(),
    isRead: false
  };
  await addSubDocument(partnerRef, 'notifications', partnerNotifData);

  // DELIVERY_HISTORY Subcollection
  const deliveryHistoryData = {
    historyId: 'hist123',
    deliveryId: 'del123',
    orderId: 'order123',
    status: 'delivered',
    earnedAmount: 50,
    deliveredAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(partnerRef, 'delivery_history', deliveryHistoryData);

  // Add more sample delivery history entries
  const deliveryHistoryEntries = [
    {
      deliveryId: 'del124',
      orderId: 'order124',
      status: 'delivered',
      earnedAmount: 45,
      deliveredAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-09T14:30:00'))
    },
    {
      deliveryId: 'del125',
      orderId: 'order125',
      status: 'cancelled',
      earnedAmount: 0,
      cancelledAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-08T12:15:00'))
    },
    {
      deliveryId: 'del126',
      orderId: 'order126',
      status: 'picked_up',
      earnedAmount: 30,
      pickedUpAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-10T10:45:00'))
    }
  ];

  for (const history of deliveryHistoryEntries) {
    await addSubDocument(partnerRef, 'delivery_history', {
      ...history,
      historyId: admin.firestore().collection('temp').doc().id // Generate a unique ID
    });
  }

  // KYC_DOCS Subcollection
  const kycDocData = {
    docId: 'doc123',
    docType: 'aadhar',
    fileURL: 'https://storage.example.com/aadhar.jpg',
    isVerified: true,
    uploadedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(partnerRef, 'kyc_docs', kycDocData);

  // PAYOUTS Subcollection
  const payoutData = {
    payoutId: 'payout123',
    amount: 1000,
    periodStart: admin.firestore.Timestamp.fromDate(new Date('2025-10-01')),
    periodEnd: admin.firestore.Timestamp.fromDate(new Date('2025-10-31')),
    status: 'processed',
    processedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(partnerRef, 'payouts', payoutData);
}

async function seedPayments() {
  const paymentData = {
    paymentId: 'pay123',
    orderId: 'order123',
    userId: 'user123',
    amount: 100,
    method: 'UPI',
    provider: 'Google Pay',
    status: 'success',
    txnscreenshot: 'https://storage.example.com/txnscreenshot.jpg',
    gatewayTransactionId: 'gate456',
    gatewayResponse: {
      code: '200',
      message: 'Success'
    },
    timestamp: admin.firestore.Timestamp.now(),
    fees: {
      gatewayFee: 2,
      platformFee: 1
    }
  };
  const paymentRef = await addDocument('payments', paymentData);

  // REFUNDS Subcollection
  const refundData = {
    refundId: 'ref123',
    refundReason: 'Product not as expected',
    amount: 50,
    status: 'processed',
    initiatedAt: admin.firestore.Timestamp.now(),
    processedAt: admin.firestore.Timestamp.now(),
    gatewayReference: 'gateRef123'
  };
  await addSubDocument(paymentRef, 'refunds', refundData);

  // RECEIPTS Subcollection
  const receiptData = {
    receiptId: 'rec123',
    fileURL: 'https://storage.example.com/receipt.pdf',
    generatedAt: admin.firestore.Timestamp.now()
  };
  await addSubDocument(paymentRef, 'receipts', receiptData);
}

async function seedDeliveries() {
  const deliveryData = {
    deliveryId: 'del123',
    orderId: 'order123',
    userId: 'user123',
    restaurantId: 'restaurant123',
    warehouseId: 'warehouse123',
    deliveryPartnerId: 'partner123',
    status: 'assigned',
    pickupLocation: geoPoint(40.7128, -74.0060),
    dropLocation: geoPoint(40.7138, -74.0070),
    deliveredAt: admin.firestore.Timestamp.now(),
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await addDocument('deliveries', deliveryData);
}

async function seedSupportTickets() {
  const ticketData = {
    ticketId: 'tick123',
    userId: 'user123',
    deliveryPartnerId: 'partner123',
    orderId: 'order123',
    category: 'order_issue',
    priority: 'high',
    status: 'open',
    title: 'Order Delayed',
    description: 'My order is delayed.',
    attachmentURLs: ['https://storage.example.com/attach.jpg'],
    assignedTo: 'admin123',
    resolution: '',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    resolvedAt: null
  };
  const ticketRef = await addDocument('support_tickets', ticketData);

  // TICKET_MESSAGES Subcollection
  const messageData = {
    messageId: 'msg123',
    senderId: 'user123',
    senderType: 'user',
    message: 'Hello, my order is late.',
    attachmentURLs: [],
    timestamp: admin.firestore.Timestamp.now(),
    isRead: false
  };
  await addSubDocument(ticketRef, 'messages', messageData);
}

async function seedChats() {
  const chatData = {
    chatId: 'chat123',
    participants: ['user123', 'partner123'],
    relatedOrderId: 'order123',
    serviceType: 'order',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  const chatRef = await addDocument('chats', chatData);

  // MESSAGES Subcollection
  const chatMessageData = {
    messageId: 'cmsg123',
    senderId: 'user123',
    type: 'text',
    content: 'Where is my order?',
    contentURL: '',
    timestamp: admin.firestore.Timestamp.now(),
    readBy: ['partner123'],
    attachments: []
  };
  await addSubDocument(chatRef, 'messages', chatMessageData);
}

async function seedIngredients() {
  const ingredientData = {
    ingredientId: 'ingredient123',
    name: 'Flour',
    category: 'grains',
    unit: 'kg',
    nutritionalInfo: {
      calories: 364,
      protein: '10g',
      carbs: '76g',
      fat: '1g',
      fiber: '3g'
    },
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await addDocument('ingredients', ingredientData);
}

async function seedAdminAlerts() {
  const alertData = {
    alertId: 'alert123',
    message: 'System alert: High load',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };
  await addDocument('admin_alerts', alertData);
}

async function seedServices() {
  const serviceData = {
    serviceId: 'service123',
    name: 'Delivery Service',
    description: 'Fast delivery'
  };
  await addDocument('services', serviceData);
}

// Run all seed functions
async function seedAll() {
  try {
    await seedReports();
    await seedUsers();
    await seedRestaurants();
    await seedWarehouses();
    await seedOrders();
    await seedPromotions();
    await seedCoupons();
    await seedCities();
    await seedDeliveryPartners();
    await seedPayments();
    await seedDeliveries();
    await seedSupportTickets();
    await seedChats();
    await seedIngredients();
    await seedAdminAlerts();
    await seedServices();
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seedAll();