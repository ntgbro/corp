# Corpease - B2B Commerce Platform

A React Native mobile commerce application for fresh produce, FMCG products, office supplies, and corporate catering services.

## Features

- 📱 Multi-service B2B platform (Fresh Serve, FMCG, Office Supplies, Corporate Catering)
- 🔐 Phone number authentication with OTP
- 📍 Location-based services with enhanced geocoding
- 🛒 Shopping cart and order management
- 👨‍🍳 Chef and restaurant discovery
- 🎨 Light/Dark theme support
- 🔔 Push notifications (FCM)
- 📊 Firebase backend integration

## New Features

- 🔄 Real-time cart synchronization with Firebase
- ☁️ Cloud-persisted shopping cart across devices
- 📱 Offline cart functionality with automatic sync

## Firebase Setup

This project uses Firebase for backend services. Follow these steps to set up Firebase:

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing project `corpeas-ee450`
3. Enable required services:
   - Authentication (Phone provider)
   - Firestore Database
   - Storage
   - Cloud Messaging (optional)

### 2. Download Service Account Key

1. Go to Project Settings > Service Accounts
2. Generate new private key (JSON format)
3. **IMPORTANT**: Do NOT commit this file to GitHub
4. Rename it to `firebase-service-account-key.json`
5. Place it in the project root directory

### 3. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values:
   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

### 4. Mobile App Configuration

#### Android
1. Download `google-services.json` from Firebase Console
2. Place in `android/app/` directory

#### iOS
1. Download `GoogleService-Info.plist` from Firebase Console
2. Place in `ios/` directory

## 🚨 SECURITY ALERT - IMPORTANT

If you see this message, your Firebase credentials have been exposed. This is a **CRITICAL SECURITY ISSUE**.

### Immediate Actions Required:

1. **Generate a new service account key** in Firebase Console
2. **Delete the old exposed key** from Firebase Console
3. **Update your local `firebase-service-account-key.json`**
4. **Review your Google Cloud Console activity logs**
5. **Check for unauthorized access**

### For Security Incidents:
- Contact Google Cloud Support immediately
- Review all Firebase usage and billing
- Check for unauthorized data access
- Monitor your project for suspicious activity

---

## Proper Secret Management

**⚠️ NEVER commit these files:**
- `firebase-service-account-key.json` (contains private keys)
- `.env` (with real API keys)
- `android/app/google-services.json`
- `ios/GoogleService-Info.plist`

**✅ Use these templates instead:**
- `firebase-service-account-key.example.json`
- `.env.example`

## Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```