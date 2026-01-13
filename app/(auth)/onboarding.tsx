import { styles } from "@/assets/styles/onboardingStyles";
import {
  OnboardingCategory,
  onboardingQuestions,
} from "@/src/constants/categoryQuestions";
import { setAnswersInSlice } from '@/src/redux/slices/AnswersSlice';
import CategoryCard from "@/src/reusables/CategoryCard";
import CustomModal from "@/src/reusables/Modal";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const Onboarding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<OnboardingCategory | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [allAnswers, setAllAnswers] = useState<Record<string, string[]>>({});
  const dispatch = useDispatch()
  // Select a category and open modal
  const handleSelect = (item: OnboardingCategory) => {
    setSelectedCategory(item);
    setIsOpen(true);
    setCurrentQuestionIndex(0);

    const storedAnswers = allAnswers[item.id] || [];
    setAnswers(storedAnswers);
    setAnswer(storedAnswers[0] || "");
  };

  // Move to next question or finish category
  const handleNext = () => {
    if (!answer.trim()) {
      Alert.alert("Please enter an answer");
      return;
    }

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);
    dispatch(setAnswersInSlice({answer: answers}))

    if (selectedCategory && currentQuestionIndex + 1 < selectedCategory.questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setAnswer(updatedAnswers[nextIndex] || "");
    } else {
      if (selectedCategory) {
        setAllAnswers((prev) => ({
          ...prev,
          [selectedCategory.id]: updatedAnswers,
        }));
      }

      // Reset modal state
      setIsOpen(false);
      setSelectedCategory(null);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setAnswer("");
    }
  };

  // Previous question
  const handlePrevious = () => {
    if (currentQuestionIndex === 0) return;
    const prevIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prevIndex);
    setAnswer(answers[prevIndex] || "");
  };

  // Check if all questions completed
  const allCompleted = onboardingQuestions.every(
    (category) => allAnswers[category.id]?.length === category.questions.length
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          Choose a category that best describes you
        </Text>
      </View>

      {/* Category Grid */}
      <View style={styles.grid}>
        {onboardingQuestions.map((item) => (
          <CategoryCard
            key={item.id}
            categoryTitle={item.title}
            onPress={() => handleSelect(item)}
          />
        ))}
      </View>

      {/* User's Answers */}
      <ScrollView style={styles.answersContainer}>
        <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
          Your answers so far
        </Text>
        {Object.entries(allAnswers).map(([categoryId, answersArray]) => {
          const category = onboardingQuestions.find((c) => c.id === categoryId);
          return (
            <View key={categoryId} style={{ marginBottom: 16 }}>
              <Text style={styles.answerCategory}>{category?.title}:</Text>
              {answersArray.map((ans, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.answerCard}
                  onPress={() => {
                    setSelectedCategory(category || null);
                    setIsOpen(true);
                    setAnswers(answersArray);
                    setCurrentQuestionIndex(idx);
                    setAnswer(ans);
                  }}
                >
                  <Text>{ans}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Go to Login Button */}
      {allCompleted && (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      )}

      {/* Modal for Questions */}
      <CustomModal visible={isOpen} onClose={() => setIsOpen(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {selectedCategory?.questions[currentQuestionIndex]}
          </Text>

          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type your answer..."
            multiline
          />

          <View style={styles.buttonsContainer}>
            {currentQuestionIndex > 0 && (
              <TouchableOpacity
                style={styles.prevButton}
                onPress={handlePrevious}
              >
                <Text style={styles.prevButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {selectedCategory &&
                currentQuestionIndex + 1 === selectedCategory.questions.length
                  ? "Finish"
                  : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

export default Onboarding;
