import { Colors } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = width / 375; // Normalized scale based on standard iPhone width

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FE",
  },
  header: {
    paddingHorizontal: width * 0.06, // 6% of screen width
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 24,
  },
  heading: {
    fontSize: Math.round(24 * scale),
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Math.round(15 * scale),
    color: "#64748b",
    lineHeight: 22,
  },
  categoriesContainer: {
    paddingHorizontal: width * 0.06,
    gap: 16,
    flex: 1,
  },
  categoryCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    // Premium Shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  categoryCardActive: {
    borderColor: Colors.default.background,
    backgroundColor: "#fefeff",
  },
  categoryCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  categoryContent: {
    gap: 14,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  categoryNumber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F0FF",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryNumberDone: {
    backgroundColor: Colors.default.background,
  },
  categoryNumberText: {
    color: Colors.default.background,
    fontSize: 16,
    fontWeight: "700",
  },
  categoryNumberTextDone: {
    color: "#FFF",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.default.background,
    borderRadius: 10,
  },
  footer: {
    paddingHorizontal: width * 0.06,
    paddingVertical: 24,
    backgroundColor: "#F8F9FE",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  continueButton: {
    backgroundColor: Colors.default.background,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  continueButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});