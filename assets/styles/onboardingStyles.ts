import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb", // soft background
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#6b7280",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  // Modal styles
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  question: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#f9fafb",
    fontSize: 16,
  },

  // Buttons
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: "#1f2933",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  prevButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  prevButtonText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },

  // Answers display
  answerCard: {
    backgroundColor: "#f3f4f6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
  },
  answerCategory: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 6,
    color: "#111827",
  },

  // ScrollView container for answers
  answersContainer: {
    marginTop: 30,
    maxHeight: 300,
  },

  // Login button
  loginButton: {
    backgroundColor: "#1f2933",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
