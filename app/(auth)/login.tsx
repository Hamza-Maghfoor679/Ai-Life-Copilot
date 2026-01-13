import { auth } from "@/src/config/firebase";
import { setToken, setUser } from "@/src/redux/slices/UserSlice";
import DefaultButton from "@/src/reusables/Button";
import { FontAwesome } from "@expo/vector-icons";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "317798552888-80gm01d44c2n22cmi4p7gpn8a5flf1q8.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      // Check Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Sign in
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) {
        throw new Error("No ID token received");
      }
      dispatch(setToken(idToken));

      // Firebase auth
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      console.log("✅ Signed in:", JSON.stringify(user));
      dispatch(
        setUser({
          uid: userCredential.user.uid,
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          token: idToken,
        })
      );
      // Save to Redux
      console.log("User dispatched to Redux", idToken);
      router.replace("/(main)");

      // router.replace("/(main)");
    } catch (error: any) {
      console.error("Sign-in error:", error);

      let errorMessage = "An error occurred during sign-in";

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = "Sign-in was cancelled";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = "Sign-in is already in progress";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = "Play Services not available or outdated";
      }

      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to AI Life Copilot</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4285F4" />
      ) : (
        <DefaultButton
          title="Continue with Google"
          onPress={handleGoogleSignIn}
          icon={<FontAwesome name="google" color={"white"} size={18} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
    gap: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
