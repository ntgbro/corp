import { initializeApp } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0B4tNrApQRWljS7_b2AnBSSXuXli33Y4",
  authDomain: "corpeas-ee450.firebaseapp.com",
  projectId: "corpeas-ee450",
  storageBucket: "corpeas-ee450.firebasestorage.app",
  messagingSenderId: "371942129309",
  appId: "1:371942129309:android:c855b37dce07eb41931e74"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // App already initialized, get the existing instance
  const { getApp } = require('@react-native-firebase/app');
  app = getApp();
}

// Initialize Firestore using modular API
export const db = getFirestore(app);

export default db;
