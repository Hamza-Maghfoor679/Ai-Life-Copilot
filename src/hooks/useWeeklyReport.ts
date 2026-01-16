// app/hooks/useWeeklyReport.ts
import { useCallback, useState } from 'react';
import { WeeklyReports } from '../schemas/weeklyReportsSchema';
import { formatReportForDisplay, generateWeeklyReport, getAllWeeklyReports, getLatestWeeklyReport } from '../services/weeklyReportService';


interface UseWeeklyReportReturn {
  report: WeeklyReports | null;
  latestReport: WeeklyReports | null;
  allReports: WeeklyReports[];
  loading: boolean;
  error: string | null;
  generate: (userId: string) => Promise<void>;
  fetchLatest: (userId: string) => Promise<void>;
  fetchAll: (userId: string, limit?: number) => Promise<void>;
  formatted: ReturnType<typeof formatReportForDisplay> | null;
  reset: () => void;
}

export function useWeeklyReport(): UseWeeklyReportReturn {
  const [report, setReport] = useState<WeeklyReports | null>(null);
  const [latestReport, setLatestReport] = useState<WeeklyReports | null>(null);
  const [allReports, setAllReports] = useState<WeeklyReports[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate new weekly report
  const generate = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Generating weekly report for user:', userId);
      const result = await generateWeeklyReport(userId);
      
      if (result) {
        setReport(result);
        console.log('✅ Report generated successfully:', result);
      } else {
        setError('No daily logs found for this cycle. Please add some daily logs first.');
        console.warn('No report generated - no daily logs found');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('❌ Error generating report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch latest report
  const fetchLatest = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching latest report for user:', userId);
      const result = await getLatestWeeklyReport(userId);
      
      if (result) {
        setLatestReport(result);
        console.log('✅ Latest report fetched:', result);
      } else {
        setError('No weekly reports found yet.');
        console.warn('No latest report found');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('❌ Error fetching latest report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all reports
  const fetchAll = useCallback(async (userId: string, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching all reports for user:', userId);
      const results = await getAllWeeklyReports(userId, limit);
      
      if (results.length > 0) {
        setAllReports(results);
        console.log('✅ Reports fetched:', results.length);
      } else {
        setError('No weekly reports found yet.');
        console.warn('No reports found');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('❌ Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setReport(null);
    setLatestReport(null);
    setAllReports([]);
    setLoading(false);
    setError(null);
  }, []);

  // Format the current report for display
  const formatted = report ? formatReportForDisplay(report) : null;

  return {
    report,
    latestReport,
    allReports,
    loading,
    error,
    generate,
    fetchLatest,
    fetchAll,
    formatted,
    reset,
  };
}