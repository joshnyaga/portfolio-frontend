export interface IVisitor {
  _id: string;
  hashedIp: string;
  userAgent: string;
  referer?: string;
  pageVisited: string;
  country?: string;
  city?: string;
  region?: string;
  browser?: string;
  os?: string;
  device?: string;
  screenResolution?: string;
  visitTimestamp: string;
  sessionId: string;
  timeOnPage?: number;
  exitPage?: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  }>;
  period: string;
}

export interface VisitorAnalyticsResponse {
  success: boolean;
  data: {
    visitors: IVisitor[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalVisitors: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
