// app/utils/calculations/qualityScore.ts
import { DailyLog } from "../../schemas/dailyLogsSchema";

export function calculateQualityScore(logs: DailyLog[]): number {
  const qualities = logs
    .filter((log) => log.completionQuality)
    .map((log) => log.completionQuality || 0);

  if (qualities.length === 0) return 0;

  const avgQuality = qualities.reduce((a, b) => a + b, 0 as number) / qualities.length;
  return Math.round((avgQuality / 5) * 10);
}

// ============================================

