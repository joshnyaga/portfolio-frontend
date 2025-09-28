// ============================================
// VISITOR SERVICE (Frontend API Integration)
// ============================================

// services/visitorService.ts
import { api } from "@/lib/types/api/client";

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  popularPages: Array<{ _id: string; count: number }>;
  topCountries: Array<{ _id: string; count: number }>;
  browserStats: Array<{ _id: string; count: number }>;
  dailyVisits: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
    date: string;
  }>;
  period: string;
}

export interface RecentVisitor {
  _id: string;
  hashedIp: string;
  pageVisited: string;
  country?: string;
  city?: string;
  browser?: string;
  device?: string;
  visitTimestamp: string;
  timeOnPage?: number;
}

export interface VisitorAnalyticsResponse {
  visitors: RecentVisitor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalVisitors: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const visitorService = {
  // Get visitor statistics (admin only)
  getStats: (days: number = 7) =>
    api.get<VisitorStats>(`/visitors/stats?days=${days}`),

  // Get visitor analytics with pagination (admin only)
  getAnalytics: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    pageFilter?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.pageFilter) queryParams.append("pageFilter", params.pageFilter);

    const queryString = queryParams.toString();
    return api.get<VisitorAnalyticsResponse>(
      `/visitors/analytics${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get recent visitors (convenience method)
  getRecentVisitors: (limit: number = 5) =>
    visitorService.getAnalytics({ limit, page: 1 }),

  // Export visitor data as CSV (admin only)
  exportCSV: (params?: {
    startDate?: string;
    endDate?: string;
    pageFilter?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.pageFilter) queryParams.append("pageFilter", params.pageFilter);

    const queryString = queryParams.toString();
    return api.get(`/visitors/export${queryString ? `?${queryString}` : ""}`, {
      responseType: "blob", // For file download
    });
  },

  // Track visitor (public endpoint - no auth required)
  track: (data: {
    page: string;
    sessionId: string;
    screenResolution?: string;
    timeOnPage?: number;
    exitPage?: boolean;
  }) => {
    // Use direct fetch for public endpoint since it doesn't need auth
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return fetch(`${API_BASE_URL}/api/visitors/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Cleanup old data (admin only)
  cleanup: (days: number = 365) => api.delete(`/visitors/cleanup?days=${days}`),
};
