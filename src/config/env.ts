// Environment configuration for React Native
// Note: React Native doesn't support dotenv directly, so we use hardcoded defaults
// In production, these should be configured through build processes or environment-specific builds

/**
 * Get the local IP address for development
 * For development, you need to:
 * 1. Find your computer's local IP address (run `ipconfig` on Windows or `ifconfig` on Mac/Linux)
 * 2. Replace '192.168.1.100' with your actual local IP address
 * 3. Make sure your mobile device is on the same network as your computer
 * 4. Ensure the PhonePe backend service is running on your computer (port 3001)
 */
const getLocalIPAddress = () => {
  // IMPORTANT: Replace this with your actual local IP address
  // Common local IP address formats: 192.168.x.x or 10.x.x.x
  return '10.187.163.91'; // Updated with your actual local IP from yarn find-local-ip
};

// Export environment variables with proper typing
export const PHONEPE_BACKEND_URL = __DEV__ 
  ? `http://${getLocalIPAddress()}:3001` 
  : 'https://phonepe-backend.corpease.com'; // Production URL

// Log the environment variables
console.log('Environment variables loaded:');
console.log('PHONEPE_BACKEND_URL:', PHONEPE_BACKEND_URL);
console.log('IMPORTANT: For development, ensure your local IP address is correctly set in src/config/env.ts');