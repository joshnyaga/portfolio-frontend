import { ScheduleAnalytics } from "@/lib/types/schedule";
import { scheduleService } from "@/services/scheduleService";
import { useEffect, useState } from "react";

export const useScheduleAnalytics = (days: number = 30) => {
  const [analytics, setAnalytics] = useState<ScheduleAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await scheduleService.getScheduleAnalytics(days);
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  return { analytics, loading, error };
};
