import { ApiResponse } from "@/lib/types";
import { api } from "@/lib/types/api/client";
import { Task, TaskStats } from "@/lib/types/task";

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TaskResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
  category: Task["category"];
  priority: Task["priority"];
  dueDate?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  estimatedDuration?: number;
  tags?: string[];
  notes?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: Task["status"];
  actualDuration?: number;
}

export const taskService = {
  // Get all tasks with filtering
  getTasks: (filters?: TaskFilters)  => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return api.get<ApiResponse>(
      `/tasks${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get task by ID
  getTaskById: (id: string) => api.get<ApiResponse>(`/tasks/${id}`),

  // Create new task
  createTask: (data: CreateTaskData) => api.post<ApiResponse>("/tasks", data),

  // Update task
  updateTask: (id: string, data: UpdateTaskData) =>
    api.put<ApiResponse>(`/tasks/${id}`, data),

  // Delete task
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),

  // Get task statistics
  getTaskStats: (days?: number) =>
    api.get<TaskStats>(`/tasks/stats${days ? `?days=${days}` : ""}`),

  // Bulk update tasks
  bulkUpdateTasks: (taskIds: string[], updates: UpdateTaskData) =>
    api.patch("/tasks/bulk", { taskIds, updates }),

  // Quick status update
  updateTaskStatus: (id: string, status: Task["status"]) =>
    taskService.updateTask(id, { status }),

  // Mark task as completed
  completeTask: (id: string, actualDuration?: number) =>
    taskService.updateTask(id, {
      status: "completed",
      actualDuration,
    }),
};
