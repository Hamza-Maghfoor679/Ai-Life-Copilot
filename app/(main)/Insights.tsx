import { styles } from "@/assets/styles/insightStyles";
import { auth } from "@/src/config/firebase";
import { useWeeklyReport } from "@/src/hooks/useWeeklyReport";
import DefaultButton from "@/src/reusables/Button";
import Header from "@/src/reusables/Header";
import InsightsCard from "@/src/reusables/InsightsCard";
import CustomModal from "@/src/reusables/Modal";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Insights = () => {
  const userId = auth.currentUser?.uid;
  const { latestReport, loading, error, generate, fetchLatest, formatted } =
    useWeeklyReport();
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (userId) fetchLatest(userId);
  }, [userId]);

  const handleGenerateReport = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    await generate(userId);
    Alert.alert("Success", "Report generated!");
  };

  const insightsData = formatted?.insights.map((insight, idx) => ({
    id: idx.toString(),
    title: insight,
    description: formatted.recommendation,
    time: formatted.generatedAt,
    status: formatted.consistencyLevel,
  })) || [];

  const renderInsight = ({ item }: any) => (
    <InsightsCard
      title={item.title}
      description={item.description}
      time={item.time}
      status={item.status}
      onPress={() => {
        setSelectedInsight(item);
        setIsModalOpen(true);
      }}
    />
  );

  return (
    <>
      <Header initialText={"Weekly Reports"} />
      <View style={styles.container}>
        {/* Report Section */}
        <TouchableOpacity
          onPress={handleGenerateReport}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "#007AFF",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
              Generate Weekly Report
            </Text>
          )}
        </TouchableOpacity>

        {error && (
          <View
            style={{
              backgroundColor: "#FFEBEE",
              padding: 10,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#C70039", fontSize: 12 }}>⚠️ {error}</Text>
          </View>
        )}

        {latestReport && (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: "#34C759",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#34C759" }}>
              {latestReport.weeklyScore}/100
            </Text>
            <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              {latestReport.consistencyLevel.toUpperCase()}
            </Text>
            <TouchableOpacity
              onPress={() => setShowReportModal(true)}
              style={{
                backgroundColor: "#234C6A",
                padding: 8,
                borderRadius: 6,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 12, textAlign: "center" }}>
                View Full Report
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Insights */}
        <View style={styles.sectionTitle}>
          <Ionicons name="sparkles" size={28} color="#234C6A" />
          <Text>AI Insights</Text>
        </View>

        {insightsData.length > 0 ? (
          <FlatList
            data={insightsData}
            renderItem={renderInsight}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={{ textAlign: "center", color: "#999", marginTop: 20 }}>
            No insights yet. Generate a report first.
          </Text>
        )}
      </View>

      {/* Insight Modal */}
      <CustomModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedInsight && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedInsight.title}</Text>
            <View style={styles.descriptionBox}>
              <Text style={styles.modalDescription}>
                {selectedInsight.description}
              </Text>
            </View>
            <DefaultButton
              title="Close"
              onPress={() => setIsModalOpen(false)}
            />
          </View>
        )}
      </CustomModal>

      {/* Full Report Modal */}
      <CustomModal visible={showReportModal} onClose={() => setShowReportModal(false)}>
        {formatted && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📊 Weekly Report</Text>
            
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#34C759" }}>
                Score: {formatted.weeklyScore}
              </Text>
              <Text style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                Completion: {formatted.completion}
              </Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                Effort: {formatted.effort}
              </Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                Quality: {formatted.quality}
              </Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                Difficulty: {formatted.difficulty}
              </Text>
            </View>

            <Text style={{ fontSize: 12, fontWeight: "600", marginBottom: 6 }}>
              💡 Insights:
            </Text>
            {formatted.insights.map((i: string, idx: number) => (
              <Text key={idx} style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>
                • {i}
              </Text>
            ))}

            <Text style={{ fontSize: 12, fontWeight: "600", marginTop: 10, marginBottom: 6 }}>
              📌 Recommendation:
            </Text>
            <Text style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>
              {formatted.recommendation}
            </Text>

            <DefaultButton
              title="Close"
              onPress={() => setShowReportModal(false)}
            />
          </View>
        )}
      </CustomModal>
    </>
  );
};

export default Insights;