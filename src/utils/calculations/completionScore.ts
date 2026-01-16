import { DailyLog } from "../../schemas/dailyLogsSchema";

export function calculateCompletionScore(logs: DailyLog[]): number {
  const outcomeValues: { [key: string]: number } = {
    completed: 1.0,
    partial: 0.5,
    missed: 0,
  };

  const totalOutcome = logs.reduce((sum, log) => {
    const value = outcomeValues[log.outcome as string] || 0;
    return sum + value;
  }, 0);

  const avgOutcome = totalOutcome / Math.min(logs.length, 7);
  return Math.round(avgOutcome * 60);
}
