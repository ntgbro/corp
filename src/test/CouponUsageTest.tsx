import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { addCouponUsage } from '../utils/userSubcollections';

const CouponUsageTest = () => {
  const [userId, setUserId] = useState('');
  const [couponId, setCouponId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const addUsage = async () => {
    if (!userId.trim() || !couponId.trim() || !orderId.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Adding coupon usage record...');
      
      await addCouponUsage(
        userId.trim(),
        couponId.trim(),
        orderId.trim(),
        parseFloat(discountAmount) || 0
      );
      
      setResult({ success: true, message: 'Coupon usage record added successfully' });
    } catch (error) {
      console.error('Error adding coupon usage:', error);
      setResult({ error: 'Failed to add coupon usage record' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Coupon Usage Test</Text>
      
      <TextInput
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      
      <TextInput
        placeholder="Coupon ID"
        value={couponId}
        onChangeText={setCouponId}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      
      <TextInput
        placeholder="Order ID"
        value={orderId}
        onChangeText={setOrderId}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      
      <TextInput
        placeholder="Discount Amount"
        value={discountAmount}
        onChangeText={setDiscountAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      
      <Button title="Add Coupon Usage" onPress={addUsage} disabled={loading || !userId.trim() || !couponId.trim() || !orderId.trim()} />
      {loading && <Text>Loading...</Text>}
      
      {result && (
        <View style={{ marginTop: 20 }}>
          {result.error ? (
            <Text style={{ color: 'red' }}>Error: {result.error}</Text>
          ) : (
            <Text style={{ color: 'green' }}>Success: {result.message}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default CouponUsageTest;