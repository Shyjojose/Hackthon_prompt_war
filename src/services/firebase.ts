import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
export const isDemoMode = !apiKey || apiKey.includes('placeholder') || apiKey.includes('your_firebase_key');

const firebaseConfig = {
  apiKey: isDemoMode ? "demo-key" : apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log(isDemoMode ? "🚀 Running in DEMO MODE (Local State)" : "📡 Connecting to Firebase Live");

const app: FirebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
