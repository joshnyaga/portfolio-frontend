import { useState, useEffect } from "react";
import {
  IVisitor,
  VisitorStats,
  VisitorAnalyticsResponse,
} from "@/lib/types/visitors";

export const useVisitorAnalytics = (page: number = 1, filters: any = {}) => {
  const [visitors, setVisitors] = useState<IVisitor[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        ...filters,
      });

      const response = await fetch(
        `/api/admin/visitors/analytics?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch visitors");

      const data: VisitorAnalyticsResponse = await response.json();

      setVisitors(data.data.visitors);
      setPagination(data.data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [page, JSON.stringify(filters)]);

  return { visitors, pagination, loading, error, refetch: fetchVisitors };
};

export const useVisitorStats = (days: number = 30) => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/visitors/stats?days=${days}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch stats");

        const data = await response.json();
        setStats(data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [days]);

  return { stats, loading, error };
};
