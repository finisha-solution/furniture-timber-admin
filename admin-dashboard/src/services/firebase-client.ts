import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Configuration with fallbacks
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDLtqTRaW-Y8qHAeiUuIRUGmhtKVwGahIM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tbms-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tbms-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tbms-project.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1098533347273",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1098533347273:web:27d87484bab74db93c5218",
};

console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing'
});

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Auth with persistence
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Firestore
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

console.log('Firebase connected to project:', firebaseConfig.projectId);

// Check if running in development and use emulators if available
const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';

if (useEmulators) {
  console.log('Using Firebase Emulators');
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;