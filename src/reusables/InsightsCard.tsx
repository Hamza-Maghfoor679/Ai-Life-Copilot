import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InsightsCardProps {
  title?: string;
  description?: string;
  time: string;
  status?: "Pending" | "Completed" | "In Progress";
  onPress?: () => void;
}

const InsightsCard = ({
  title,
  description,
  time,
  status,
  onPress,
}: InsightsCardProps) => {
  // Status color mapping
  const statusColors: Record<string, string> = {
    Pending: "#f59e0b",
    Completed: "#10b981",
    "In Progress": "#3b82f6",
  };
  return (
    <TouchableOpacity style={[styles.card, styles.aiCard]} onPress={onPress}>
      {/* Indicator dot */}
      

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
          <Ionicons name="sparkles" size={15} style={{marginHorizontal: 2}} />
          {status && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors[status] || "#ccc" },
              ]}
            >
              <Text style={styles.statusText}>{status}</Text>
            </View>
          )}
        </View>

        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.cardTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default InsightsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    minHeight: 100,
    borderLeftWidth: 5,
    borderLeftColor: "#234C6A",
  },
  aiCard: {
    backgroundColor: "#f8faff",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#234C6A",
    marginTop: 6,
    marginRight: 12,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  cardDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
});