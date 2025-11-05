# Google Sign-In Setup Guide

This guide will help you resolve the "DEVELOPER_ERROR" when using Google Sign-In in your React Native Firebase app.

## Common Causes of DEVELOPER_ERROR

1. **Missing or incorrect Web Client ID**
2. **Missing SHA-1 fingerprint in Firebase Console**
3. **Missing google-services.json file**
4. **Google Sign-In not enabled in Firebase Console**
5. **Incorrect app signing**

## Step-by-Step Fix

### 1. Get Your Web Client ID

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (corpeas-ee450)
3. Go to **Project Settings** > **General**
4. Under "Your apps", find your **web app** (or create one if it doesn't exist)
5. Copy the **Web Client ID** (it looks like: `XXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`)

### 2. Update App.tsx

Replace `'YOUR_WEB_CLIENT_ID'` in `d:\corpease\src\App.tsx` with your actual Web Client ID:

```javascript
GoogleSignin.configure({
  webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID_HERE', // Replace with your Web Client ID
  offlineAccess: true,
});
```

### 3. Get Your SHA-1 Fingerprint

For development (debug build):

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

On Windows, the path might be:
```bash
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### 4. Add SHA-1 to Firebase Console

1. In Firebase Console, go to **Project Settings** > **General**
2. Under "Your apps", find your Android app
3. Add the SHA-1 fingerprint to **SHA certificate fingerprints**

### 5. Download and Place google-services.json

1. In Firebase Console, go to **Project Settings** > **General**
2. Under "Your apps", find your Android app
3. Click the download icon for **google-services.json**
4. Place the file in `d:\corpease\android\app\`

### 6. Enable Google Sign-In in Firebase

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Google** provider

### 7. Rebuild Your App

After making these changes, rebuild your app:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Verification

After implementing the above steps, you can verify your setup:

1. Check that `google-services.json` is in `android/app/`
2. Verify the Web Client ID in `App.tsx` matches Firebase Console
3. Confirm SHA-1 fingerprint is added to Firebase Console
4. Ensure Google Sign-In is enabled in Authentication settings

## Troubleshooting

If you still get DEVELOPER_ERROR:

1. **Double-check the Web Client ID** - Make sure it's the Web app client ID, not the Android app client ID
2. **Verify SHA-1 fingerprint** - Make sure you're using the debug keystore for development
3. **Check package name** - Ensure your app's package name matches the one in Firebase Console
4. **Re-download google-services.json** - Download a fresh copy after adding SHA-1

## Additional Resources

- [React Native Google Sign-In Documentation](https://react-native-google-signin.github.io/)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)