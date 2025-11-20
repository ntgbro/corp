import axios from 'axios';
import { Platform } from 'react-native';
import { ENVIRONMENT } from '../../config/environment';
import { isPhonePeBackendReachable } from '../../utils/phonePeHelpers';

// Use the PhonePe backend URL from environment configuration
const BACKEND_URL = ENVIRONMENT.PHONEPE_BACKEND.BASE_URL;

// Generate payment request through backend service
export const generatePaymentRequest = async (
  amount: number,
  orderId: string,
  customerId: string,
  redirectUrl?: string,
  callbackUrl?: string
) => {
  try {
    console.log('Generating payment request for order:', orderId);
    console.log('Backend URL:', BACKEND_URL);
    
    // Check if backend is reachable before making the request
    const isReachable = await isPhonePeBackendReachable();
    if (!isReachable) {
      throw new Error('PhonePe backend service is not reachable. Please ensure the backend service is running and accessible.');
    }
    
    // Add better error handling and timeout configuration
    const response = await axios.post(`${BACKEND_URL}/generate-payment-request`, {
      amount,
      orderId,
      customerId,
      redirectUrl,
      callbackUrl
    }, {
      timeout: ENVIRONMENT.PHONEPE_BACKEND.TIMEOUT,
      // Add validation for the URL to ensure it's properly formatted
      validateStatus: (status) => status < 500 // Allow 4xx errors to be handled in the catch block
    });

    console.log('Payment request response:', response.data);
    
    if (response.data.success) {
      console.log('Payment request generated successfully');
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to generate payment request');
    }
  } catch (error: any) {
    console.error('Error generating payment request:', error.message);
    console.error('Error details:', {
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: `${BACKEND_URL}/generate-payment-request`
    });
    
    // Provide more specific error messages based on the error type
    if (error.code === 'ECONNABORTED') {
      throw new Error('Connection timeout - please check if the PhonePe backend service is running');
    } else if (error.code === 'ENOTFOUND' || error.code === 'EHOSTUNREACH') {
      throw new Error('Unable to reach the PhonePe backend service - please check the network connection and backend URL');
    } else if (error.response?.status >= 500) {
      throw new Error('PhonePe backend service error - please check the backend logs');
    } else {
      throw new Error(`Payment request failed: ${error.message}`);
    }
  }
};

// Initiate PhonePe payment
export const initiatePhonePePayment = async (
  amount: number,
  orderId: string,
  customerId: string
) => {
  try {
    // Generate the payment request
    const paymentData = await generatePaymentRequest(
      amount,
      orderId,
      customerId,
      `${BACKEND_URL}/payment/callback`, // redirect URL
      `${BACKEND_URL}/payment/callback`  // callback URL
    );

    // Return the payment data to be used by the frontend
    return paymentData;
  } catch (error) {
    console.error('Error initiating PhonePe payment:', error);
    throw error;
  }
};