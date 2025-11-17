import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { db } from '../config/firebase';

const CouponApplyTest = () => {
  const [couponCode, setCouponCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Applying coupon code:', couponCode.trim());
      
      // Validate the coupon code against the real coupons collection
      const querySnapshot = await db.collection('coupons')
        .where('code', '==', couponCode.trim())
        .where('isActive', '==', true)
        .get();

      console.log(`Found ${querySnapshot.size} matching coupons`);

      if (querySnapshot.empty) {
        setResult({ error: 'Invalid coupon code' });
        return;
      }

      // Get the first matching coupon
      const couponDoc = querySnapshot.docs[0];
      const couponData = couponDoc.data();
      
      console.log('Coupon data from Firestore:', couponDoc.id, couponData);
      
      setResult({ success: true, coupon: { id: couponDoc.id, ...couponData } });
    } catch (error) {
      console.error('Error applying coupon:', error);
      setResult({ error: 'Failed to apply coupon' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Coupon Apply Test</Text>
      <TextInput
        placeholder="Enter coupon code"
        value={couponCode}
        onChangeText={setCouponCode}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      <Button title="Apply Coupon" onPress={applyCoupon} disabled={loading || !couponCode.trim()} />
      {loading && <Text>Loading...</Text>}
      
      {result && (
        <View style={{ marginTop: 20 }}>
          {result.error ? (
            <Text style={{ color: 'red' }}>Error: {result.error}</Text>
          ) : (
            <View>
              <Text style={{ color: 'green' }}>Success!</Text>
              <Text>Coupon ID: {result.coupon.id}</Text>
              <Text>Code: {result.coupon.code}</Text>
              <Text>Name: {result.coupon.name || result.coupon.title}</Text>
              <Text>Discount: {result.coupon.discountValue || result.coupon.value} {result.coupon.discountType || result.coupon.type}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default CouponApplyTest;