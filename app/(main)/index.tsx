import { styles } from "@/assets/styles/homeStyles";
import { RootState } from "@/src/redux/store";
import DefaultButton from "@/src/reusables/Button";
import SemiCircleGauge from "@/src/reusables/Gauge";
import Header from "@/src/reusables/Header";
import CustomModal from "@/src/reusables/Modal";
import { useState } from "react";
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
import { useSelector } from "react-redux";

const MainIndex = () => {
  const [intention, setIntention] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user?.user);

  const handleIntention = () => {
    setIsOpen(true);
  };

  const handleDesc = () => {
    Alert.alert(
      "Intention Set",
      `Your intention: ${intention}\nDescription: ${description}\nMood: ${
        selectedMood !== null
          ? ["😃", "😐", "😔", "😡", "😓"][selectedMood]
          : "Not set"
      }`
    );
    setIsOpen(false);
    setIntention("");
    setDescription("");
    setSelectedMood(null);
  };
  const value = 20;

  return (
    <>
      <Header initialText={`Welcome ${user?.name}`} />

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
              <SemiCircleGauge radius={80} value={value} maxValue={100} />
              <Text style={styles.scoreText}>Score: {value}</Text>
            </View>
            <Text style={styles.text}>What is your intention for today?</Text>
            <Text style={styles.trackText}>
              (Lets see how strongly do you want it!)
            </Text>
            <View style={styles.trackContainer}>
              <TextInput
                value={intention}
                onChange={(e) => setIntention(e.nativeEvent.text)}
                multiline
                placeholder="Write you desire here..."
                style={styles.textInput}
                placeholderTextColor={"#1e2631"}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              <View style={styles.moodTrackerContainer}>
                <Text style={styles.moodTrackerText}>Mood Tracker</Text>
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
                  style={{ width: "100%", marginTop: 16, borderWidth: 2, borderColor: '#000000' }}
                  onPress={handleIntention}
                  disabled={
                    intention.trim().length === 0 || selectedMood === null
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomModal visible={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <View style={{ alignItems: "center", minHeight: 100 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Do you want to add description for your intention? (Optional)
          </Text>
          <Text
            style={{
              marginTop: 12,
              fontSize: 15,
              textAlign: "center",
            }}
          >
            (This will help us to understand your intention better and provide
            more accurate insights.)
          </Text>
          <TextInput
            value={description}
            onChange={(e) => setDescription(e.nativeEvent.text)}
            multiline
            placeholder="Write your intention description here..."
            style={styles.textInput}
            placeholderTextColor={"#1e2631"}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <DefaultButton
            title="Set Intention"
            style={{ width: "100%", marginTop: 16 }}
            onPress={handleDesc}
          />
        </View>
      </CustomModal>
    </>
  );
};

export default MainIndex;
