import { Task } from "@/lib/types/task";

export const taskUtils = {
  // Get priority color
  getPriorityColor: (priority: Task["priority"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority] || colors.medium;
  },

  // Get status color
  getStatusColor: (status: Task["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
      deferred: "bg-purple-100 text-purple-800",
    };
    return colors[status] || colors.pending;
  },

  // Get category color
  getCategoryColor: (category: Task["category"]) => {
    const colors = {
      work: "bg-blue-100 text-blue-800",
      personal: "bg-green-100 text-green-800",
      learning: "bg-purple-100 text-purple-800",
      health: "bg-pink-100 text-pink-800",
      project: "bg-indigo-100 text-indigo-800",
      meeting: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  },

  // Check if task is overdue
  isOverdue: (task: Task) => {
    if (!task.dueDate || task.status === "completed") return false;
    return new Date(task.dueDate) < new Date();
  },

  // Format duration
  formatDuration: (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  },

  // Get task completion percentage
  getCompletionPercentage: (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  },
};
