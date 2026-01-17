import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../config/firebase";
import { DailyLog } from "../schemas/dailyLogsSchema";
import { WeeklyReports } from "../schemas/weeklyReportsSchema";
import { calculateCompletionScore } from "../utils/calculations/completionScore";
import { calculateEffortScore } from "../utils/calculations/effortScore";
import { calculateQualityScore } from "../utils/calculations/qualityScore";
import { moveLogsToHistory } from "./logsToHistory";

export async function weeklyReportService(
  userId: string,
  isManualTrigger: boolean = false
) {
  console.log("🔄 Weekly report generation requested for:", userId);
  console.log("📍 Trigger type:", isManualTrigger ? "Manual" : "Automatic");

  try {
    // Get user data
    console.log("📝 Fetching user data...");
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userSnap.data();
    const currentCycleStart: Timestamp = userData.currentCycleStart;
    const cyclesCompleted: number = userData.cyclesCompleted || 0;

    console.log("👤 User Info:");
    console.log(`  - Cycles completed: ${cyclesCompleted}`);
    console.log(`  - Current cycle start: ${currentCycleStart.toDate().toISOString()}`);

    // Fetch ALL logs for this user
    console.log("📦 Fetching all logs...");
    const logsRef = collection(db, "dailyLogs");
    const allLogsQuery = query(
      logsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "asc")
    );

    const allLogsSnap = await getDocs(allLogsQuery);
    console.log(`📊 Total logs found: ${allLogsSnap.size}`);

    if (allLogsSnap.size < 7) {
      console.log(`❌ Not enough logs: ${allLogsSnap.size}/7`);
      return {
        success: false,
        requiresSubscription: false,
        message: `Not enough logs. You have ${allLogsSnap.size}/7 logs. Complete ${7 - allLogsSnap.size} more logs first.`,
        weeklyReport: null,
      };
    }

    // Convert to DailyLog array
    console.log("🔄 Converting logs to DailyLog objects...");
    const cycleLogs: DailyLog[] = allLogsSnap.docs.map((doc) => ({
      id: doc.id,
      userId: doc.data().userId,
      date: doc.data().date,
      intention: doc.data().intention,
      plannedDuration: doc.data().plannedDuration,
      actualDuration: doc.data().actualDuration ?? null,
      outcome: doc.data().outcome ?? null,
      completionQuality: doc.data().completionQuality ?? null,
      difficulty: doc.data().difficulty ?? null,
      mood: doc.data().mood ?? null,
      energy: doc.data().energy ?? null,
      notes: doc.data().notes ?? null,
      createdAt: doc.data().createdAt,
    }));

    console.log("✅ Logs ready, starting score calculation...");

    // Calculate cycle end
    const cycleEnd = Timestamp.now();

    // Calculate scores
    console.log("🧮 Calculating scores...");
    const completionScore = calculateCompletionScore(cycleLogs);
    const effortScore = calculateEffortScore(cycleLogs);
    const qualityScore = calculateQualityScore(cycleLogs);

    const energyMap: Record<string, number> = { low: 0, medium: 5, high: 10 };
    const energyScore = Math.round(
      cycleLogs.reduce((sum, log) => sum + (log.energy ? energyMap[log.energy] : 0), 0) / 7
    );

    let difficultyScore = 0;
    cycleLogs.forEach((log) => {
      if (log.difficulty === "hard" && log.outcome === "completed") difficultyScore += 1;
      if (log.difficulty === "easy" && log.outcome === "missed") difficultyScore -= 1;
    });
    difficultyScore = Math.max(0, Math.min(difficultyScore, 10));

    const weeklyScore = completionScore + effortScore + qualityScore + energyScore + difficultyScore;

    console.log(`📊 Weekly score calculated: ${weeklyScore}/100`);

    const consistencyLevel: "low" | "medium" | "high" =
      cycleLogs.length === 7 ? "high" : cycleLogs.length >= 5 ? "medium" : "low";

    const completedCount = cycleLogs.filter(l => l.outcome === "completed").length;
    const aiInsights: string[] = [
      `You completed ${completedCount}/7 tasks this cycle.`,
      cycleLogs.length === 7 ? "Perfect consistency this week!" : "Try to maintain daily logging for better insights."
    ];
    
    const recommendation: string =
      weeklyScore >= 80
        ? "Excellent work! Keep up your effort and focus on completing harder tasks."
        : weeklyScore >= 60
        ? "Good progress! Try to increase task completion and quality."
        : "Focus on consistency and completing planned tasks.";

    const weeklyReport: WeeklyReports = {
      userId,
      cycleStart: currentCycleStart,
      cycleEnd,
      weeklyScore,
      consistencyLevel,
      breakdown: {
        completion: completionScore,
        effort: effortScore,
        quality: qualityScore,
        difficulty: difficultyScore,
      },
      aiInsights,
      recommendation,
      generatedAt: Timestamp.now(),
    };

    // Save report
    console.log("💾 Saving weekly report...");
    const reportId = `${userId}_${currentCycleStart.toMillis()}`;
    await setDoc(doc(db, "weeklyReports", reportId), weeklyReport);
    console.log("✅ Report saved");

    // Move logs to history
    console.log("📦 Moving logs to history...");
    await moveLogsToHistory(userId, cycleLogs, currentCycleStart);
    console.log("✅ Logs moved to history");

    // Update user cycle
    console.log("🔄 Updating user cycle...");
    const nextCycleStart = Timestamp.now();
    await updateDoc(userRef, {
      currentCycleStart: nextCycleStart,
      lastReportAt: Timestamp.now(),
      currentScore: weeklyScore,
      cyclesCompleted: cyclesCompleted + 1,
      cycleReadyForReport: false,
    });
    console.log("✅ User cycle updated");

    console.log("🎉 Report generation complete!");
    
    return {
      success: true,
      requiresSubscription: false,
      weeklyReport,
      message: "Weekly report generated successfully!",
    };

  } catch (error: any) {
    console.error("❌ Error in weekly report generation:", error);
    console.error("❌ Stack:", error.stack);
    return {
      success: false,
      requiresSubscription: false,
      weeklyReport: null,
      message: `Error: ${error.message}`,
    };
  }
}