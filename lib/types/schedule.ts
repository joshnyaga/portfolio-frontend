export interface ScheduleBlock {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  category:
    | "work"
    | "personal"
    | "learning"
    | "health"
    | "project"
    | "meeting"
    | "break"
    | "other";
  taskId?: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "missed";
  actualStartTime?: string;
  actualEndTime?: string;
  notes?: string;
}

export interface DailySchedule {
  _id?: string;
  date: string;
  scheduleBlocks: ScheduleBlock[];
  dailyGoals: string[];
  accomplishments: string[];
  challenges: string[];
  mood: "excellent" | "good" | "okay" | "poor" | "terrible";
  energyLevel: 1 | 2 | 3 | 4 | 5;
  productivityScore: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleAnalytics {
  overview: {
    totalDays: number;
    avgEnergyLevel: number;
    avgProductivityScore: number;
    totalBlocks: number;
  };
  blockStatusStats: Array<{ _id: string; count: number }>;
  categoryStats: Array<{ _id: string; count: number; completionRate: number }>;
  moodStats: Array<{ _id: string; count: number }>;
  productivityTrend: Array<{
    date: string;
    productivityScore: number;
    energyLevel: number;
    completionRate: number;
  }>;
  period: string;
}
