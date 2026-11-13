"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebase/config";

export function FirebaseAnalytics() {
  useEffect(() => {
    initAnalytics().catch((err) => {
      console.debug("Firebase Analytics skipped or not supported in this environment:", err);
    });
  }, []);

  return null;
}
