import { styles } from "@/assets/styles/MajorComponentStyling/onboardingStyling";
import { OnboardingCategory } from "@/src/constants/categoryQuestions";
import React, { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  category: OnboardingCategory | null;
  onClose: () => void;
  onSave: (categoryId: string, selectedIndices: number[]) => void;
  initialIndices: number[];
}

export const OnboardingSliderModal = ({
  visible,
  category,
  onClose,
  onSave,
  initialIndices,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  useEffect(() => {
    if (visible) {
      setSelectedValues(initialIndices);
    }
  }, [visible, initialIndices]);

  if (!category) return null;

  const isMultiSelect = category.type === "focusAreas";

  const handleOptionPress = (index: number) => {
    if (isMultiSelect) {
      setSelectedValues((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedValues([index]);
    }
  };

  const handleSave = () => {
    onSave(category.id, selectedValues);
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalWrapper}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
              >
                <View style={styles.header}>
                  <Text style={styles.title}>{category.title}</Text>
                  <Pressable onPress={onClose}>
                    <Text style={styles.closeButton}>✕</Text>
                  </Pressable>
                </View>

                <Text style={styles.question}>{category.question}</Text>

                <View style={styles.optionsContainer}>
                  {category.options.map((option, index) => {
                    const isSelected = selectedValues.includes(index);
                    return (
                      <Pressable
                        key={index}
                        onPress={() => handleOptionPress(index)}
                        style={[
                          styles.optionCard,
                          isSelected && styles.optionCardSelected,
                        ]}
                      >
                        <View style={styles.optionContent}>
                          <View
                            style={[
                              styles.checkbox,
                              isSelected && styles.checkboxSelected,
                            ]}
                          >
                            {isSelected && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </View>
                          <Text
                            style={[
                              styles.optionLabel,
                              isSelected && styles.optionLabelSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.actions}>
                  <Pressable
                    onPress={onClose}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleSave}
                    disabled={!selectedValues.length}
                    style={[
                      styles.button,
                      styles.saveButton,
                      !selectedValues.length &&
                        styles.saveButtonDisabled,
                    ]}
                  >
                    <Text style={styles.saveText}>Save Selection</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
