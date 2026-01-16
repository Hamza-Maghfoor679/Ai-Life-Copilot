import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { DailyLog } from "../schemas/dailyLogsSchema";

export const createDailyLog = async (log: DailyLog) => {
  try {
    if (!log.id) {
      throw new Error("Log object must have an id field");
    }

    const docRef = doc(db, "dailyLogs", (log as any).id);

    await setDoc(docRef, log);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(
        "5. ✓✓ Document verified! Data in DB:",
        JSON.stringify(docSnap.data(), null, 2)
      );
      console.log("========== SAVE SUCCESSFUL ==========\n");
      return docRef;
    } else {
      console.log("5. ✗✗ ERROR: Document was created but cannot be read back!");
      throw new Error("Document verification failed");
    }
  } catch (error: any) {
    throw error;
  }
};
