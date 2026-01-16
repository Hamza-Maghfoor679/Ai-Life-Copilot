// / app/utils/calculations/effortScore.ts
import { DailyLog } from "../../schemas/dailyLogsSchema";

export function calculateEffortScore(logs: DailyLog[]): number {
  const accuracies = logs
    .filter((log) => log.plannedDuration && log.actualDuration)
    .map((log) => {
      const planned = log.plannedDuration || 0;
      const actual = log.actualDuration || 0;

      if (planned === 0) return 1.0;

      const ratio = actual / planned;
      if (ratio >= 0.8 && ratio <= 1.2) {
        return 1.0;
      } else if (ratio >= 0.6 && ratio <= 1.5) {
        return 0.7;
      } else {
        return 0.3;
      }
    });

  if (accuracies.length === 0) return 0;

  const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  return Math.round(avgAccuracy * 20);
}

