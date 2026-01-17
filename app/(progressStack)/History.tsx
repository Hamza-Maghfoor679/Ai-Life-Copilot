import { auth, db } from "@/src/config/firebase";
import DefaultButton from "@/src/reusables/Button";
import Header from "@/src/reusables/Header";
import InsightsCard from "@/src/reusables/InsightsCard";
import CustomModal from "@/src/reusables/Modal";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

// --- Interfaces ---
interface Log {
  id: string;
  date: string;
  intention: string;
  mood: string;
  outcome: string;
  difficulty: string;
  energy: string;
  plannedDuration: number;
  actualDuration: number;
  completionQuality: number;
  createdAt: any;
  notes?: string | null;
  userId: string;
}

interface HistoryCycle {
  id: string;
  userId: string;
  cycleStart: any;
  cycleEnd: any;
  completedLogs: number;
  logs: Log[];
  archivedAt: any;
  totalLogs?: number;
}

const History = () => {
  const [history, setHistory] = useState<HistoryCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<HistoryCycle | null>(null);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const authUnsub = auth.onAuthStateChanged((user) => {
      // Clean up previous listener if user changes
      if (unsubscribe) unsubscribe();

      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        // CORRECT PATH: historyLogs -> {userId} -> cycles
        // Since we are pointing directly to the user's subcollection,
        // we don't need a "where" clause for userId anymore.
        const historyRef = collection(db, "historyLogs", user.uid, "cycles");

        const q = query(historyRef, orderBy("archivedAt", "desc"));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetchedHistory: HistoryCycle[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as HistoryCycle[];

            setHistory(fetchedHistory);
            setLoading(false);
          },
          (error) => {
            console.error("Firestore Listener Error:", error);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Setup Error:", err);
        setLoading(false);
      }
    });

    return () => {
      authUnsub();
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // --- Handlers ---
  const openCycleModal = (cycle: HistoryCycle) => {
    setSelectedCycle(cycle);
    setIsCycleModalOpen(true);
  };

  const openLogModal = (log: Log) => {
    setSelectedLog(log);
    setIsLogModalOpen(true);
  };

  // --- Render Items ---
  const renderCycleItem = ({ item }: { item: HistoryCycle }) => {
    console.log("item>>>>>>>>>", item);
    // Helper to handle potential null/undefined timestamps safely
    const formatDate = (ts: any) =>
      ts?.toDate?.() ? ts.toDate().toLocaleDateString() : "N/A";
    const formatTime = (ts: any) =>
      ts?.toDate?.() ? ts.toDate().toLocaleString() : "N/A";

    return (
      <InsightsCard
        title={`Cycle: ${formatDate(item.cycleStart)} - ${formatDate(
          item.cycleEnd
        )}`}
        description={`Completed Logs: ${item.completedLogs}/${
          item.logs?.length || 0
        }`}
        time={`Archived: ${formatTime(item.archivedAt)}`}
        onPress={() => openCycleModal(item)}
      />
    );
  };

  const renderLogItem = ({ item }: { item: Log }) => (
    <InsightsCard
      title={item.intention || "Untitled Log"}
      description={`Mood: ${item.mood} | Outcome: ${
        item.outcome === null ? "Not Completed" : item.outcome
      }`}
      time={item.date}
      onPress={() => openLogModal(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Header initialText="Progress History" />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : history.length === 0 ? (
          <Text style={styles.emptyText}>No history found.</Text>
        ) : (
          <FlatList
            data={history}
            renderItem={renderCycleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* Cycle Modal: Shows list of logs within that cycle */}
      <CustomModal
        visible={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
      >
        {selectedCycle && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cycle Details</Text>
            <Text style={styles.modalSub}>
              Logs: {selectedCycle.completedLogs} / {selectedCycle.logs?.length}
            </Text>

            <FlatList
              data={selectedCycle.logs}
              renderItem={renderLogItem}
              keyExtractor={(item, index) => item.id || index.toString()}
              style={{ maxHeight: 400 }} // Prevent modal from overflowing screen
            />

            <DefaultButton
              title="Back"
              onPress={() => setIsCycleModalOpen(false)}
              style={{ marginTop: 15 }}
            />
          </View>
        )}
      </CustomModal>

      {/* Individual Log Modal: Detailed view of a single log */}
      <CustomModal
        visible={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      >
        {selectedLog && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedLog.intention}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Mood:</Text>
              <Text style={styles.value}>{selectedLog.mood}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Outcome:</Text>
              <Text style={styles.value}>
                {selectedLog.outcome === null
                  ? "Not Completed"
                  : selectedLog.outcome}
              </Text>
            </View>

            {selectedLog?.actualDuration && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Duration:</Text>
                <Text style={styles.value}>
                  {selectedLog.actualDuration}m / {selectedLog.plannedDuration}m
                </Text>
              </View>
            )}

            {selectedLog?.energy && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Energy:</Text>
                <Text style={styles.value}>{selectedLog.energy}</Text>
              </View>
            )}

            <DefaultButton
              title="Close"
              onPress={() => setIsLogModalOpen(false)}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
      </CustomModal>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 16 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#888" },
  modalContent: { width: "100%" },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  modalSub: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontWeight: "600", color: "#444" },
  value: { color: "#222" },
});
