import { styles } from "@/assets/styles/homeStyles";
import { auth, db } from "@/src/config/firebase";
import { createDailyLog } from "@/src/helper/saveLog";
import { cleanUndefined } from "@/src/helper/unwantedFields";
import { updateWeeklyScore } from "@/src/redux/slices/UserSlice";
import { RootState } from "@/src/redux/store";
import DefaultButton from "@/src/reusables/Button";
import SemiCircleGauge from "@/src/reusables/Gauge";
import Header from "@/src/reusables/Header";
import { IntentionModal } from "@/src/reusables/IntentionModal";
import { Timestamp, collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const MainIndex = () => {
  const dispatch = useDispatch();

  // State for Intentions
  const [intention, setIntention] = useState("");
  const [plannedDuration, setPlannedDuration] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redux Data
  const user = useSelector((state: RootState) => state.user.user);
  const currentScore = useSelector(
    (state: RootState) => state.user.user?.currentScore || 0
  );

  // --- Real-time Score Listener ---
  useEffect(() => {
    if (!user?.uid) return;

    // Listen to the user document for live score updates
    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Sync the score from Firebase to Redux
          if (data.weeklyScore !== undefined) {
            dispatch(updateWeeklyScore(data.weeklyScore));
          }
        }
      },
      (error) => {
        console.error("Error listening to score updates:", error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, dispatch]);

  const handleOpenModal = () => setIsOpen(true);

const handleSetIntention = async () => {
  if (!user || !plannedDuration) return;
  
  // Add this guard
  if (!auth.currentUser?.uid) {
    return Alert.alert("Error", "User not authenticated");
  }

  const difficultyMap: Record<string, "easy" | "medium" | "hard"> = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
  };

  const moodMap = ["happy", "neutral", "sad", "angry", "tired"] as const;
  const logRef = doc(collection(db, "dailyLogs"));

  const dailyLog = cleanUndefined({
    id: logRef.id,
    userId: auth.currentUser.uid,
    date: new Date().toISOString().split("T")[0],
    intention,
    plannedDuration: plannedDuration * 60,
    outcome: null,
    difficulty: difficulty ? difficultyMap[difficulty] : undefined,
    mood: selectedMood !== null ? moodMap[selectedMood] : undefined,
    notes: notes.trim() ? notes : undefined,
    completionQuality: null,
    actualDuration: null,
    createdAt: Timestamp.now(),
  });

  try {
    setIsLoading(true);
    await createDailyLog(dailyLog);
    setIsOpen(false);
    setIntention("");
    setPlannedDuration(null);
    setDifficulty(null);
    setNotes("");
    setSelectedMood(null);
    setIsLoading(false);
    Alert.alert("Success", `Your intention "${intention}" has been saved.`);
  } catch (error) {
    console.error("Error saving daily log:", error);
    setIsLoading(false);
  }
};

  return (
    <>
      <Header initialText={`Welcome ${user?.name || "User"}`} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        enabled={!isOpen}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.scoreContainer}>
              <SemiCircleGauge
                radius={80}
                value={Number(currentScore)}
                maxValue={100}
              />
              <Text style={styles.scoreText}>Score: {currentScore}</Text>
              <Text style={styles.weeklyText}>
                Updated every 7 days based on your progress!
              </Text>
            </View>

            <Text style={styles.text}>What is your intention for today?</Text>
            <Text style={styles.trackText}>
              (Let’s see you deserve what you want!)
            </Text>

            <View style={styles.trackContainer}>
              <TextInput
                value={intention}
                onChangeText={setIntention}
                multiline
                placeholder="Write your desire here..."
                style={styles.textInput}
                placeholderTextColor="#1e2631"
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              <View style={styles.moodTrackerContainer}>
                <Text style={styles.moodTrackerText}>How are you feeling today?</Text>
                <View style={styles.moodRow}>
                  {["😃", "😐", "😔", "😡", "😓"].map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedMood(index)}
                      style={[
                        styles.moodButton,
                        selectedMood === index && styles.moodButtonSelected,
                      ]}
                    >
                      <Text style={styles.moodEmoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <DefaultButton
                  title="Lets Do It"
                  style={{
                    width: "100%",
                    marginTop: 16,
                    borderWidth: 2,
                    borderColor: "#000",
                  }}
                  onPress={handleOpenModal}
                  disabled={
                    intention.trim().length === 0 || selectedMood === null
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <IntentionModal
        loading={isLoading}
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        plannedDuration={plannedDuration}
        difficulty={difficulty}
        notes={notes}
        onSetIntention={handleSetIntention}
        onDurationChange={setPlannedDuration}
        onDifficultyChange={setDifficulty}
        onNotesChange={setNotes}
      />
    </>
  );
};

export default MainIndex;
