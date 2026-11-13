import { auth } from "./config";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

export const authService = {
  // Sign in existing admin or authenticate
  async loginAdmin(email: string, password: string): Promise<User> {
    try {
      if (typeof window !== "undefined") {
        await setPersistence(auth, browserLocalPersistence);
      }
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return userCredential.user;
    } catch (err: any) {
      throw err;
    }
  },

  // Sign out admin
  async logoutAdmin(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Error signing out from Firebase Auth:", err);
    }
  },

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },

  // Monitor auth state changes
  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },
};
