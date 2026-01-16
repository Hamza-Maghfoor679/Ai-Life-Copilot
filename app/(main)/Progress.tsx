import { styles } from "@/assets/styles/progressStyle";
import { auth, db } from "@/src/config/firebase";
import Header from "@/src/reusables/Header";
import LogDetailModal from "@/src/reusables/LogDetailModal";
import ProgressCard from "@/src/reusables/ProgressCard";
import { router } from "expo-router";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Log } from "../types/utils";

type StatusType =
  | "Completed"
  | "Partial Completed"
  | "Missed"
  | "Not Completed"
  | undefined;

const Progress = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Log | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    let unsubscribeLogs: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      // Kill any existing listener if the user changes
      if (unsubscribeLogs) unsubscribeLogs();

      if (!user) {
        setLogs([]);
        setLoading(false);
        return;
      }

      // Use auth.currentUser.uid directly instead of user.uid
      const currentUserId = user.uid;
      console.log("Fetching logs for user:", currentUserId);

      const logsRef = collection(db, "dailyLogs");
      const q = query(logsRef, where("userId", "==", currentUserId));

      unsubscribeLogs = onSnapshot(
        q,
        (querySnapshot) => {
          const uniqueDataMap = new Map();

          querySnapshot.docs.forEach((doc) => {
            uniqueDataMap.set(doc.id, {
              id: doc.id,
              ...doc.data(),
            });
          });

          const fetchedLogs = Array.from(uniqueDataMap.values()) as Log[];

          // Sort by timestamp
          fetchedLogs.sort((a, b) => {
            const timeA =
              a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
            const timeB =
              b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });

          console.log("Fetched logs:", fetchedLogs.length);
          setLogs(fetchedLogs);
          setLoading(false);
        },
        (error) => {
          console.error("Firestore Listener Error:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeLogs) unsubscribeLogs();
    };
  }, []);

  const mapOutcomeToStatus = (outcome?: string | null): StatusType => {
    const map: Record<string, StatusType> = {
      completed: "Completed",
      partial: "Partial Completed",
      missed: "Missed",
    };
    return map[outcome || ""] || "Not Completed";
  };

  return (
    <View style={styles.container}>
      <Header initialText={"Track your Desires"} />

      <View style={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Your Daily Intentions Progress will be marked here
          </Text>
        </View>

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
                onPress={() => {
                  setSelectedItem(item);
                  setIsModalVisible(true);
                }}
                mood={`Difficulty: ${item.difficulty || "N/A"}`}
              />
            )}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text style={{ color: "#999" }}>No daily logs found yet.</Text>
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