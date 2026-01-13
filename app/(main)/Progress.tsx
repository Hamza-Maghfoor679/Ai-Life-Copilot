import { localStyles, styles } from "@/assets/styles/progressStyle";
import { intentions } from "@/constants/utils";
import Header from "@/src/reusables/Header";
import CustomModal from "@/src/reusables/Modal"; // Import your Modal
import ProgressCard from "@/src/reusables/ProgressCard";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const Progress = () => {
  // 1. State for modal and selected data
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 2. Open modal handler
  const handlePressCard = (item: any) => {
    setSelectedItem(item);
    setIsModalVisible(true);
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

        <FlatList
          data={intentions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProgressCard
              title={item.title}
              description={item.description}
              status={item.status}
              // 3. Ensure ProgressCard accepts an onPress prop
              onPress={() => handlePressCard(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 4. The Modal */}
      <CustomModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)}
      >
        {selectedItem && (
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>{selectedItem.title}</Text>
            
            <View style={[
              localStyles.statusBadge, 
              { backgroundColor: selectedItem.status === 'Completed' ? '#10b981' : '#3b82f6' }
            ]}>
              <Text style={localStyles.statusText}>{selectedItem.status}</Text>
            </View>

            <Text style={localStyles.modalDescription}>
              {selectedItem.description}
            </Text>

            <TouchableOpacity 
              style={localStyles.closeButton} 
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={localStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </CustomModal>

      <TouchableOpacity 
        style={styles.footer} 
        onPress={() => router.push('/(progressStack)/History')}
      >
        <Text style={styles.footerText}>History</Text>
      </TouchableOpacity>
    </View>
  );
};


export default Progress;