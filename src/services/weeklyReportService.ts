import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DailyLog } from '../schemas/dailyLogsSchema';
import { User } from '../schemas/userSchema';
import { WeeklyReports } from '../schemas/weeklyReportsSchema';
import { calculateCompletionScore } from '../utils/calculations/completionScore';
import { calculateDifficultyScore } from '../utils/calculations/difficultyScore';
import { calculateEffortScore } from '../utils/calculations/effortScore';
import { calculateQualityScore } from '../utils/calculations/qualityScore';
import { generateInsights } from '../utils/insights/insightsGenerator';
import { generateRecommendation } from '../utils/insights/recommendation';


export interface ScoreBreakdown {
  completion: number;
  effort: number;
  quality: number;
  difficulty: number;
  total: number;
}

/**
 * Fetch daily logs for a specific cycle
 */
async function fetchLogsForCycle(
  userId: string,
  cycleStart: Date,
  cycleEnd: Date
): Promise<DailyLog[]> {
  try {
    // Force dates to start/end of day to ensure no logs are missed
    const start = new Date(cycleStart);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(cycleEnd);
    end.setHours(23, 59, 59, 999);

    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    const logsQuery = query(
      collection(db, 'dailyLogs'),
      where('userId', '==', userId),
      where('date', '>=', startDateStr),
      where('date', '<=', endDateStr),
      orderBy('date', 'desc')
    );

    const logsSnapshot = await getDocs(logsQuery);
    return logsSnapshot.docs.map((doc) => doc.data() as DailyLog);
  } catch (error) {
    console.error('Error fetching logs for cycle:', error);
    throw error;
  }
}

/**
 * Fetch user data by UID (direct document access)
 */
async function fetchUser(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      console.warn('User not found:', userId);
      return null;
    }

    const user = userSnapshot.data() as User;
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Calculate all scores
 */
function calculateScores(logs: DailyLog[]): ScoreBreakdown {
  const completion = calculateCompletionScore(logs);
  const effort = calculateEffortScore(logs);
  const quality = calculateQualityScore(logs);
  const difficulty = calculateDifficultyScore(logs);
  const total = completion + effort + quality + difficulty;

  return {
    completion,
    effort,
    quality,
    difficulty,
    total,
  };
}

/**
 * Determine consistency level based on completion score
 */
function determineConsistencyLevel(
  completionScore: number
): 'low' | 'medium' | 'high' {
  if (completionScore >= 50) {
    return 'high';
  } else if (completionScore >= 30) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Save weekly report to Firestore
 */
async function saveWeeklyReport(
  userId: string,
  cycleStart: Timestamp,
  report: WeeklyReports
): Promise<void> {
  try {
    const reportId = cycleStart.toDate().toISOString().split('T')[0];
    const reportRef = doc(db, 'users', userId, 'weeklyReports', reportId);

    await setDoc(reportRef, report);
    console.log('Weekly report saved:', reportId);
  } catch (error) {
    console.error('Error saving weekly report:', error);
    throw error;
  }
}

/**
 * Update user's current score and last report timestamp
 */
async function updateUserStats(
  userId: string,
  weeklyScore: number
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      currentScore: weeklyScore,
      lastReportAt: Timestamp.now(),
    });

    console.log('User stats updated:', {
      userId,
      currentScore: weeklyScore,
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

/**
 * Main function: Generate weekly report for a user
 */
export async function generateWeeklyReport(userId: string): Promise<WeeklyReports | null> {
  try {
    console.log('Starting weekly report generation for user:', userId);

    const user = await fetchUser(userId);
    if (!user) {
      console.error('User not found');
      return null;
    }

    const cycleStart = user.currentCycleStart;
    const cycleStartDate = new Date(cycleStart.seconds * 1000);
    const cycleEndDate = new Date(
      cycleStartDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const cycleEnd = Timestamp.fromDate(cycleEndDate);

    console.log('Cycle dates:', {
      start: cycleStartDate.toISOString().split('T')[0],
      end: cycleEndDate.toISOString().split('T')[0],
    });

    const logs = await fetchLogsForCycle(userId, cycleStartDate, cycleEndDate);

    if (logs.length === 0) {
      console.warn('No daily logs found for this cycle');
      return null;
    }

    const scores = calculateScores(logs);
    console.log('Calculated scores:', scores);

    const aiInsights = generateInsights(logs, scores);
    const recommendation = generateRecommendation(scores);
    const consistencyLevel = determineConsistencyLevel(scores.completion);

    const weeklyReport: WeeklyReports = {
      userId,
      cycleStart,
      cycleEnd,
      weeklyScore: Math.round(scores.total),
      consistencyLevel,
      breakdown: {
        completion: scores.completion,
        effort: scores.effort,
        quality: scores.quality,
        difficulty: scores.difficulty,
      },
      aiInsights,
      recommendation,
      generatedAt: Timestamp.now(),
    };

    console.log('Generated weekly report:', weeklyReport);

    await saveWeeklyReport(userId, cycleStart, weeklyReport);
    await updateUserStats(userId, weeklyReport.weeklyScore);

    console.log('Weekly report generation completed successfully');

    return weeklyReport;
  } catch (error) {
    console.error('Error generating weekly report:', error);
    return null;
  }
}

/**
 * Fetch the latest weekly report for a user
 */
export async function getLatestWeeklyReport(
  userId: string
): Promise<WeeklyReports | null> {
  try {
    const reportsQuery = query(
      collection(db, 'users', userId, 'weeklyReports'),
      orderBy('generatedAt', 'desc'),
      limit(1)
    );

    const reportsSnapshot = await getDocs(reportsQuery);

    if (reportsSnapshot.empty) {
      console.warn('No weekly reports found for user:', userId);
      return null;
    }

    const report = reportsSnapshot.docs[0].data() as WeeklyReports;
    return report;
  } catch (error) {
    console.error('Error fetching latest weekly report:', error);
    return null;
  }
}

/**
 * Fetch all weekly reports for a user
 */
export async function getAllWeeklyReports(
  userId: string,
  limitCount: number = 10
): Promise<WeeklyReports[]> {
  try {
    const reportsQuery = query(
      collection(db, 'users', userId, 'weeklyReports'),
      orderBy('generatedAt', 'desc'),
      limit(limitCount)
    );

    const reportsSnapshot = await getDocs(reportsQuery);
    const reports = reportsSnapshot.docs.map((doc) => doc.data() as WeeklyReports);

    console.log(`Fetched ${reports.length} weekly reports for user:`, userId);

    return reports;
  } catch (error) {
    console.error('Error fetching weekly reports:', error);
    return [];
  }
}

/**
 * Utility function to format report for display
 */
export function formatReportForDisplay(report: WeeklyReports) {
  return {
    weeklyScore: `${report.weeklyScore}/100`,
    consistencyLevel: report.consistencyLevel.toUpperCase(),
    completion: `${report.breakdown.completion}/60`,
    effort: `${report.breakdown.effort}/20`,
    quality: `${report.breakdown.quality}/10`,
    difficulty: `${report.breakdown.difficulty}/10`,
    insights: report.aiInsights,
    recommendation: report.recommendation,
    generatedAt: new Date(report.generatedAt.seconds * 1000).toLocaleDateString(),
  };
}