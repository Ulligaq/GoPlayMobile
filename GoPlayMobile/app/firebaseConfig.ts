import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import secrets from "../secrets.json";

console.log("🔥 Firebase Project ID:", process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID); 

// Define the Firebase configuration object
const firebaseConfig = {
  apiKey: secrets.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: secrets.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: secrets.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: secrets.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: secrets.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: secrets.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }; 
export default db; 