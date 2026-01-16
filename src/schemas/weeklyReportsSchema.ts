import { Timestamp } from "firebase/firestore";

export interface WeeklyReports {
  userId: string;

  cycleStart: Timestamp;
  cycleEnd: Timestamp;

  weeklyScore: number; // 0–100
  consistencyLevel: "low" | "medium" | "high";

  breakdown: {
    completion: number; // out of 60
    effort: number; // out of 20
    quality: number; // out of 10
    difficulty: number; // out of 10
  };

  aiInsights: string[]

  recommendation: string; // next-step advice

  generatedAt: Timestamp;
}
