import { styles } from "@/assets/styles/authStackStyles/onboardingStyles";
import {
  onboardingCategories,
  OnboardingCategory,
} from "@/src/constants/categoryQuestions";
import { OnboardingSliderModal } from "@/src/reusables/SlidingModal";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export type OnboardingProfile = {
  focusAreas: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced" | null;
  preferredStyle: "strict" | "balanced" | "gentle" | null;
};

export default function OnboardingScreen() {
  const [activeCategory, setActiveCategory] =
    useState<OnboardingCategory | null>(null);

  const [onboardingProfile, setOnboardingProfile] =
    useState<OnboardingProfile>({
      focusAreas: [],
      experienceLevel: null,
      preferredStyle: null,
    });

  const getCurrentIndices = () => {
    if (!activeCategory) return [];

    const options = activeCategory.options;

    if (activeCategory.type === "focusAreas") {
      return options
        .map((opt, idx) =>
          onboardingProfile.focusAreas.includes(opt.label) ? idx : -1
        )
        .filter((idx) => idx !== -1);
    }

    if (
      activeCategory.type === "experienceLevel" &&
      onboardingProfile.experienceLevel
    ) {
      const idx = options.findIndex(
        (opt) => opt.label === onboardingProfile.experienceLevel
      );
      return idx !== -1 ? [idx] : [];
    }

    if (
      activeCategory.type === "preferredStyle" &&
      onboardingProfile.preferredStyle
    ) {
      const idx = options.findIndex(
        (opt) => opt.label === onboardingProfile.preferredStyle
      );
      return idx !== -1 ? [idx] : [];
    }

    return [];
  };

  const handleSaveCategory = (
    categoryId: string,
    selectedIndices: number[]
  ) => {
    const category = onboardingCategories.find(
      (cat) => cat.id === categoryId
    );
    if (!category) return;

    const labels = selectedIndices.map(
      (idx) => category.options[idx].label
    );

    setOnboardingProfile((prev) => {
      switch (category.type) {
        case "focusAreas":
          return { ...prev, focusAreas: labels };
        case "experienceLevel":
          return { ...prev, experienceLevel: labels[0] as any };
        case "preferredStyle":
          return { ...prev, preferredStyle: labels[0] as any };
        default:
          return prev;
      }
    });

    setActiveCategory(null);
  };

  const getCategoryProgress = (category: OnboardingCategory) => {
    if (category.type === "focusAreas") {
      return onboardingProfile.focusAreas.length > 0 ? 100 : 0;
    }

    if (category.type === "experienceLevel") {
      return onboardingProfile.experienceLevel ? 100 : 0;
    }

    if (category.type === "preferredStyle") {
      return onboardingProfile.preferredStyle ? 100 : 0;
    }

    return 0;
  };

  const getSelectedValue = (category: OnboardingCategory) => {
    if (category.type === "focusAreas") {
      return onboardingProfile.focusAreas.length
        ? `${onboardingProfile.focusAreas.length} selected`
        : "Not selected";
    }

    if (category.type === "experienceLevel") {
      return onboardingProfile.experienceLevel ?? "Not selected";
    }

    if (category.type === "preferredStyle") {
      return onboardingProfile.preferredStyle ?? "Not selected";
    }

    return "Not selected";
  };

  const isAllComplete =
    onboardingProfile.focusAreas.length > 0 &&
    onboardingProfile.experienceLevel !== null &&
    onboardingProfile.preferredStyle !== null;

  const handleFinish = () => {
    router.push({
      pathname: "/(auth)/login",
      params: {
        onboardingProfile: JSON.stringify(onboardingProfile),
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Personalize Your Journey</Text>
          <Text style={styles.subtitle}>
            Help us tailor the experience to your needs
          </Text>
        </View>

        <View style={styles.categoriesContainer}>
          {onboardingCategories.map((cat, idx) => {
            const isDone = getCategoryProgress(cat) === 100;

            return (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCategory(cat)}
                style={({ pressed }) => [
                  styles.categoryCard,
                  isDone && styles.categoryCardActive,
                  pressed && styles.categoryCardPressed,
                ]}
              >
                <View style={styles.categoryContent}>
                  <View style={styles.categoryHeader}>
                    <View
                      style={[
                        styles.categoryNumber,
                        isDone && styles.categoryNumberDone,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryNumberText,
                          isDone && styles.categoryNumberTextDone,
                        ]}
                      >
                        {isDone ? "✓" : idx + 1}
                      </Text>
                    </View>

                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryTitle}>{cat.title}</Text>
                      <Text style={styles.categorySubtitle} numberOfLines={1}>
                        {getSelectedValue(cat)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${getCategoryProgress(cat)}%` },
                      ]}
                    />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleFinish}
          disabled={!isAllComplete}
          style={[
            styles.continueButton,
            !isAllComplete && styles.continueButtonDisabled,
          ]}
        >
          <Text style={styles.continueButtonText}>
            {isAllComplete ? "Get Started" : "Complete Profile"}
          </Text>
        </Pressable>
      </View>

      <OnboardingSliderModal
        visible={!!activeCategory}
        category={activeCategory}
        onClose={() => setActiveCategory(null)}
        onSave={handleSaveCategory}
        initialIndices={getCurrentIndices()}
      />
    </View>
  );
}
