import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  onboardingCompleted: boolean;
  onboardingProfile: {
    focusAreas: string[];
    experienceLevel: "beginner" | "intermediate" | "advanced";
    preferredStyle: "strict" | "balanced" | "gentle";
  };
  createdAt: Timestamp;
  currentCycleStart: Timestamp; // ← Must be Timestamp, not number
  lastReportAt: Timestamp;
  currentScore: number;
  subscriptionStatus: "free" | "trial" | "paid";
}