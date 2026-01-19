// src/services/openaiService.ts
import { DailyLog } from "../schemas/dailyLogsSchema";

const VERCEL_API_URL = "https://ailifecopilot.vercel.app/api/generate-insights";

interface AIInsightsResponse {
  success: boolean;
  insights: string[];
  recommendation: string;
  error?: string;
}

export async function aiInsightsGeneration(
  userId: string,
  cycleLogs: DailyLog[],
  weeklyScore: number,
  completionScore: number,
  effortScore: number,
  qualityScore: number,
  energyScore: number,
  difficultyScore: number
): Promise<{ insights: string[]; recommendation: string }> {
  try {
    console.log("🤖 Generating AI insights...");

    // Call your Vercel API endpoint
    const response = await fetch(VERCEL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cycleLogs,
        weeklyScore,
        completionScore,
        effortScore,
        qualityScore,
        energyScore,
        difficultyScore,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: AIInsightsResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to generate insights");
    }

    console.log("✅ AI insights generated successfully");
    console.log("  - Insights count:", data.insights.length);
    console.log("  - Recommendation:", data.recommendation);

    return {
      insights: data.insights,
      recommendation: data.recommendation,
    };
  } catch (error: any) {
    console.error("❌ Error generating AI insights:", error.message);
    
    // Return fallback insights if API fails
    const completedCount = cycleLogs.filter(l => l.outcome === "completed").length;
    const hasGoodConsistency = cycleLogs.length === 7;
    const hasGoodCompletion = completedCount >= 5;
    
    return {
      insights: [
        `You completed ${completedCount}/7 tasks this cycle.`,
        hasGoodConsistency && hasGoodCompletion
          ? "Great consistency and completion rate this week!"
          : hasGoodConsistency
          ? "You logged all 7 days - now focus on completing more tasks."
          : "Try to log daily for better insights and accountability.",
        completedCount === 0
          ? "Remember: even small progress is still progress. Start with one task tomorrow."
          : completedCount < 4
          ? "Consider setting more achievable goals to build momentum."
          : "You're building a strong habit of task completion!",
      ],
      recommendation:
        weeklyScore >= 80
          ? "Excellent work! Keep up your effort and focus on completing harder tasks."
          : weeklyScore >= 60
          ? "Good progress! Try to increase task completion and quality ratings."
          : weeklyScore >= 30
          ? "Focus on completing your planned tasks and maintaining consistency."
          : "Start small: pick 1-2 achievable tasks for tomorrow and build from there.",
    };
  }
}