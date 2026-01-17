import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { DailyLog } from "../schemas/dailyLogsSchema";
import { moveLogsToHistory } from "../services/logsToHistory";
import { weeklyReportService } from "../services/weeklyReportService";

/**
 * Debug function: Check current state of user's logs
 */
export async function debugUserLogs(userId: string) {
  try {
    console.log("🔍 DEBUG: Checking user logs...");
    
    // Get user data
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log("❌ User not found");
      return;
    }
    
    const userData = userSnap.data();
    console.log("👤 User data:", {
      currentCycleStart: userData.currentCycleStart.toDate(),
      lastReportAt: userData.lastReportAt?.toDate() || "Never",
      currentScore: userData.currentScore || 0,
    });

    // Get current cycle logs
    const logsRef = collection(db, "dailyLogs");
    const cycleQuery = query(
      logsRef,
      where("userId", "==", userId),
      where("createdAt", ">=", userData.currentCycleStart),
      orderBy("createdAt", "asc")
    );

    const cycleSnap = await getDocs(cycleQuery);
    const logs = cycleSnap.docs.map((doc) => ({
      id: doc.id,
      date: doc.data().date,
      intention: doc.data().intention,
      outcome: doc.data().outcome,
      createdAt: doc.data().createdAt.toDate(),
    }));

    console.log(`📊 Current cycle logs: ${logs.length}`);
    logs.forEach((log, index) => {
      console.log(`  ${index + 1}. ${log.date} - ${log.intention} [${log.outcome || 'pending'}]`);
    });

    // Get all logs (even outside cycle)
    const allLogsQuery = query(
      logsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "asc")
    );
    const allLogsSnap = await getDocs(allLogsQuery);
    
    console.log(`📦 Total logs in dailyLogs: ${allLogsSnap.size}`);
    
    if (allLogsSnap.size !== logs.length) {
      console.warn(`⚠️ WARNING: ${allLogsSnap.size - logs.length} logs exist outside current cycle!`);
    }

    return {
      currentCycleLogs: logs.length,
      totalLogs: allLogsSnap.size,
      cycleStart: userData.currentCycleStart.toDate(),
      logs,
    };
  } catch (error: any) {
    console.error("Error in debug:", error.message);
    throw error;
  }
}

/**
 * Force complete current cycle and clean up
 * Use this to fix the 8-log issue
 */
export async function forceCompleteCycle(userId: string) {
  try {
    console.log("🔧 FORCE COMPLETING CYCLE...");
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const userData = userSnap.data();
    const currentCycleStart: Timestamp = userData.currentCycleStart;

    // Get ALL logs for this user (not just current cycle)
    const logsRef = collection(db, "dailyLogs");
    const allLogsQuery = query(
      logsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "asc")
    );

    const allLogsSnap = await getDocs(allLogsQuery);
    const allLogs: DailyLog[] = allLogsSnap.docs.map((doc) => ({
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

    console.log(`📦 Found ${allLogs.length} total logs`);

    if (allLogs.length === 0) {
      console.log("✓ No logs to process");
      return { processed: 0 };
    }

    // Process logs in batches of 7
    let processedCount = 0;
    let cycleStartDate = currentCycleStart;

    while (allLogs.length > 0) {
      const batchLogs = allLogs.splice(0, 7);
      console.log(`Processing batch of ${batchLogs.length} logs...`);

      if (batchLogs.length === 7) {
        // Generate report and move to history
        await weeklyReportService(userId, batchLogs, cycleStartDate);
        await moveLogsToHistory(userId, batchLogs, cycleStartDate);
        cycleStartDate = Timestamp.now();
        processedCount += 7;
      } else {
        // Less than 7 logs remaining - these should stay in current cycle
        console.log(`⏳ ${batchLogs.length} logs remaining (less than 7), keeping for next cycle`);
        break;
      }
    }

    // Update user's cycle
    await updateDoc(userRef, {
      currentCycleStart: cycleStartDate,
      lastReportAt: Timestamp.now(),
    });

    console.log(`✅ Force complete done! Processed ${processedCount} logs`);
    
    // Verify final state
    const finalCheck = await debugUserLogs(userId);
    
    return {
      processed: processedCount,
      remaining: finalCheck?.currentCycleLogs || 0,
    };
  } catch (error: any) {
    console.error("Error in force complete:", error.message);
    throw error;
  }
}

/**
 * Nuclear option: Delete ALL logs for a user and reset their cycle
 * USE WITH CAUTION!
 */
export async function resetUserCompletely(userId: string) {
  try {
    console.log("☢️ NUCLEAR RESET - This will delete ALL logs!");
    
    // Delete all logs
    const logsRef = collection(db, "dailyLogs");
    const allLogsQuery = query(logsRef, where("userId", "==", userId));
    const allLogsSnap = await getDocs(allLogsQuery);
    
    const deletePromises = allLogsSnap.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log(`🗑️ Deleted ${allLogsSnap.size} logs`);

    // Reset user cycle
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      currentCycleStart: Timestamp.now(),
      currentScore: 0,
    });

    console.log("✅ User completely reset!");
    
    return { deleted: allLogsSnap.size };
  } catch (error: any) {
    console.error("Error in reset:", error.message);
    throw error;
  }
}

/**
 * Get a summary for display
 */
export async function getUserCycleSummary(userId: string) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const userData = userSnap.data();
    const currentCycleStart: Timestamp = userData.currentCycleStart;

    const logsRef = collection(db, "dailyLogs");
    const cycleQuery = query(
      logsRef,
      where("userId", "==", userId),
      where("createdAt", ">=", currentCycleStart),
      orderBy("createdAt", "asc")
    );

    const cycleSnap = await getDocs(cycleQuery);
    const logs: DailyLog[] = cycleSnap.docs.map((doc) => ({
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

    const completed = logs.filter(l => l.outcome === "completed").length;
    const partial = logs.filter(l => l.outcome === "partial").length;
    const missed = logs.filter(l => l.outcome === "missed").length;

    return {
      totalLogs: logs.length,
      maxLogs: 7,
      progress: `${logs.length}/7`,
      completed,
      partial,
      missed,
      cycleStart: currentCycleStart.toDate(),
      logs,
    };
  } catch (error: any) {
    console.error("Error getting cycle summary:", error.message);
    throw error;
  }
}