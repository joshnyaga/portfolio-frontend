"use client";

import React, { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { taskUtils } from "@/utils/taskUtils";
import { Task } from "@/lib/types/task";
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Calendar,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  AlertCircle,
  X,
  ArrowUpDown,
  FileText,
} from "lucide-react";

interface TaskListProps {
  onTaskClick?: (task: Task) => void;
  onCreateTask?: () => void;
}

export default function TaskList({ onTaskClick, onCreateTask }: TaskListProps) {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    priority: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { tasks, loading, error, pagination, updateTask, deleteTask } =
    useTasks(filters);

   

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      category: "",
      priority: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.category || filters.priority
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">Error loading tasks: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">
            {pagination
              ? `${pagination.totalTasks} total tasks`
              : "Manage and track your tasks"}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                {
                  [
                    filters.search,
                    filters.status,
                    filters.category,
                    filters.priority,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>
          <button
            onClick={onCreateTask}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filter Tasks</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="deferred">Deferred</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="learning">Learning</option>
              <option value="health">Health</option>
              <option value="project">Project</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                setFilters((prev) => ({
                  ...prev,
                  sortBy,
                  sortOrder: sortOrder as "asc" | "desc",
                }));
              }}
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Near)</option>
              <option value="dueDate-desc">Due Date (Far)</option>
              <option value="priority-desc">Priority (High)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>
      )}

      {/* Task Summary */}
      {tasks?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">
                  {tasks.filter((t) => t.status === "pending").length} Pending
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-600">
                  {tasks.filter((t) => t.status === "in-progress").length} In
                  Progress
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">
                  {tasks.filter((t) => t.status === "completed").length}{" "}
                  Completed
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-gray-600">
                  {tasks.filter((t) => taskUtils.isOverdue(t)).length} Overdue
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {tasks?.length === 0 ? (
          <EmptyTaskState
            onCreateTask={onCreateTask}
            hasFilters={false}
          />
        ) : (
          tasks?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
              onClick={() => onTaskClick?.(task)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * 20 + 1} to{" "}
            {Math.min(pagination.currentPage * 20, pagination.totalTasks)} of{" "}
            {pagination.totalTasks} tasks
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Empty State Component
function EmptyTaskState({
  onCreateTask,
  hasFilters,
}: {
  onCreateTask?: () => void;
  hasFilters: boolean;
}) {
  if (hasFilters) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
        <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your search criteria or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
      <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
      <p className="text-gray-500 mb-6">
        Get started by creating your first task to stay organized and
        productive.
      </p>
      <button
        onClick={onCreateTask}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Task
      </button>
    </div>
  );
}

// Task Card Component
interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDelete: (taskId: string) => void;
  onClick: () => void;
}

function TaskCard({ task, onStatusChange, onDelete, onClick }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const isOverdue = taskUtils.isOverdue(task);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
        task.status === "completed"
          ? "border-l-green-500 opacity-75"
          : task.status === "in-progress"
          ? "border-l-blue-500"
          : isOverdue
          ? "border-l-red-500"
          : task.priority === "urgent"
          ? "border-l-red-400"
          : task.priority === "high"
          ? "border-l-orange-400"
          : "border-l-gray-300"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
            <div className="flex items-center space-x-3 mb-3">
              <h3
                className={`text-lg font-semibold truncate ${
                  task.status === "completed"
                    ? "text-gray-500 line-through"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              {isOverdue && task.status !== "completed" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Overdue
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${taskUtils.getStatusColor(
                  task.status
                )}`}
              >
                {task.status.replace("-", " ")}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${taskUtils.getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority} priority
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${taskUtils.getCategoryColor(
                  task.category
                )}`}
              >
                {task.category}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span
                    className={
                      isOverdue && task.status !== "completed"
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {task.estimatedDuration && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {taskUtils.formatDuration(task.estimatedDuration)}
                  {task.actualDuration && (
                    <span className="ml-1 text-green-600">
                      (actual: {taskUtils.formatDuration(task.actualDuration)})
                    </span>
                  )}
                </div>
              )}
              {task.tags.length > 0 && (
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {task.tags.slice(0, 2).join(", ")}
                  {task.tags.length > 2 && ` +${task.tags.length - 2} more`}
                </div>
              )}
              {task.notes && (
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Has notes
                </div>
              )}
            </div>

            {task.completedAt && (
              <div className="mt-2 text-xs text-green-600">
                Completed {new Date(task.completedAt).toLocaleDateString()} at{" "}
                {new Date(task.completedAt).toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="relative ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  {task.status !== "completed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task._id, "completed");
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </button>
                  )}
                  {task.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task._id, "in-progress");
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Task
                    </button>
                  )}
                  {task.status === "completed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task._id, "pending");
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Reopen Task
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task._id);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
