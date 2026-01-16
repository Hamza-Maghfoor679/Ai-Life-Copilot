import { ScoreBreakdown } from "./insightsGenerator";

export function generateRecommendation(scores: ScoreBreakdown): string {
  const totalScore = scores.total;

  if (totalScore >= 80) {
    return "You're performing exceptionally! Maintain this momentum and consider increasing task difficulty.";
  } else if (totalScore >= 60) {
    return "Good progress! Focus on the areas with lower scores next week to improve balance.";
  } else if (totalScore >= 40) {
    return "You're getting started. Try setting smaller, more achievable goals and build from there.";
  } else {
    return "It's been a challenging week. Reset your expectations, focus on 2-3 key priorities, and build back up gradually.";
  }
}