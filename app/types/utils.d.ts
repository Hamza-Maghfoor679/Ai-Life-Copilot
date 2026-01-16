export type StatusType =
  | "completed"
  | "partial"
  | "missed";

export interface Log {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  intention: string;
  plannedDuration: number;
  actualDuration?: number | null;
  outcome?: "completed" | "partial Completed" | "missed" | null | string;
  completionQuality?: 1 | 2 | 3 | 4 | 5 | null;
  difficulty?: "easy" | "medium" | "hard";
  mood?: "happy" | "neutral" | "sad" | "angry" | "tired";
  energy?: "low" | "medium" | "high";
  notes?: string;
  createdAt: Timestamp;
}

export interface DailyLog extends Log {}