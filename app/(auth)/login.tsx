import { auth, db } from "@/src/config/firebase";
import { setUser } from "@/src/redux/slices/UserSlice";
import DefaultButton from "@/src/reusables/Button";
import { FontAwesome } from "@expo/vector-icons";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { OnboardingProfile } from "./onboarding";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { onboardingProfile } = useLocalSearchParams<{
    onboardingProfile?: string;
  }>();

  const parsedProfile: OnboardingProfile | null = useMemo(() => {
    if (!onboardingProfile) return null;

    try {
      return JSON.parse(onboardingProfile);
    } catch {
      return null;
    }
  }, [onboardingProfile]);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  console.log("parsedProfile", parsedProfile);

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

      // Sign in with Google
      console.log("Starting Google Sign-In...");
      const response = await GoogleSignin.signIn();
      console.log("Google Sign-In response received");
      
      // The idToken is in response.data.idToken
      const idToken = response.data?.idToken;
      
      if (!idToken) {
        console.log("Full response:", JSON.stringify(response, null, 2));
        throw new Error("No ID token received from Google Sign-In");
      }
      
      console.log("ID Token received, authenticating with Firebase...");

      // Authenticate with Firebase using the Google ID token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUser = userCredential.user;
      
      console.log("Firebase authentication successful, user UID:", firebaseUser.uid);
      
      if (!firebaseUser?.uid) {
        throw new Error("No UID found for the logged-in user");
      }

      // Get fresh Firebase ID token
      console.log("Getting Firebase ID token...");
      const firebaseIdToken = await firebaseUser.getIdToken(true);
      console.log("Firebase ID token obtained");
      
      // Check if user already exists in Firestore
      console.log("Checking if user exists in Firestore...");
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      const isExistingUser = userDoc.exists();
      
      console.log("User exists:", isExistingUser);

      // Save user data to Firestore
      console.log("Saving user data to Firestore...");
      try {
        if (isExistingUser) {
          // For existing users, only update basic info (no onboarding data)
          await setDoc(
            userDocRef,
            {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
          console.log("Existing user data updated");
        } else {
          // For new users, check if onboarding profile exists
          if (!onboardingProfile) {
            Alert.alert("Error", "Onboarding profile is missing. Please complete onboarding first.");
            setIsLoading(false);
            return;
          }

          // Create new user with onboarding data and cycle tracking
          await setDoc(
            userDocRef,
            {
              onboardingProfile: parsedProfile,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              provider: "google",
              currentCycleStart: serverTimestamp(),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              currentScore: null,
              lastReportAt: null,
              subscriptionStatus: 'free'
            },
            { merge: true }
          );
          console.log("New user created with onboarding data");
        }
      } catch (firestoreError: any) {
        console.error("Firestore error:", firestoreError);
        console.error("Error code:", firestoreError.code);
        console.error("Error message:", firestoreError.message);
        // Continue anyway - user is authenticated even if Firestore fails
        console.log("Continuing despite Firestore error...");
      }

      // Dispatch user data to Redux
      console.log("Dispatching user to Redux...");
      dispatch(
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          token: firebaseIdToken,
        })
      );
      console.log("User dispatched to Redux");
      
      // Navigate to main app
      console.log("Navigating to main app...");
      router.replace("/(main)");
      console.log("Navigation complete");
    } catch (error: any) {
      console.error("Sign-in error:", error);

      let errorMessage = "An error occurred during sign-in";

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = "Sign-in was cancelled";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = "Sign-in is already in progress";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = "Play Services not available or outdated";
      } else {
        errorMessage = error.message || errorMessage;
      }

      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
    gap: 20,
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