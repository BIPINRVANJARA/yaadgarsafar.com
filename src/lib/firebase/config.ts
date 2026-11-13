import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyB_OcRvxnzNtBhEcOGTfXQNk3lPfXjyzes",
  authDomain: "ai-gadget-suggestion.firebaseapp.com",
  projectId: "ai-gadget-suggestion",
  databaseURL: "https://ai-gadget-suggestion-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "ai-gadget-suggestion.firebasestorage.app",
  messagingSenderId: "636231242982",
  appId: "1:636231242982:web:1c6f2a26e30e6e55c85727",
  measurementId: "G-HNKHQRSB04",
};

// Initialize Firebase (SSR-safe singleton)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firebase Realtime Database
export const rtdb = getDatabase(app);

// Cloud Firestore
export const db = getFirestore(app);

// Firebase Cloud Storage
export const storage = getStorage(app);

// Optional Analytics (runs client-side only when supported)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};
