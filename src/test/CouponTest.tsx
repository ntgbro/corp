import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { db } from '../config/firebase';

const CouponTest = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      console.log('Fetching coupons...');
      const querySnapshot = await db.collection('coupons').where('isActive', '==', true).get();
      
      console.log(`Found ${querySnapshot.size} coupons`);
      
      const couponList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Coupon data:', doc.id, data);
        return {
          id: doc.id,
          ...data
        };
      });
      
      setCoupons(couponList);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Coupon Test</Text>
      <Button title="Fetch Coupons" onPress={fetchCoupons} disabled={loading} />
      {loading && <Text>Loading...</Text>}
      <Text style={{ marginTop: 20 }}>Found {coupons.length} coupons:</Text>
      {coupons.map(coupon => (
        <View key={coupon.id} style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', marginVertical: 5 }}>
          <Text>Code: {coupon.code}</Text>
          <Text>Name: {coupon.name || coupon.title}</Text>
          <Text>Discount: {coupon.discountValue || coupon.value} {coupon.discountType || coupon.type}</Text>
          <Text>Active: {coupon.isActive ? 'Yes' : 'No'}</Text>
        </View>
      ))}
    </View>
  );
};

export default CouponTest;