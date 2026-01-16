// app/utils/calculations/difficultyScore.ts
import { DailyLog } from "../../schemas/dailyLogsSchema";

export function calculateDifficultyScore(logs: DailyLog[]): number {
  let score = 5;

  logs.forEach((log) => {
    const difficulty = log.difficulty as string;
    const outcome = log.outcome as string;

    if (difficulty === "hard" && outcome === "completed") {
      score += 2;
    } else if (difficulty === "medium" && outcome === "completed") {
      score += 1;
    } else if (difficulty === "easy" && outcome === "missed") {
      score -= 2;
    }
  });

  return Math.max(0, Math.min(10, score));
}

// ============================================