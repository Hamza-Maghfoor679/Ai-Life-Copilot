export const aiInsights = [
  {
    id: 1,
    title: "💰 Spending Alert",
    description:
      "Your spending increased by 20% last week compared to the previous week. Consider reviewing your recent transactions to identify areas where you can optimize your budget.",
    time: "2 hours ago",
    status: "Completed" as const,
  },
  {
    id: 2,
    title: "📱 Evening Usage Pattern",
    description:
      "You tend to use your phone more in the evenings (6 PM - 10 PM), with peak activity around 8 PM. This could impact your sleep quality and productivity.",
    time: "1 day ago",
    status: "In Progress" as const,
  },
  {
    id: 3,
    title: "⚡ Productivity Peak",
    description:
      "Your productivity peaks at 10 AM with the highest task completion rate. We recommend scheduling important tasks during this time window for optimal performance.",
    time: "3 days ago",
    status: "Completed" as const,
  },
  {
    id: 4,
    title: "😴 Sleep Recommendation",
    description:
      "Based on your recent activity, you're averaging 6.5 hours of sleep per night. Experts recommend 7-9 hours for optimal health and focus.",
    time: "1 week ago",
    status: "Pending" as const,
  },
  {
    id: 5,
    title: "🎯 Goal Progress",
    description:
      "You've completed 75% of your weekly goals. Keep up the momentum! Focus on the remaining tasks to achieve 100% completion.",
    time: "5 days ago",
    status: "In Progress" as const,
  },
  {
    id: 6,
    title: "💪 Consistency Streak",
    description:
      "Congratulations! You've maintained a 14-day streak of consistent activity. This shows great dedication to your goals.",
    time: "Today",
    status: "Completed" as const,
  },
];

export const intentions = [
  {
    id: 1,
    title: "🚭 Leave Smoking Today Forever",
    description: "You've successfully left smoking today. Great commitment to your health!",
    status: "Completed" as const,
    progress: 100,
    dueDate: "Today",
    category: "Health",
  },
  {
    id: 2,
    title: "🧘 Morning Meditation",
    description: "Meditated for 10 minutes to start your day with mindfulness and clarity.",
    status: "In Progress" as const,
    progress: 67,
    dueDate: "Today",
    category: "Wellness",
  },
  {
    id: 3,
    title: "🚶 Evening Walk",
    description: "Walked 5000 steps to stay active and improve cardiovascular health.",
    status: "Not Started" as const,
    progress: 0,
    dueDate: "Today",
    category: "Fitness",
  },
  {
    id: 4,
    title: "📚 Read 30 Minutes",
    description: "Dedicate 30 minutes to reading to expand knowledge and relax your mind.",
    status: "Not Started" as const,
    progress: 0,
    dueDate: "Tomorrow",
    category: "Learning",
  },
  {
    id: 5,
    title: "💧 Drink 8 Glasses of Water",
    description: "Stay hydrated throughout the day for optimal health and energy levels.",
    status: "In Progress" as const,
    progress: 50,
    dueDate: "Today",
    category: "Health",
  },
  {
    id: 6,
    title: "🎯 Complete Work Tasks",
    description: "Finish all priority tasks for today to maintain productivity and focus.",
    status: "In Progress" as const,
    progress: 75,
    dueDate: "Today",
    category: "Productivity",
  },
];

// Status type for type safety
export type IntentionStatus = "Completed" | "In Progress" | "Not Started";
 export const historyLogs = [
  {
    id: 1,
    title: "Account Access",
    time: "Jan 13, 2026 • 09:00 AM",
    status: "Completed",
    description: "Successfully authenticated via secure login. Session started for daily intention tracking.",
  },
  {
    id: 2,
    title: "Progress Review",
    time: "Jan 13, 2026 • 09:05 AM",
    status: "In Progress",
    description: "Currently analyzing your activity patterns from the last 24 hours to generate fresh insights.",
  },
  {
    id: 3,
    title: "AI Analysis Request",
    time: "Jan 13, 2026 • 09:10 AM",
    status: "Pending",
    description: "Your request for a deep-dive intention report is in the queue. Our AI is processing your data.",
  },
  {
    id: 4,
    title: "Session Conclusion",
    time: "Jan 13, 2026 • 09:20 AM",
    status: "Completed",
    description: "Application session ended securely. All progress and intention markers have been synced to the cloud.",
  },
  {
    id: 5,
    title: "Settings Sync",
    time: "Jan 13, 2026 • 09:30 AM",
    status: "Completed",
    description: "Profile preferences and notification thresholds were successfully updated and saved.",
  },
];

export type Mood =
  | "happy"
  | "neutral"
  | "sad"
  | "angry"
  | "tired";

export const moodMap = [
  "happy",   // 😃
  "neutral", // 😐
  "sad",     // 😔
  "angry",   // 😡
  "tired",   // 😓
] as const;