export interface OnboardingCategory {
  id: string;
  title: string;
  description: string;
  questions: string[];
}

export const onboardingQuestions: OnboardingCategory[] = [
  {
    id: "life_focus",
    title: "Life Focus",
    description: "What area of life matters most to you right now?",
    questions: [
      "What are you currently prioritizing the most?",
      "Which area of your life feels most out of balance?",
      "What would you like to improve in the next 3 months?",
    ],
  },
  {
    id: "energy_patterns",
    title: "Energy Patterns",
    description: "Understand how your energy flows day to day",
    questions: [
      "When do you feel most energized during the day?",
      "What usually drains your energy?",
      "How do you recharge when feeling exhausted?",
    ],
  },
  {
    id: "main_struggle",
    title: "Main Struggle",
    description: "Identify the biggest challenge you’re facing",
    questions: [
      "What feels hardest for you right now?",
      "What obstacle keeps coming back?",
      "What support do you feel you’re missing?",
    ],
  },
];
