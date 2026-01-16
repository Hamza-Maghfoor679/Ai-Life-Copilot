// app/utils/insights/insightsGenerator.ts
import { DailyLog } from "../../schemas/dailyLogsSchema";

export interface ScoreBreakdown {
  completion: number;
  effort: number;
  quality: number;
  difficulty: number;
  total: number;
}

export function generateInsights(logs: DailyLog[], scores: ScoreBreakdown): string[] {
  const insights: string[] = [];

  // Completion insights
  if (scores.completion >= 50) {
    insights.push("✅ Great consistency! You're completing most tasks.");
  } else if (scores.completion >= 30) {
    insights.push("📈 Steady progress. Keep pushing for higher completion rates.");
  } else {
    insights.push("⚠️ Completion rate is low. Try breaking tasks into smaller pieces.");
  }

  // Effort/Duration insights
  if (scores.effort >= 15) {
    insights.push("⏱️ Your time estimation is accurate. Planning is your strength.");
  } else if (scores.effort >= 10) {
    insights.push("📊 Time estimation needs work. Try tracking duration more carefully.");
  }

  // Quality insights
  if (scores.quality >= 8) {
    insights.push("⭐ Excellent quality! You're delivering high-standard work.");
  } else if (scores.quality >= 5) {
    insights.push("👍 Quality is solid. Look for opportunities to refine further.");
  } else {
    insights.push("🎯 Focus on quality over quantity. Slow down and do things right.");
  }

  // Difficulty insights
  const hardCompleted = logs.filter(
    (l) => l.difficulty === "hard" && l.outcome === "completed"
  ).length;
  const easyMissed = logs.filter(
    (l) => l.difficulty === "easy" && l.outcome === "missed"
  ).length;

  if (hardCompleted >= 3) {
    insights.push("💪 You're tackling hard tasks successfully!");
  }
  if (easyMissed >= 2) {
    insights.push("💡 Watch out: Easy tasks are being missed. Don't neglect the fundamentals.");
  }

  return insights.slice(0, 4);
}

// ============================================