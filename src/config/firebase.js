import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  GoogleAuthProvider,
  initializeAuth,
} from "firebase/auth";
import {
  getFirestore
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";


const firebaseConfig = {
  apiKey: "AIzaSyACOBhSe6me2spW24d_eIaceijJIuOTJJU",
  authDomain: "ai-life-copilot-eaeb1.firebaseapp.com",
  projectId: "ai-life-copilot-eaeb1",
  storageBucket: "ai-life-copilot-eaeb1.firebasestorage.app",
  messagingSenderId: "317798552888",
  appId: "1:317798552888:web:cad0e1c120189a3de41dcd",
  measurementId: "G-12CLNYQT8B",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

const functions = getFunctions(app);


// Auth (React Native persistence)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore - Initialize AFTER app
const db = getFirestore(app);

// Google provider
const googleAuthProvider = new GoogleAuthProvider();

export { app, auth, db, functions, googleAuthProvider };

