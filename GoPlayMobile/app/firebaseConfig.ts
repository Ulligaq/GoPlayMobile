import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import secrets from "../secrets.json";

console.log("🔥 Firebase Project ID:", secrets.EXPO_PUBLIC_FIREBASE_PROJECT_ID);

// Initialize Firebase only if no app is already initialized
const firebaseConfig = {
  apiKey: secrets.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: secrets.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: secrets.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: secrets.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: secrets.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: secrets.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized successfully.");
} else {
  app = getApp();
  console.log("✅ Firebase app already initialized.");
}

const db = getFirestore(app);

export { app, db };
export default app;