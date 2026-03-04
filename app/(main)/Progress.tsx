import { styles } from "@/assets/styles/progressStyle";
import { auth, db } from "@/src/config/firebase";
import Header from "@/src/reusables/Header";
import LogDetailModal from "@/src/reusables/LogDetailModal";
import ProgressCard from "@/src/reusables/ProgressCard";
import { DailyLog } from "@/src/schemas/dailyLogsSchema";
import { weeklyReportService } from "@/src/services/weeklyReportService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LOGS_CACHE_KEY = "dailyLogsCache";

const Progress = () => {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DailyLog | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cycleReadyForReport, setCycleReadyForReport] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [generatingReport, setGeneratingReport] = useState(false);

  const uid = auth.currentUser?.uid;

  // ---------- AsyncStorage helpers ----------
  const saveLogsToStorage = useCallback(async (logs: DailyLog[]) => {
    try {
      await AsyncStorage.setItem(LOGS_CACHE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error("Error saving logs to storage", e);
    }
  }, []);

  const loadLogsFromStorage = useCallback(async (): Promise<DailyLog[]> => {
    try {
      const json = await AsyncStorage.getItem(LOGS_CACHE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.error("Error loading logs from storage", e);
      return [];
    }
  }, []);

  // ---------- Load cached logs on mount ----------
  useEffect(() => {
    let unsubscribeLogs: (() => void) | undefined;

    const init = async () => {
      const cachedLogs = await loadLogsFromStorage();
      if (cachedLogs.length > 0) {
        setLogs(cachedLogs);
        setLoading(false);
      }

      if (!uid) return;

      // Firestore listener
      const logsRef = collection(db, "dailyLogs");
      const q = query(logsRef, where("userId", "==", uid));
      unsubscribeLogs = onSnapshot(
        q,
        (snapshot) => {
          const fetchedLogs: DailyLog[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as DailyLog[];

          // Sort by createdAt descending
          fetchedLogs.sort((a, b) => {
            const timeA =
              a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
            const timeB =
              b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });

          setLogs(fetchedLogs);
          saveLogsToStorage(fetchedLogs);
          setLoading(false);
        },
        (error) => {
          console.error("Firestore Listener Error:", error);
          setLoading(false);
        },
      );
    };

    void init();

    return () => {
      if (unsubscribeLogs) {
        unsubscribeLogs();
      }
    };
  }, [uid, loadLogsFromStorage, saveLogsToStorage]);

  // ---------- Listen for cycle status ----------
  useEffect(() => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data();
        setCycleReadyForReport(userData.cycleReadyForReport || false);
        setCyclesCompleted(userData.cyclesCompleted || 0);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  // ---------- Derived values ----------
  const logsCount = useMemo(() => logs.length, [logs]);

  const mapOutcomeToStatus = useCallback(
    (
      outcome?: string | null,
    ): "Completed" | "Partial Completed" | "Missed" | "Not Completed" => {
      const map: Record<
        string,
        "Completed" | "Partial Completed" | "Missed" | "Not Completed"
      > = {
        completed: "Completed",
        partial: "Partial Completed",
        missed: "Missed",
      };
      return map[outcome || ""] || "Not Completed";
    },
    [],
  );

  // ---------- Handlers ----------
  const handlePressLog = useCallback((item: DailyLog) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  }, []);

  const handleGenerateReport = useCallback(async () => {
    if (!uid) return;
    setGeneratingReport(true);

    try {
      console.log("🚀 Starting manual report generation...");
      const result = await weeklyReportService(uid, true);

      if (result.success) {
        Alert.alert(
          "Report Generated! 🎉",
          `Your weekly score: ${result.weeklyReport?.weeklyScore}/100\n\nLogs have been moved to history.`,
          [
            {
              text: "View Report",
              onPress: () => router.push("/(progressStack)/History"),
            },
            { text: "OK" },
          ],
        );
      } else if (result.requiresSubscription) {
        Alert.alert(
          "Premium Feature 🌟",
          "Subscribe to Premium to generate unlimited weekly reports!",
          [
            { text: "Maybe Later", style: "cancel" },
            {
              text: "Subscribe Now",
              onPress: () => {
                // router.push("/(settings)/Subscription");
              },
            },
          ],
        );
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error: any) {
      console.error("❌ Exception in handleGenerateReport:", error);
      Alert.alert("Error", `Exception: ${error.message}`);
    } finally {
      setGeneratingReport(false);
    }
  }, [uid]);

  // ---------- Render ----------
  return (
    <View style={styles.container}>
      <Header initialText={"Track your Desires"} />

      <View style={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Your Daily Intentions Progress will be marked here
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#F3F4F6",
            borderRadius: 8,
            marginHorizontal: 16,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#374151",
              textAlign: "center",
            }}
          >
            Cycle Progress: {logsCount}/7 logs
          </Text>
          {logsCount === 7 && (
            <Text
              style={{
                fontSize: 14,
                color: "#10B981",
                textAlign: "center",
                marginTop: 4,
                fontWeight: "500",
              }}
            >
              ✓ Cycle Complete!
            </Text>
          )}
        </View>

        {logsCount === 7 && (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <TouchableOpacity
              onPress={handleGenerateReport}
              disabled={generatingReport}
              style={{
                padding: 16,
                backgroundColor: generatingReport ? "#9CA3AF" : "#10B981",
                borderRadius: 12,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {generatingReport ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  >
                    📊 Generate Weekly Report
                  </Text>
                  {cyclesCompleted > 0 && (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        opacity: 0.9,
                      }}
                    >
                      Premium feature
                    </Text>
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6C5CE7"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={logs}
            keyExtractor={(item, index) => item.id || `index-${index}`}
            renderItem={({ item }) => (
              <ProgressCard
                userId={item.userId}
                title={item.intention || "Unnamed Intention"}
                description={
                  item.notes || `Planned: ${item.plannedDuration || 0} mins`
                }
                status={mapOutcomeToStatus(item.outcome)}
                onPress={() => handlePressLog(item)}
                mood={`Difficulty: ${item.difficulty || "N/A"}`}
              />
            )}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text style={{ color: "#999" }}>
                  No daily logs found yet.{"\n"}Start your first cycle!
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <LogDetailModal
        visible={isModalVisible}
        item={selectedItem}
        onClose={() => setIsModalVisible(false)}
      />

      <TouchableOpacity
        style={styles.footer}
        onPress={() => router.push("/(progressStack)/History")}
      >
        <Text style={styles.footerText}>History</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Progress;
