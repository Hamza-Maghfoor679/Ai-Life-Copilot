import { Log } from "@/app/types/utils";
import { localStyles } from "@/assets/styles/progressStyle";
import { auth, db } from "@/src/config/firebase";
import CustomModal from "@/src/reusables/Modal";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DefaultButton from "./Button";

const emojis: Record<string, string> = {
  neutral: "😐",
  happy: "😃",
  sad: "😔",
  angry: "😡",
  tired: "😓",
  low: "🔋",
  medium: "⚡",
  high: "🚀",
};

const StatRow = ({ label, value }: { label: string; value: any }) => (
  <View style={localStyles.metaRow}>
    <Text style={localStyles.metaLabel}>{label}</Text>
    <Text style={localStyles.metaValue}>{value}</Text>
  </View>
);

const LogDetailModal = ({
  visible,
  item,
  onClose,
}: {
  visible: boolean;
  item: Log | null;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [form, setForm] = useState({
    duration: 30,
    energy: null as string | null,
    quality: 0,
    outcome: null as string | null,
  });

  if (!item) return null;

  // Simplified debug - check user's logs subcollection

  const handleSave = async () => {
  if (!item.id)
    return Alert.alert("Error", "Document ID is missing. Cannot update.");
  if (!form.energy || !form.quality || !form.outcome)
    return Alert.alert("Required", "Please fill all fields.");

  setLoading(true);
  try {
    console.log("Attempting update...");
    console.log("User UID:", auth.currentUser?.uid);
    console.log("Document ID:", item.id.trim());
    
    const logRef = doc(db, "dailyLogs", item.id.trim());
    
    // Don't check if document exists - just try to update directly
    await updateDoc(logRef, {
      outcome: form.outcome,
      actualDuration: form.duration,
      energy: form.energy,
      completionQuality: form.quality,
      completedAt: new Date().toISOString(),
    });

    console.log("✓ Update successful!");
    Alert.alert("Success", "Updated successfully!");
    setIsForm(false);
    onClose();
    
  } catch (e: any) {
    console.error("Error code:", e.code);
    console.error("Error message:", e.message);
    
    // If update fails, it might be a permission issue
    if (e.code === "permission-denied") {
      Alert.alert("Permission Error", "You don't have permission to update this document. Make sure you created it.");
    } else if (e.code === "not-found") {
      Alert.alert("Not Found", "The document doesn't exist. It may have been deleted.");
    } else {
      Alert.alert("Error", e.message);
    }
  } finally {
    setLoading(false);
  }
};

  if (isForm)
    return (
      <CustomModal visible={visible} onClose={onClose}>
        <ScrollView style={localStyles.modalContent}>
          <Text style={localStyles.modalTitle}>Complete Task</Text>
          <View style={localStyles.formSection}>
            <Text style={localStyles.formLabel}>Duration (min) *</Text>
            <View style={localStyles.inputContainer}>
              <TouchableOpacity
                onPress={() =>
                  setForm((f) => ({
                    ...f,
                    duration: Math.max(0, f.duration - 30),
                  }))
                }
                style={localStyles.durationButton}
              >
                <Text>−</Text>
              </TouchableOpacity>
              <Text style={localStyles.durationValue}>{form.duration}</Text>
              <TouchableOpacity
                onPress={() =>
                  setForm((f) => ({ ...f, duration: f.duration + 30 }))
                }
                style={localStyles.durationButton}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {[
            {
              label: "Energy Level",
              key: "energy",
              opts: ["low", "medium", "high"],
            },
            {
              label: "Outcome",
              key: "outcome",
              opts: ["completed", "partial", "missed"],
            },
          ].map((sec) => (
            <View key={sec.key} style={localStyles.formSection}>
              <Text style={localStyles.formLabel}>{sec.label} *</Text>
              <View style={localStyles.optionContainer}>
                {sec.opts.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setForm((f) => ({ ...f, [sec.key]: opt }))}
                    style={[
                      localStyles.optionButton,
                      form[sec.key as keyof typeof form] === opt &&
                        localStyles.optionButtonSelected,
                    ]}
                  >
                    {sec.key === "energy" && (
                      <Text style={localStyles.optionEmoji}>{emojis[opt]}</Text>
                    )}
                    <Text>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <Text style={localStyles.formLabel}>Quality *</Text>
          <View style={localStyles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setForm((f) => ({ ...f, quality: s }))}
                style={[
                  localStyles.starButton,
                  form.quality >= s && localStyles.starButtonFilled,
                ]}
              >
                <Text>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          <DefaultButton
            title="Cancel"
            onPress={() => setIsForm(false)}
            style={{ backgroundColor: "#9CA3AF", marginVertical: 10 }}
          />
          <DefaultButton
            title={loading ? "Saving..." : "Save & Complete"}
            onPress={handleSave}
            style={{ backgroundColor: "#10b981" }}
            disabled={loading}
          />
        </ScrollView>
      </CustomModal>
    );

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <View style={localStyles.modalContent}>
        <View
          style={[
            localStyles.statusBadge,
            { backgroundColor: item.outcome ? "#10b981" : "#6C5CE7" },
          ]}
        >
          <Text style={localStyles.statusText}>
            {item.outcome ? "Completed" : "In Progress"}
          </Text>
        </View>
        <Text style={localStyles.modalTitle}>{item.intention}</Text>
        <View style={localStyles.metaContainer}>
          <StatRow label="Planned" value={`${item.plannedDuration || 0} min`} />
          {item.actualDuration && (
            <StatRow label="Actual" value={`${item.actualDuration} min`} />
          )}
          <StatRow label="Mood" value={emojis[item.mood as string] || "❓"} />
          <StatRow label="Status" value={item.outcome || "Not Completed"} />
        </View>
        {!item.outcome && (
          <DefaultButton
            title="Mark as Complete"
            onPress={() => setIsForm(true)}
            style={{ marginBottom: 10, backgroundColor: "#10b981" }}
          />
        )}
        <DefaultButton
          title="Close"
          onPress={onClose}
          style={{ backgroundColor: "#6B7280" }}
        />
      </View>
    </CustomModal>
  );
};

export default LogDetailModal;
