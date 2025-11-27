import { collection, doc, getDocs, updateDoc, getFirestore } from '@react-native-firebase/firestore';

/**
 * Script to fix coupon data in existing carts
 * This script will clean up any carts that have incorrectly stored full coupon objects
 * instead of just the essential coupon information
 */

const fixCouponData = async () => {
  try {
    const db = getFirestore();
    
    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    console.log(`Found ${usersSnapshot.size} users`);
    
    let cartsProcessed = 0;
    let cartsFixed = 0;
    
    // Process each user
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      try {
        // Get all carts for this user
        const cartsSnapshot = await getDocs(collection(db, 'users', userId, 'cart'));
        
        // Process each cart
        for (const cartDoc of cartsSnapshot.docs) {
          cartsProcessed++;
          const cartData = cartDoc.data();
          
          // Check if cart has appliedCoupon with excessive data
          if (cartData.appliedCoupon && typeof cartData.appliedCoupon === 'object') {
            const couponKeys = Object.keys(cartData.appliedCoupon);
            
            // If the coupon has many fields (more than what we expect for a minimal coupon)
            if (couponKeys.length > 10) {
              console.log(`Fixing cart ${cartDoc.id} for user ${userId}`);
              console.log(`Coupon has ${couponKeys.length} fields:`, couponKeys);
              
              // Extract only the essential fields
              const fixedCoupon = {
                id: cartData.appliedCoupon.id || cartData.appliedCoupon.couponId || '',
                code: cartData.appliedCoupon.code || '',
                name: cartData.appliedCoupon.name || '',
                title: cartData.appliedCoupon.title || cartData.appliedCoupon.code || '',
                description: cartData.appliedCoupon.description || '',
                isStackable: cartData.appliedCoupon.isStackable || false,
                minOrderAmount: cartData.appliedCoupon.minOrderAmount || 0,
                minOrderCount: cartData.appliedCoupon.minOrderCount || 0,
                discountType: cartData.appliedCoupon.discountType || cartData.appliedCoupon.type || 'percentage',
                discountValue: cartData.appliedCoupon.discountValue !== undefined ? 
                              cartData.appliedCoupon.discountValue : 
                              (cartData.appliedCoupon.value || 0),
                maxDiscountAmount: cartData.appliedCoupon.maxDiscountAmount || undefined,
                appliedAt: cartData.appliedCoupon.appliedAt || new Date(),
                discountAmount: cartData.appliedCoupon.discountAmount || 0
              };
              
              // Update the cart with the fixed coupon data
              await updateDoc(doc(db, 'users', userId, 'cart', cartDoc.id), {
                appliedCoupon: fixedCoupon
              });
              
              cartsFixed++;
              console.log(`Fixed cart ${cartDoc.id}`);
            }
          }
        }
      } catch (userError) {
        console.error(`Error processing user ${userId}:`, userError);
      }
    }
    
    console.log(`Processed ${cartsProcessed} carts, fixed ${cartsFixed} carts`);
    
  } catch (error) {
    console.error('Error fixing coupon data:', error);
  }
};

// Run the fix function
if (require.main === module) {
  fixCouponData().then(() => {
    console.log('Coupon data fix completed');
  }).catch((error) => {
    console.error('Error running coupon data fix:', error);
  });
}

export default fixCouponData;