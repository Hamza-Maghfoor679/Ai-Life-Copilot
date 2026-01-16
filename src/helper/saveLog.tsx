// Fixed saveLog helper - use setDoc instead of addDoc

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { DailyLog } from "../schemas/dailyLogsSchema";

export const createDailyLog = async (log: DailyLog) => {
  try {
    console.log("\n========== SAVE LOG DEBUG ==========");
    console.log("1. Log object to save:", JSON.stringify(log, null, 2));
    
    if (!log.id) {
      throw new Error("Log object must have an id field");
    }
    
    // Use setDoc with the pre-generated ID
const docRef = doc(db, "dailyLogs", (log as any).id);
    console.log("2. Document ref path:", docRef.path);
    
    await setDoc(docRef, log);
    console.log("3. ✓ Document saved with ID:", log.id);
    
    // Verify it was saved
    console.log("\n4. Verifying document exists...");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("5. ✓✓ Document verified! Data in DB:", JSON.stringify(docSnap.data(), null, 2));
      console.log("========== SAVE SUCCESSFUL ==========\n");
      return docRef;
    } else {
      console.log("5. ✗✗ ERROR: Document was created but cannot be read back!");
      throw new Error("Document verification failed");
    }
    
  } catch (error: any) {
    console.error("\n========== SAVE ERROR ==========");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("========================================\n");
    throw error;
  }
};