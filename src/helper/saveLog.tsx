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
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { DailyLog } from "../schemas/dailyLogsSchema";
import { weeklyReportService } from "../services/weeklyReportService";
import { scheduleTaskReminder } from '../utils/notifications/notifications';

/**
 * Create a daily log.
 * - First cycle: Auto-generates report after 7 logs
 * - Subsequent cycles: User must manually trigger report (premium feature)
 */
export const createDailyLog = async (log: DailyLog) => {
  try {
    if (!log.id) throw new Error("Log object must have an id field");

    // 1️⃣ Ensure createdAt is set
    if (!log.createdAt) log.createdAt = Timestamp.now();

    // 2️⃣ Fetch user data FIRST to get current cycle info
    const userRef = doc(db, "users", log.userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const userData = userSnap.data();
    const currentCycleStart: Timestamp = userData.currentCycleStart;
    const cyclesCompleted: number = userData.cyclesCompleted || 0;
    const subscriptionStatus: string = userData.subscriptionStatus || "free";

    // 3️⃣ Check existing logs in current cycle BEFORE saving new log
    const logsRef = collection(db, "dailyLogs");
    const cycleQuery = query(
      logsRef,
      where("userId", "==", log.userId),
      where("createdAt", ">=", currentCycleStart),
      orderBy("createdAt", "asc")
    );

    const cycleSnap = await getDocs(cycleQuery);
    const existingCycleLogs: DailyLog[] = cycleSnap.docs.map((doc) => ({
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

    console.log(
      `📊 Current cycle has ${existingCycleLogs.length} logs before adding new one`
    );

    // 4️⃣ Check if adding this log would exceed 7 logs
    if (existingCycleLogs.length >= 7) {
      throw new Error(
        "Current cycle already has 7 logs. Please generate your weekly report first."
      );
    }

    // 5️⃣ Save the new log
    const docRef = doc(db, "dailyLogs", log.id);
    await setDoc(docRef, log);
    console.log("✓ Daily log saved:", log.id);
    try {
      await scheduleTaskReminder(log.id, log.intention, 7200);
      console.log('Notifications set successfully')
    } catch (notifError) {
      console.warn(
        "Log saved but notification failed to schedule:",
        notifError
      );
      // We don't throw an error here because the log was already saved successfully
    }
    // 6️⃣ Check if cycle is NOW complete (exactly 7 logs)
    const totalLogs = existingCycleLogs.length + 1;
    console.log(`📊 After adding new log: ${totalLogs} total logs`);

    if (totalLogs === 7) {
      console.log("🎯 7 logs completed!");

      // FREEMIUM LOGIC: Only auto-generate for first cycle or premium users
      const isFirstCycle = cyclesCompleted === 0;
      const isPremium =
        subscriptionStatus === "premium" || subscriptionStatus === "trial";

      if (isFirstCycle || isPremium) {
        console.log("✅ Auto-generating report (first cycle or premium user)");

        try {
          // Auto-generate report (isManualTrigger = false)
          const result = await weeklyReportService(log.userId, false);

          if (result.success) {
            console.log("✅ Cycle completed successfully!");
            console.log(
              `  - Report generated: ${result.weeklyReport?.weeklyScore} points`
            );
            console.log(`  - Logs moved to history`);
            console.log(`  - New cycle started`);

            return {
              ...log,
              id: docRef.id,
              cycleCompleted: true,
              reportGenerated: true,
              weeklyScore: result.weeklyReport?.weeklyScore,
            };
          } else {
            throw new Error(result.message);
          }
        } catch (cycleError: any) {
          console.error(
            "❌ Error during cycle completion:",
            cycleError.message
          );
          throw new Error(
            `Log saved but cycle completion failed: ${cycleError.message}`
          );
        }
      } else {
        console.log(
          "⏸️ 7 logs completed - waiting for manual report generation (premium feature)"
        );

        // Mark that cycle is ready for report but don't auto-generate
        await updateDoc(userRef, {
          cycleReadyForReport: true, // Flag for UI to show "Generate Report" button
        });

        return {
          ...log,
          id: docRef.id,
          cycleCompleted: true,
          reportGenerated: false,
          requiresPremium: true,
          message: "Cycle complete! Subscribe to generate your weekly report.",
        };
      }
    } else {
      console.log(`⏳ Cycle in progress: ${totalLogs}/7 logs`);
      return { ...log, id: docRef.id };
    }
  } catch (error: any) {
    console.error("✗ Error creating daily log:", error.message);
    throw error;
  }
};
