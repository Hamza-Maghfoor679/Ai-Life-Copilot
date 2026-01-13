// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, GoogleAuthProvider, initializeAuth } from "firebase/auth";

// REMOVED: getAnalytics and isSupported - not needed for React Native

const firebaseConfig = {
  apiKey: "AIzaSyACOBhSe6me2spW24d_eIaceijJIuOTJJU",
  authDomain: "ai-life-copilot-eaeb1.firebaseapp.com",
  projectId: "ai-life-copilot-eaeb1",
  storageBucket: "ai-life-copilot-eaeb1.firebasestorage.app",
  messagingSenderId: "317798552888",
  appId: "1:317798552888:web:cad0e1c120189a3de41dcd",
  measurementId: "G-12CLNYQT8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Google Auth Provider
const googleAuthProvider = new GoogleAuthProvider();

export { app, auth, googleAuthProvider };

