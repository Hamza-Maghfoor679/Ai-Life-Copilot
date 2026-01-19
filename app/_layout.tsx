// RootLayout.tsx
import { useColorScheme } from "@/hooks/use-color-scheme";
import { persistor, store } from "@/src/redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Platform, View } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      // Enable debug logs in development
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Get platform-specific API key
      const iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY;
      const androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY;

      let apiKey: string | undefined;

      if (Platform.OS === "ios") {
        apiKey = iosApiKey;
      } else if (Platform.OS === "android") {
        apiKey = androidApiKey;
      }

      // Validate API key exists
      if (!apiKey) {
        console.error(
          "❌ RevenueCat API key not found for platform:",
          Platform.OS,
        );

        if (__DEV__) {
          Alert.alert(
            "Config Error",
            `RevenueCat API key missing for ${Platform.OS}. Check your .env file.`,
          );
        }
        return;
      }

      // Configure RevenueCat
      await Purchases.configure({ apiKey });

      console.log("✅ RevenueCat initialized for", Platform.OS);
    } catch (error) {
      console.error("❌ RevenueCat initialization failed:", error);

      if (__DEV__) {
        Alert.alert(
          "Initialization Error",
          "Failed to initialize RevenueCat. Check console for details.",
        );
      }
    }
  };

  return (
    <Provider store={store}>
      <Toast />
      <PersistGate
        loading={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
