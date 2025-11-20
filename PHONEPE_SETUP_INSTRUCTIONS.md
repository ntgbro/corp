# PhonePe Integration Setup Instructions

This document provides detailed instructions for setting up and troubleshooting the PhonePe payment integration in the CorpEase application.

## Prerequisites

1. Node.js (version 14 or higher)
2. A PhonePe merchant account (sandbox for testing)
3. Your development machine and mobile device on the same network

## Setup Steps

### 1. Configure Your Local IP Address

The PhonePe backend service needs to be accessible from your mobile device. You'll need to:

1. Find your computer's local IP address:
   - **Windows**: Open Command Prompt and run `ipconfig`
   - **Mac/Linux**: Open Terminal and run `ifconfig`

2. Update the IP address in [src/config/env.ts](file:///d:/corpease/src/config/env.ts):
   ```typescript
   // Replace '192.168.1.100' with your actual local IP address
   return '192.168.1.100'; // TODO: Replace with your actual local IP
   ```

### 2. Configure PhonePe Merchant Credentials

1. Log in to the PhonePe Sandbox Dashboard: https://mercury-uat.phonepe.com/
2. Obtain your:
   - Merchant ID
   - Secret Key (PHONEPE_SALT)
   - Salt Index (PHONEPE_SALT_INDEX)

3. Create a `.env` file in the project root with your credentials:
   ```env
   PHONEPE_MERCHANT_ID=your_actual_merchant_id
   PHONEPE_SALT=your_actual_secret_key
   PHONEPE_SALT_INDEX=your_actual_salt_index
   ```

### 3. Start the PhonePe Backend Service

In your terminal, run:
```bash
yarn phonepe-backend
```

This will start the backend service on port 3001.

### 4. Test the Backend Service

In another terminal, run:
```bash
yarn test-phonepe
```

This will verify that the backend service is working correctly.

### 5. Run the Mobile App

Start the React Native development server:
```bash
yarn start
```

Then run the app on your device:
```bash
yarn android
# or
yarn ios
```

## Troubleshooting Common Issues

### "Network Error" (Most Common)

This error occurs when the mobile app cannot reach the backend service. Check:

1. **IP Address Configuration**: Ensure the IP address in [src/config/env.ts](file:///d:/corpease/src/config/env.ts) matches your computer's actual local IP address.

2. **Same Network**: Make sure your mobile device and computer are on the same Wi-Fi network.

3. **Backend Service Running**: Verify that the PhonePe backend service is running:
   ```bash
   # You should see output like:
   # PhonePe Backend Service running on http://0.0.0.0:3001
   yarn phonepe-backend
   ```

4. **Firewall Settings**: Check that your firewall isn't blocking port 3001.

5. **Port Availability**: Ensure port 3001 isn't being used by another application.

### "KEY_NOT_CONFIGURED" Error

This error occurs when the PhonePe merchant credentials aren't properly configured:

1. Verify that your `.env` file contains the correct credentials.
2. Ensure these credentials match exactly with what's configured in the PhonePe dashboard.
3. Restart the backend service after updating credentials.

### Testing Connectivity

You can test if your mobile device can reach the backend service by:

1. Opening a web browser on your mobile device
2. Navigating to `http://YOUR_COMPUTER_IP:3001/health`
3. You should see a JSON response indicating the service is running

## Development Workflow

1. Update your IP address in [src/config/env.ts](file:///d:/corpease/src/config/env.ts)
2. Create/update your `.env` file with PhonePe credentials
3. Start the backend service: `yarn phonepe-backend`
4. Test the backend: `yarn test-phonepe`
5. Start the React Native packager: `yarn start`
6. Run the app on your device: `yarn android` or `yarn ios`

## Production Deployment

For production deployment:

1. Update the production URL in [src/config/environment.ts](file:///d:/corpease/src/config/environment.ts):
   ```typescript
   PHONEPE_BACKEND: {
     BASE_URL: __DEV__
       ? PHONEPE_BACKEND_URL // Development URL
       : 'https://your-production-domain.com', // Production URL
     TIMEOUT: 10000,
   }
   ```

2. Ensure your production backend is properly secured with HTTPS.

## Additional Resources

- [PhonePe Configuration Guide](file:///d:/corpease/PHONEPE_CONFIGURATION.md)
- [PhonePe Fix Instructions](file:///d:/corpease/PHONEPE_FIX_INSTRUCTIONS.md)
- PhonePe Developer Documentation: https://developer.phonepe.com/