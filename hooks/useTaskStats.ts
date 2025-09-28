import { TaskStats } from "@/lib/types/task";
import { taskService } from "@/services/taskService";
import { useEffect, useState } from "react";

export const useTaskStats = (days: number = 30) => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await taskService.getTaskStats(days);
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [days]);

  return { stats, loading, error };
};
