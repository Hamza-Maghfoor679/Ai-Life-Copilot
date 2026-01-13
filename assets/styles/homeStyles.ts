import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    justifyContent: 'space-evenly',
  },
  scoreContainer: {
    width: "100%",
    marginBottom: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    backgroundColor: "#2a3d56",
    alignItems: "center",
    borderRadius: 12,
    boxShadow: "0px 4px 8px 2px #00000033",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    textDecorationLine: 'underline'
  },
  name: {
    fontSize: 24,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    width: "100%",
    textAlign: "center",
  },
  trackText: {
    fontSize: 14,
    color: "#ff0000",
  },
  trackContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  textInput: {
    width: "100%",
    minHeight: 100,
    borderColor: "#2a3d56",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 16,
    padding: 18,
    textAlignVertical: "top",
    boxSizing: "border-box",
    fontSize: 18,
    boxShadow: "0px 2px 6px 4px #2a3d56",
  },
  moodTrackerContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  moodTrackerText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
    flexWrap: 'wrap'
  },
  moodButton: {
    padding: 12,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodButtonSelected: {
    borderColor: "#4CAF50",
  },
  moodEmoji: {
    fontSize: 28,
  },
});