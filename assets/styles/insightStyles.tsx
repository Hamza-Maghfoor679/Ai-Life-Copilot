import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginVertical: 16,
    color: "#0f172a",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  sparkleIcon: {
    marginRight: 8,
  },
  // --- Modal Specific Styles ---
  modalContent: {
    padding: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#234C6A",
    textAlign: "center",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 8,
  },
  modalStatus: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
  },
  descriptionBox: {
    borderRadius: 12,
    width: "100%",
    backgroundColor: "#f0f5ff",
    padding: 14,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
  },
});
