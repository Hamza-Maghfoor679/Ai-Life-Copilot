// src/config/env.ts
import { Platform } from "react-native";

// Get environment variable with fallback
const getEnv = (key: string, fallback = ""): string => {
  return process.env[key] || fallback;
};

export const Config = {
  // RevenueCat Keys
  REVENUECAT_KEY: Platform.select({
    android: getEnv("EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY", "goog_"),
    ios: getEnv("EXPO_PUBLIC_REVENUECAT_APPLE_KEY", "appl_"),
    default: "",
  }),

  // API URLs
  VERCEL_API_URL: getEnv(
    "EXPO_PUBLIC_VERCEL_API_URL",
    "https://ailifecopilot.vercel.app",
  ),

  // App info
  IS_DEV: __DEV__,
};

// Quick validation
if (!Config.REVENUECAT_KEY && !__DEV__) {
  console.warn("⚠️ RevenueCat key not configured");
}

if (!Config.VERCEL_API_URL) {
  console.warn("⚠️ Vercel API URL not configured");
}
