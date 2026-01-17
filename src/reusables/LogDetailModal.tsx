import { localStyles } from "@/assets/styles/progressStyle";
import { db } from "@/src/config/firebase";
import CustomModal from "@/src/reusables/Modal";
import { FontAwesome } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DailyLog } from "../schemas/dailyLogsSchema";
import DefaultButton from "./Button";

const EMOJIS = {
  neutral: "😐",
  happy: "😃",
  sad: "😔",
  angry: "😡",
  tired: "😓",
  low: "🔋",
  medium: "⚡",
  high: "🚀",
};
const FORM_SECTIONS = [
  { label: "Energy Level", key: "energy", opts: ["low", "medium", "high"] },
  {
    label: "Outcome",
    key: "outcome",
    opts: ["completed", "partial", "missed"],
  },
];

const StatRow = ({ label, value }: { label: string; value: any }) => (
  <View style={localStyles.metaRow}>
    <Text style={localStyles.metaLabel}>{label}</Text>
    <Text style={localStyles.metaValue}>{value}</Text>
  </View>
);

const DurationControl = ({
  duration,
  onChange,
}: {
  duration: number;
  onChange: (d: number) => void;
}) => (
  <View style={localStyles.formSection}>
    <Text style={localStyles.formLabel}>Duration (min) *</Text>
    <View style={localStyles.inputContainer}>
      <TouchableOpacity
        onPress={() => onChange(Math.max(0, duration - 30))}
        style={localStyles.durationButton}
      >
        <FontAwesome name="minus-circle" size={20} color={"white"} />
      </TouchableOpacity>
      <Text style={localStyles.durationValue}>{duration}</Text>
      <TouchableOpacity
        onPress={() => onChange(duration + 30)}
        style={localStyles.durationButton}
      >
        <FontAwesome name="plus-circle" size={20} color={"white"} />
      </TouchableOpacity>
    </View>
  </View>
);

const OptionSection = ({ section, selectedValue, onSelect }: any) => (
  <View style={localStyles.formSection}>
    <Text style={localStyles.formLabel}>{section.label} *</Text>
    <View style={localStyles.optionContainer}>
      {section.opts.map((opt: string) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onSelect(section.key, opt)}
          style={[
            localStyles.optionButton,
            selectedValue === opt && localStyles.optionButtonSelected,
          ]}
        >
          {section.key === "energy" && (
            <Text style={localStyles.optionEmoji}>
              {EMOJIS[opt as keyof typeof EMOJIS]}
            </Text>
          )}
          <Text style={selectedValue === opt && { color: "white" }}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const RatingSection = ({
  quality,
  onRate,
}: {
  quality: number;
  onRate: (q: number) => void;
}) => (
  <View>
    <Text style={localStyles.formLabel}>Quality *</Text>
    <View style={localStyles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => onRate(s)}
          style={[
            localStyles.starButton,
            quality >= s && localStyles.starButtonFilled,
          ]}
        >
          <Text style={{ color: "#ffff00", fontSize: 25 }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const LogDetailModal = ({
  visible,
  item,
  onClose,
}: {
  visible: boolean;
  item: DailyLog | null;
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

  const handleSave = async () => {
    if (!item.id || !form.energy || !form.quality || !form.outcome) {
      return Alert.alert(
        "Error",
        form.energy ? "Please fill all fields." : "Document ID missing."
      );
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "dailyLogs", item.id.trim()), {
        outcome: form.outcome,
        actualDuration: form.duration,
        energy: form.energy,
        completionQuality: form.quality,
        completedAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Updated successfully!");
      setIsForm(false);
      onClose();
    } catch (e: any) {
      Alert.alert(
        "Error",
        e.code === "permission-denied"
          ? "Permission denied."
          : e.code === "not-found"
          ? "Document not found."
          : e.message
      );
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (isForm)
    return (
      <CustomModal visible={visible} onClose={onClose}>
        <ScrollView style={localStyles.modalContent}>
          <Text style={localStyles.modalTitle}>Complete Task</Text>
          <DurationControl
            duration={form.duration}
            onChange={(d) => updateForm("duration", d)}
          />
          {FORM_SECTIONS.map((sec) => (
            <OptionSection
              key={sec.key}
              section={sec}
              selectedValue={form[sec.key as keyof typeof form]}
              onSelect={(k: string, v: string) => updateForm(k, v)}
            />
          ))}
          <RatingSection
            quality={form.quality}
            onRate={(q) => updateForm("quality", q)}
          />
          <DefaultButton
            title="Cancel"
            onPress={() => setIsForm(false)}
            style={{ backgroundColor: "#9CA3AF", marginVertical: 10 }}
          />
          <DefaultButton
            title={loading ? "Saving..." : "Save & Complete"}
            onPress={handleSave}
            disabled={loading}
            backgroundColor="#1F2937"
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
          <StatRow
            label="Planned Duration"
            value={`${item.plannedDuration || 0} min`}
          />
          {item.actualDuration && (
            <StatRow label="Actual" value={`${item.actualDuration} min`} />
          )}
          <StatRow
            label="Mood"
            value={EMOJIS[item.mood as keyof typeof EMOJIS] || "❓"}
          />
          <StatRow
            label="Status"
            value={
              item.outcome === "completed"
                ? "Completed"
                : item.outcome === "partial"
                ? "Partial Completed"
                : item.outcome === "missed"
                ? "Missed"
                : "In Progress"
            }
          />
          {item.energy && (
            <StatRow label="Energy" value={item.energy || "Not Completed"} />
          )}
          <StatRow
            label="Difficulty"
            value={item.difficulty || "Not Completed"}
          />
          <StatRow label="Notes" value={item.notes || "Not Provided"} />
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
