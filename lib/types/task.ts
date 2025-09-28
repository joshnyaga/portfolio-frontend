export interface Task {
  _id: string;
  title: string;
  description?: string;
  category:
    | "work"
    | "personal"
    | "learning"
    | "health"
    | "project"
    | "meeting"
    | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed" | "cancelled" | "deferred";
  dueDate?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  tags: string[];
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionPercentage: number;
  tasksByCategory: Array<{ _id: string; count: number }>;
  tasksByPriority: Array<{ _id: string; count: number }>;
  dailyCompletionRate: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
  }>;
  period: string;
}
