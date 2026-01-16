import { styles } from "@/assets/styles/intentionsStyle";
import DefaultButton from "@/src/reusables/Button";
import CustomModal from "@/src/reusables/Modal";
import React, { useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IntentionModalProps } from "../types/utils.types";

const durationOptions = [1, 2, 3, 4, 5, 6, 7, 8];
const difficultyOptions = ["Easy", "Medium", "Hard"];

const FIELD_CONTAINER = styles.fieldContainer;
const LABEL = styles.label;
const INPUT_BOX = styles.inputBox;
const DROPDOWN_BOX = styles.dropdownBox;
const DROPDOWN_ITEM = styles.dropdownItem;
const DROPDOWN_SELECTED = styles.dropdownSelected;

export const IntentionModal = ({
  visible,
  onClose,
  plannedDuration,
  difficulty,
  notes,
  onSetIntention,
  onDurationChange,
  onDifficultyChange,
  onNotesChange,
  loading,
}: IntentionModalProps) => {
  const [durationDropdownOpen, setDurationDropdownOpen] =
    useState<boolean>(false);
  const [difficultyDropdownOpen, setDifficultyDropdownOpen] =
    useState<boolean>(false);

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <ScrollView
        style={{ maxHeight: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: "center" }}>
          {/* Header */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Add Details for Your Intention
          </Text>

          {/* Planned Duration */}
          <View style={FIELD_CONTAINER}>
            <Text style={LABEL}>Planned Duration (hours)</Text>

            <TouchableOpacity
              onPress={() => setDurationDropdownOpen(!durationDropdownOpen)}
              style={INPUT_BOX}
            >
              <Text style={{ color: plannedDuration ? "#000" : "#999" }}>
                {plannedDuration
                  ? `${plannedDuration} hour${plannedDuration !== 1 ? "s" : ""}`
                  : "Select duration"}
              </Text>
            </TouchableOpacity>

            {durationDropdownOpen && (
              <View style={DROPDOWN_BOX}>
                <ScrollView style={{ maxHeight: 180 }}>
                  {durationOptions.map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      onPress={() => {
                        onDurationChange(duration);
                        setDurationDropdownOpen(false);
                      }}
                      style={[
                        DROPDOWN_ITEM,
                        plannedDuration === duration && DROPDOWN_SELECTED,
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight:
                            plannedDuration === duration ? "600" : "400",
                        }}
                      >
                        {duration} hour{duration !== 1 ? "s" : ""}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Difficulty */}
          <View style={FIELD_CONTAINER}>
            <Text style={LABEL}>Difficulty Level</Text>

            <TouchableOpacity
              onPress={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}
              style={INPUT_BOX}
            >
              <Text style={{ color: difficulty ? "#000" : "#999" }}>
                {difficulty || "Select difficulty"}
              </Text>
            </TouchableOpacity>

            {difficultyDropdownOpen && (
              <View style={DROPDOWN_BOX}>
                {difficultyOptions.map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => {
                      onDifficultyChange(level);
                      setDifficultyDropdownOpen(false);
                    }}
                    style={[
                      DROPDOWN_ITEM,
                      difficulty === level && DROPDOWN_SELECTED,
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: difficulty === level ? "600" : "400",
                      }}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Notes */}
          <View style={FIELD_CONTAINER}>
            <Text style={LABEL}>Additional Notes (Optional)</Text>
            <TextInput
              value={notes}
              onChangeText={onNotesChange}
              multiline
              placeholder="Add any notes (this helps track your progress)"
              style={[
                INPUT_BOX,
                {
                  minHeight: 90,
                  textAlignVertical: "top",
                },
              ]}
              placeholderTextColor="#999"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          {/* Button */}
          <DefaultButton
            loading={loading}
            title="Set Intention"
            style={{
              width: "100%",
              marginTop: 8,
              borderRadius: 14,
            }}
            onPress={onSetIntention}
          />
        </View>
      </ScrollView>
    </CustomModal>
  );
};
