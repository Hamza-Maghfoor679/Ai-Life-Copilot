import { styles } from "@/assets/styles/insightStyles";
import { auth, db } from "@/src/config/firebase";
import DefaultButton from "@/src/reusables/Button";
import Header from "@/src/reusables/Header";
import InsightsCard from "@/src/reusables/InsightsCard";
import CustomModal from "@/src/reusables/Modal";
import { WeeklyReports } from "@/src/schemas/weeklyReportsSchema";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const Insights = () => {
  const [selectedInsight, setSelectedInsight] = useState<WeeklyReports | null>(
    null
  );
  console.log("selectedInsight>>>>>>", selectedInsight);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<WeeklyReports[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeReports: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (unsubscribeReports) unsubscribeReports();

      if (!user) {
        setReports([]);
        setLoading(false);
        return;
      }

      const currentUserId = user.uid;

      const reportsRef = collection(db, "weeklyReports");

      // Query to fetch weekly reports for this user
      const reportsQuery = query(
        reportsRef,
        where("userId", "==", currentUserId),
        orderBy("generatedAt", "desc") // latest reports first
      );

      unsubscribeReports = onSnapshot(
        reportsQuery,
        (querySnapshot) => {
          const fetchedReports: WeeklyReports[] = querySnapshot.docs.map(
            (doc) => {
              const data = doc.data();

              return {
                userId: data.userId,
                cycleStart: data.cycleStart as Timestamp,
                cycleEnd: data.cycleEnd as Timestamp,
                weeklyScore: data.weeklyScore,
                consistencyLevel: data.consistencyLevel,
                breakdown: data.breakdown,
                aiInsights: data.aiInsights || [],
                recommendation: data.recommendation || "",
                generatedAt: data.generatedAt as Timestamp,
              } as WeeklyReports;
            }
          );

          setReports(fetchedReports);
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
      if (unsubscribeReports) unsubscribeReports();
    };
  }, []);

  const handleOpenModal = (report: WeeklyReports) => {
    setSelectedInsight(report);
    setIsModalOpen(true);
  };

  const renderReportItem = ({ item }: { item: WeeklyReports }) => (
    <InsightsCard
      title={`Week of ${item.cycleStart.toDate().toLocaleDateString()}`}
      description={`Weekly Score: ${item.weeklyScore} • Consistency: ${item.consistencyLevel}`}
      time={item.generatedAt.toDate().toLocaleString()}
      onPress={() => handleOpenModal(item)}
    />
  );

  return (
    <>
      <Header initialText={"Weekly Reports"} />

      <View style={styles.container}>
        <View style={styles.sectionTitle}>
          <Ionicons
            name="sparkles"
            size={28}
            color="#234C6A"
            style={styles.sparkleIcon}
          />
          <Text>AI Insights (Last Seven Days)</Text>
        </View>

        {loading ? (
          <Text>Loading reports...</Text>
        ) : reports.length === 0 ? (
          <Text>No reports found yet.</Text>
        ) : (
          <FlatList
            data={reports}
            renderItem={renderReportItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          />
        )}
      </View>

      {/* Modal for AI Insights */}
      <CustomModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedInsight && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Week of {selectedInsight.cycleStart.toDate().toLocaleDateString()}
            </Text>

            <View style={styles.badgeRow}>
              <Text style={styles.modalTime}>
                Generated:{" "}
                {selectedInsight.generatedAt.toDate().toLocaleString()}
              </Text>
              <View style={styles.dot} />
            </View>
            <View style={styles.descriptionBox}>
              {
                <View>
                  <Text style={{textAlign: 'center', fontWeight: '700', marginVertical: 2}}>Weekly Score: {selectedInsight?.weeklyScore}</Text>
                  <Text style={{textAlign: 'center', fontWeight: '700', marginVertical: 2}}>Completion Score: {selectedInsight?.breakdown.completion}</Text>
                  <Text style={{textAlign: 'center', fontWeight: '700', marginVertical: 2}}>Effort Score: {selectedInsight?.breakdown.effort}</Text>
                  <Text style={{textAlign: 'center', fontWeight: '700', marginVertical: 2}}>Quality Score: {selectedInsight?.breakdown.quality}</Text>
                  <Text style={{textAlign: 'center', fontWeight: '700', marginVertical: 2}}>Difficulty Score: {selectedInsight?.breakdown.difficulty}</Text>
                </View>
              }
            </View>
            <View style={styles.descriptionBox}>
              <Ionicons name="sparkles" style={{alignSelf: 'center', marginVertical: 2}} size={20}/>

              {selectedInsight.aiInsights.map((insight, index) => (
                <Text key={index} style={styles.modalDescription}>
                  • {insight}
                </Text>
              ))}
            </View>

            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              Recommendation
            </Text>

            <Text style={[styles.recommendation, { fontWeight: "bold" }]}>
              {selectedInsight.recommendation}
            </Text>

            <DefaultButton
              title="Close"
              onPress={() => setIsModalOpen(false)}
              style={{ marginTop: 10, width: "100%" }}
            />
          </View>
        )}
      </CustomModal>
    </>
  );
};

export default Insights;
