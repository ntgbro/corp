const axios = require('axios');

// Test the PhonePe backend service
const testPhonePeBackend = async () => {
  try {
    console.log('Testing PhonePe Backend Service...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('Health check response:', healthResponse.data);
    
    // Test payment request generation
    const paymentResponse = await axios.post('http://localhost:3001/generate-payment-request', {
      amount: 100,
      orderId: 'TEST_ORDER_123',
      customerId: 'TEST_CUSTOMER_456',
      redirectUrl: 'http://localhost:3000/payment/callback',
      callbackUrl: 'http://localhost:3001/payment/callback'
    });
    
    console.log('Payment request response:', paymentResponse.data);
    
    if (paymentResponse.data.success) {
      console.log('✅ PhonePe Backend Service is working correctly!');
      console.log('Merchant ID:', paymentResponse.data.data.merchantId);
      console.log('Request ID:', paymentResponse.data.data.requestId);
      console.log('Payload length:', paymentResponse.data.data.payload.length);
      console.log('Checksum:', paymentResponse.data.data.checksum);
    } else {
      console.log('❌ PhonePe Backend Service returned an error:', paymentResponse.data.message);
    }
  } catch (error) {
    console.error('❌ Error testing PhonePe Backend Service:', error.message);
    console.error('Error details:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received. Check if the backend service is running.');
    }
  }
};

// Run the test
testPhonePeBackend();