import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    Timestamp,
    where,
    writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { DailyLog } from "../schemas/dailyLogsSchema";

/**
 * Moves completed cycle logs to history and deletes them from dailyLogs.
 * This ensures the progress screen only shows current cycle logs (max 7).
 */

export async function moveLogsToHistory(
  userId: string,
  cycleLogs: DailyLog[],
  cycleStart: Timestamp
) {
  if (!cycleLogs.length) {
    console.log("⚠️ No logs to move to history");
    return;
  }

  // Calculate cycle end
  // TESTING MODE: Use current time as cycle end
  const cycleEnd = Timestamp.now();
  
  // PRODUCTION MODE: Use 7 days from cycle start (uncomment below)
  // const cycleEnd = Timestamp.fromMillis(
  //   cycleStart.toMillis() + 7 * 24 * 60 * 60 * 1000
  // );

  const batch = writeBatch(db);

  // Create history document
  const historyRef = collection(db, "historyLogs", userId, "cycles");
  const historyDocId = `${cycleStart.toMillis()}_${cycleEnd.toMillis()}`;
  const historyDoc = doc(historyRef, historyDocId);

  // Save logs to history with metadata
  batch.set(historyDoc, {
    logs: cycleLogs,
    cycleStart,
    cycleEnd,
    totalLogs: cycleLogs.length,
    completedLogs: cycleLogs.filter(log => log.outcome === "completed").length,
    archivedAt: Timestamp.now(),
  });

  // Delete all logs from dailyLogs collection
  cycleLogs.forEach((log) => {
    const logRef = doc(db, "dailyLogs", log.id);
    batch.delete(logRef);
  });

  // Commit the batch operation
  await batch.commit();

  console.log("📦 Logs moved to history:");
  console.log(`  - Cycle: ${cycleStart.toDate()} → ${cycleEnd.toDate()}`);
  console.log(`  - Total logs: ${cycleLogs.length}`);
  console.log(`  - History ID: ${historyDocId}`);
  console.log(`  - Deleted from dailyLogs: ${cycleLogs.length} logs`);
}

/**
 * Fetch user's historical cycles.
 * Returns all completed cycles with their logs.
 */
export async function fetchUserHistory(userId: string) {
  try {
    const historyRef = collection(db, "historyLogs", userId, "cycles");
    const snap = await getDocs(historyRef);

    const history = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📚 Fetched ${history.length} historical cycles for user ${userId}`);
    return history; // Array of { logs: DailyLog[], cycleStart, cycleEnd, totalLogs, completedLogs }
  } catch (error: any) {
    console.error("Error fetching user history:", error.message);
    throw error;
  }
}

/**
 * Fetch current cycle logs (for progress screen).
 * Should return max 7 logs.
 */
export async function fetchCurrentCycleLogs(userId: string): Promise<DailyLog[]> {
  try {
    // Get user's current cycle start
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) throw new Error("User not found");
    
    const userData = userSnap.data();
    const currentCycleStart: Timestamp = userData.currentCycleStart;

    // Fetch logs from current cycle
    const logsRef = collection(db, "dailyLogs");
    const logsQuery = query(
      logsRef,
      where("userId", "==", userId),
      where("createdAt", ">=", currentCycleStart)
    );

    const logsSnap = await getDocs(logsQuery);
    const currentLogs: DailyLog[] = logsSnap.docs.map((doc) => ({
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

    console.log(`📊 Current cycle has ${currentLogs.length}/7 logs`);
    return currentLogs;
  } catch (error: any) {
    console.error("Error fetching current cycle logs:", error.message);
    throw error;
  }
}