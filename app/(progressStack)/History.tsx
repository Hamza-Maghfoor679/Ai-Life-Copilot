import { historyLogs } from "@/constants/utils";
import DefaultButton from "@/src/reusables/Button";
import Header from "@/src/reusables/Header";
import InsightsCard from "@/src/reusables/InsightsCard";
import CustomModal from "@/src/reusables/Modal";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const History = () => {
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: any) => {
    setSelectedInsight(item);
    setIsModalOpen(true);
  };

  const renderHistoryItem = ({ item }: any) => (
    <InsightsCard
      title={item.title}
      description={item.description}
      time={item.time}
      status={item.status}
      onPress={() => handleOpenModal(item)}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Header initialText={"Progress History"} />
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={styles.sectionTitle}>Historical Progress</Text>
        
        <FlatList
          data={historyLogs}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

      <CustomModal 
        visible={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        {selectedInsight && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedInsight.title}</Text>
            
            <View style={styles.modalInfoRow}>
                <Text style={styles.modalTime}>{selectedInsight.time}</Text>
                <Text style={styles.modalStatus}>• {selectedInsight.status}</Text>
            </View>

            <Text style={styles.modalDescription}>
                {selectedInsight.description}
            </Text>
            <DefaultButton title="Close" onPress={()=>setIsModalOpen(false)} />
          </View>
        )}
      </CustomModal>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 22,
    color: "#333",
  },
  modalContent: {
    padding: 10,
    width: "100%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTime: {
    fontSize: 14,
    color: "#888",
    marginRight: 5,
  },
  modalStatus: {
    fontSize: 14,
    color: "#234C6A",
    fontWeight: "600",
  },
  modalDescription: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
  },
});