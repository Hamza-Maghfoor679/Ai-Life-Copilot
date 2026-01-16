// constants/categoryQuestions.ts

export type OnboardingCategoryType = "focusAreas" | "experienceLevel" | "preferredStyle";

export interface OnboardingOption {
  value: number;
  label: string;
}

export interface OnboardingCategory {
  id: string;
  type: OnboardingCategoryType;
  title: string;
  question: string;
  options: OnboardingOption[];
}

export const onboardingCategories: OnboardingCategory[] = [
  {
    id: "focusAreas",
    type: "focusAreas",
    title: "Focus Areas",
    question: "Which areas would you like to focus on?",
    options: [
      { value: 0, label: "health" },
      { value: 1, label: "career" },
      { value: 2, label: "relationships" },
      { value: 3, label: "finance" },
      { value: 4, label: "personal growth" },
      { value: 5, label: "mindfulness" },
    ],
  },
  {
    id: "experienceLevel",
    type: "experienceLevel",
    title: "Experience Level",
    question: "What's your experience level with personal development?",
    options: [
      { value: 0, label: "beginner" },
      { value: 1, label: "intermediate" },
      { value: 2, label: "advanced" },
    ],
  },
  {
    id: "preferredStyle",
    type: "preferredStyle",
    title: "Preferred Style",
    question: "How would you like to approach your growth?",
    options: [
      { value: 0, label: "strict" },
      { value: 1, label: "balanced" },
      { value: 2, label: "gentle" },
    ],
  },
];