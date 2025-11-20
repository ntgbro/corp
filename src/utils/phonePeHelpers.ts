import axios from 'axios';
import { ENVIRONMENT } from '../config/environment';

/**
 * Check if the PhonePe backend service is reachable
 * @returns Promise<boolean> indicating if the service is reachable
 */
export const isPhonePeBackendReachable = async (): Promise<boolean> => {
  try {
    const backendUrl = ENVIRONMENT.PHONEPE_BACKEND.BASE_URL;
    console.log('Checking PhonePe backend connectivity to:', backendUrl);
    
    const response = await axios.get(`${backendUrl}/health`, {
      timeout: 5000 // 5 second timeout for health check
    });
    
    console.log('PhonePe backend health check response:', response.data);
    return response.status === 200 && response.data.status === 'OK';
  } catch (error: any) {
    console.error('PhonePe backend connectivity check failed:', error.message);
    return false;
  }
};

/**
 * Get detailed information about the PhonePe backend status
 * @returns Promise with status information
 */
export const getPhonePeBackendStatus = async () => {
  const backendUrl = ENVIRONMENT.PHONEPE_BACKEND.BASE_URL;
  
  try {
    // Try to reach the health endpoint
    const healthResponse = await axios.get(`${backendUrl}/health`, {
      timeout: 5000
    });
    
    return {
      reachable: true,
      url: backendUrl,
      health: healthResponse.data,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      reachable: false,
      url: backendUrl,
      error: error.message,
      code: error.code,
      status: error.response?.status,
      timestamp: new Date().toISOString()
    };
  }
};