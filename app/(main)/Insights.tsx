import { styles } from "@/assets/styles/insightStyles";
import { aiInsights } from "@/constants/utils";
import DefaultButton from "@/src/reusables/Button";
import Header from "@/src/reusables/Header";
import InsightsCard from "@/src/reusables/InsightsCard";
import CustomModal from "@/src/reusables/Modal";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";

const Insights = () => {
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: any) => {
    setSelectedInsight(item);
    setIsModalOpen(true);
  };

  const renderAIInsightItem = ({ item }: any) => (
    <InsightsCard
      title={item.title}
      description={item.description}
      time={item.time}
      status={item.status}
      onPress={() => handleOpenModal(item)}
    />
  );

   return (
    <>
      <Header initialText={"Seven Days Report"} />
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
        <FlatList
          data={aiInsights}
          renderItem={renderAIInsightItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        />
      </View>

      <CustomModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedInsight && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedInsight.title}</Text>

            <View style={styles.badgeRow}>
              <Text style={styles.modalTime}>{selectedInsight.time}</Text>
              <View style={styles.dot} />
              <Text style={styles.modalStatus}>{selectedInsight.status}</Text>
            </View>

            <View style={styles.descriptionBox}>
              <Text style={styles.modalDescription}>
                {selectedInsight.description}
              </Text>
            </View>
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
