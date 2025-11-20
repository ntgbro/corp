# PhonePe Network Error Fix

This document explains the changes made to fix the "Network Error" issue in the PhonePe payment integration.

## Problem Summary

The error occurred because the mobile app could not establish a network connection to the PhonePe backend service. The error logs showed:

```
Error generating payment request: Network Error
Error initiating PhonePe payment: AxiosError: Network Error
```

## Root Causes Identified

1. Incorrect or unreachable backend URL configuration
2. Backend service not running or not accessible from the mobile device
3. Insufficient error handling and diagnostic information

## Changes Made

### 1. Enhanced Error Handling in PhonePe Service ([src/services/firebase/phonePeService.ts](file:///D:/corpease/src/services/firebase/phonePeService.ts))

- Added detailed error logging with error codes and response data
- Implemented specific error messages for different network issues:
  - Connection timeout
  - Host unreachable
  - Backend service errors
- Added connectivity check before making payment requests

### 2. Created Utility Functions for Backend Connectivity ([src/utils/phonePeHelpers.ts](file:///D:/corpease/src/utils/phonePeHelpers.ts))

- `isPhonePeBackendReachable()`: Checks if the backend service is accessible
- `getPhonePeBackendStatus()`: Provides detailed status information about the backend

### 3. Improved Environment Configuration ([src/config/env.ts](file:///D:/corpease/src/config/env.ts))

- Added clear instructions on how to find and set the local IP address
- Made the configuration more explicit with TODO comments
- Added logging to remind developers to check their IP configuration

### 4. Created Comprehensive Setup Instructions ([PHONEPE_SETUP_INSTRUCTIONS.md](file:///D:/corpease/PHONEPE_SETUP_INSTRUCTIONS.md))

- Detailed step-by-step setup guide
- Troubleshooting section for common issues
- Clear workflow instructions for development

### 5. Added IP Address Discovery Script ([src/scripts/find-local-ip.js](file:///D:/corpease/src/scripts/find-local-ip.js))

- Automated script to find the local IP address
- Added to package.json as `yarn find-local-ip`

## How to Fix the Network Error

### Step 1: Find Your Local IP Address

Run the following command to find your computer's local IP address:

```bash
yarn find-local-ip
```

### Step 2: Update the Environment Configuration

Edit [src/config/env.ts](file:///D:/corpease/src/config/env.ts) and replace `'192.168.1.100'` with your actual local IP address:

```typescript
return 'YOUR_ACTUAL_LOCAL_IP'; // e.g., '192.168.1.25'
```

### Step 3: Start the PhonePe Backend Service

Make sure the PhonePe backend service is running:

```bash
yarn phonepe-backend
```

You should see output similar to:
```
PhonePe Backend Service running on http://0.0.0.0:3001
```

### Step 4: Test the Backend Connectivity

Verify the backend is accessible:

```bash
yarn test-phonepe
```

### Step 5: Run the Mobile App

Start the React Native development server and run the app:

```bash
yarn start
# In another terminal:
yarn android
```

## Additional Troubleshooting Tips

1. **Ensure Same Network**: Both your computer and mobile device must be on the same Wi-Fi network.

2. **Check Firewall Settings**: Make sure your firewall isn't blocking port 3001.

3. **Verify Port Availability**: Ensure no other application is using port 3001.

4. **Test Manual Connectivity**: From your mobile device's browser, try accessing:
   `http://YOUR_COMPUTER_IP:3001/health`

5. **Restart Everything**: If issues persist, restart:
   - The PhonePe backend service
   - The React Native packager
   - The mobile app

## Future Improvements

1. Implement automatic IP detection in the app
2. Add retry mechanisms for network requests
3. Implement offline payment queuing
4. Add more comprehensive logging for debugging

By following these steps and using the enhanced error handling, you should be able to resolve the "Network Error" issue and successfully integrate PhonePe payments into your application.