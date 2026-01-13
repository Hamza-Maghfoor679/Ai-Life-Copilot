import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProgressCard = ({
  title,
  description,
  status,
  onPress,
}: {
  title: string;
  description?: string;
  status?: "Pending" | "In Progress" | "Completed" | "Not Started";
  onPress: () => void;
}) => {
  const statusConfig: Record<string, { color: string; icon: any; bgColor: string }> = {
    Pending: { color: "#f59e0b", icon: "time", bgColor: "#fef3c7" },
    "In Progress": { color: "#3b82f6", icon: "hourglass", bgColor: "#dbeafe" },
    Completed: { color: "#10b981", icon: "checkmark-circle", bgColor: "#d1fae5" },
    "Not Started": { color: "#94a3b8", icon: "close-circle", bgColor: "#f1f5f9" },
  };

  const config = status ? statusConfig[status] : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {status && config && (
          <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
            <Ionicons
              name={config.icon}
              size={13}
              color={config.color}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.statusText, { color: config.color }]}>
              {status}
            </Text>
          </View>
        )}
      </View>

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ProgressCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});