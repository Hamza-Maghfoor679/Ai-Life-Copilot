import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: "#234C6A",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
    lineHeight: 22,
  },
  footer: {
    height: 70,
    backgroundColor: "#234C6A",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1e3a52",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 5,
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

// MODAL STYLES
export const localStyles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 14,
    textAlign: 'center'
  },

  statusBadge: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },

  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.4,
  },

  /* 🔹 Meta section */
  metaContainer: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },

  metaLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },

  metaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2a3652",
  },

  modalDescription: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 26,
  },

  closeButton: {
    backgroundColor: "#234C6A",
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    shadowColor: "#234C6A",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.6,
  },
  // Form Sections
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },

  // Input Container
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  durationButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  durationButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  durationValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    minWidth: 60,
    textAlign: "center",
  },

  // Option Container (Energy Level)
  optionContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#5e6d8a",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  optionButtonSelected: {
    backgroundColor: "#46cda0",
    borderColor: "#10B981",
  },
  optionEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },

  // Rating Container (Stars)
  ratingContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    justifyContent: "center",
  },
  starButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#b7c1d7",
    borderWidth: 2,
    borderColor: "#5a667d",
  },
  starButtonFilled: {
    backgroundColor: "#3f4758",
    borderColor: "#FCD34D",
  },
  star: {
    fontSize: 24,
    color: "#f8ff25",
  },
  qualityText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },

 

  // Button Container
  buttonContainer: {
    marginTop: 24,
    gap: 10,
  },
});
