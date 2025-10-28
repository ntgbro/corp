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

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
