import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useDailyLogRestriction = (storageKey = "lastLogDate") => {
  const [canSubmit, setCanSubmit] = useState(true);

  useEffect(() => {
    const checkLog = async () => {
      const lastLogDate = await AsyncStorage.getItem(storageKey);

      const now = new Date();
      const todayString =
        now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");

      setCanSubmit(lastLogDate !== todayString);
    };

    checkLog();
  }, [storageKey]);

  const markSubmitted = async () => {
    const now = new Date();
    const todayString =
      now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0");

    await AsyncStorage.setItem(storageKey, todayString);
    setCanSubmit(false);
  };

  return { canSubmit, markSubmitted };
};
