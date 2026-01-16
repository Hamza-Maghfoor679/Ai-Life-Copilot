import { Timestamp } from "firebase/firestore";

export interface DailyLog {
  // No 'id' field - Firestore doc ID is separate
  userId: string;
  date: string; // YYYY-MM-DD
  intention: string;
  plannedDuration: number;
  actualDuration?: number | null;
  outcome: "completed" | "partial" | "missed" | null | string;
  completionQuality?: 1 | 2 | 3 | 4 | 5 | null;
  difficulty?: "easy" | "medium" | "hard";
  mood?: "happy" | "neutral" | "sad" | "angry" | "tired";
  energy?: "low" | "medium" | "high";
  notes?: string;
  createdAt: Timestamp;
  id: string;
}
