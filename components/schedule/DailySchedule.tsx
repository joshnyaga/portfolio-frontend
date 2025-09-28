"use client";

import React, { useState } from "react";
import { useSchedule } from "@/hooks/useSchedule";
import { scheduleUtils } from "@/utils/scheduleUtils";
import {
  ScheduleBlock,
  DailySchedule as IDailySchedule,
 
} from "@/lib/types/schedule";
import {
  Plus,
  Clock,
  Play,
  CheckCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MoreVertical,
  MapPin,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

interface DailyScheduleProps {
  initialDate?: string;
  onBlockClick?: (block: ScheduleBlock) => void;
  onCreateBlock?: (date: string) => void;
}

export default function DailySchedule({
  initialDate = scheduleUtils.getTodayDate(),
  onBlockClick,
  onCreateBlock,
}: DailyScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const {
    schedule,
    loading,
    error,
    updateBlock,
    deleteBlock,
    updateReflection,
  } = useSchedule(selectedDate);

  const handleDateChange = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  const handleQuickAction = async (
    blockId: string,
    action: "start" | "complete" | "cancel"
  ) => {
    try {
      let status: ScheduleBlock["status"];
      let additionalData = {};

      switch (action) {
        case "start":
          status = "in-progress";
          additionalData = {
            actualStartTime: new Date().toTimeString().slice(0, 5),
          };
          break;
        case "complete":
          status = "completed";
          additionalData = {
            actualEndTime: new Date().toTimeString().slice(0, 5),
          };
          break;
        case "cancel":
          status = "cancelled";
          break;
        default:
          return;
      }

      await updateBlock(blockId, { status, ...additionalData });
    } catch (error) {
      console.error(`Failed to ${action} block:`, error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (
      window.confirm("Are you sure you want to delete this schedule block?")
    ) {
      try {
        await deleteBlock(blockId);
      } catch (error) {
        console.error("Failed to delete block:", error);
      }
    }
  };

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
        <p className="text-red-600">Error loading schedule: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  const sortedBlocks =
    schedule?.scheduleBlocks?.sort(
      (a, b) =>
        scheduleUtils.timeToMinutes(a.startTime) -
        scheduleUtils.timeToMinutes(b.startTime)
    ) || [];

  const isToday = selectedDate === scheduleUtils.getTodayDate();

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDateChange("prev")}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {scheduleUtils.formatDate(selectedDate)}
              </h1>
              <div className="flex items-center justify-center space-x-2 mt-1">
                {isToday && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Today
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {sortedBlocks.length} blocks scheduled
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDateChange("next")}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={() => onCreateBlock?.(selectedDate)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Schedule */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
            </div>
            <div className="p-6">
              {sortedBlocks.length === 0 ? (
                <EmptyScheduleState
                  onCreateBlock={() => onCreateBlock?.(selectedDate)}
                />
              ) : (
                <div className="space-y-4">
                  {sortedBlocks.map((block, index) => (
                    <ScheduleBlockItem
                      key={block.id}
                      block={block}
                      isLast={index === sortedBlocks.length - 1}
                      onQuickAction={handleQuickAction}
                      onEdit={() => onBlockClick?.(block)}
                      onDelete={handleDeleteBlock}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <DayOverview schedule={schedule} />
          <QuickStats blocks={sortedBlocks} />
          {/* <DailyGoals
            schedule={schedule}
            onUpdateReflection={updateReflection}
          /> */}
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyScheduleState({ onCreateBlock }: { onCreateBlock: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        <Calendar className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No schedule blocks
      </h3>
      <p className="text-gray-500 mb-6">
        Start planning your day by adding your first schedule block.
      </p>
      <button
        onClick={onCreateBlock}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Block
      </button>
    </div>
  );
}

// Schedule Block Item Component
interface ScheduleBlockItemProps {
  block: ScheduleBlock;
  isLast: boolean;
  onQuickAction: (
    blockId: string,
    action: "start" | "complete" | "cancel"
  ) => void;
  onEdit: () => void;
  onDelete: (blockId: string) => void;
}

function ScheduleBlockItem({
  block,
  isLast,
  onQuickAction,
  onEdit,
  onDelete,
}: ScheduleBlockItemProps) {
  const [showActions, setShowActions] = useState(false);
  const duration =
    scheduleUtils.timeToMinutes(block.endTime) -
    scheduleUtils.timeToMinutes(block.startTime);

  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200" />
      )}

      <div className="flex items-start space-x-4">
        {/* Time indicator */}
        <div className="flex-shrink-0 w-12 text-center">
          <div className="text-sm font-medium text-gray-900">
            {block.startTime}
          </div>
          <div className="text-xs text-gray-500">
            {Math.floor(duration / 60)}h {duration % 60}m
          </div>
          <div
            className={`w-3 h-3 rounded-full mx-auto mt-2 ${
              block.status === "completed"
                ? "bg-green-500"
                : block.status === "in-progress"
                ? "bg-yellow-500"
                : block.status === "cancelled"
                ? "bg-red-500"
                : "bg-gray-300"
            }`}
          />
        </div>

        {/* Block content */}
        <div
          className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={onEdit}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-lg font-semibold text-gray-900 truncate">
                  {block.title}
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${scheduleUtils.getBlockStatusColor(
                    block.status
                  )}`}
                >
                  {block.status.replace("-", " ")}
                </span>
              </div>

              {block.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {block.description}
                </p>
              )}

              {/* <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs ${scheduleUtils.getCategoryColor(
                    block.category
                  )}`}
                >
                  {block.category}
                </span>
                <span>
                  {block.startTime} - {block.endTime}
                </span>
                {block.actualStartTime && (
                  <span className="text-green-600">
                    Started: {block.actualStartTime}
                  </span>
                )}
              </div> */}
            </div>

            {/* Quick actions */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border">
                  <div className="py-1">
                    {block.status === "scheduled" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction(block.id, "start");
                          setShowActions(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </button>
                    )}
                    {block.status === "in-progress" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction(block.id, "complete");
                          setShowActions(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(block.id);
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Day Overview Component
function DayOverview({ schedule }: { schedule: IDailySchedule | null }) {
  const blocks = schedule?.scheduleBlocks || [];
  const completedBlocks = blocks.filter((b) => b.status === "completed").length;
  const totalBlocks = blocks.length;
  const completionRate =
    totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Day Overview</h3>

      <div className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {completedBlocks}/{totalBlocks}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            {completionRate}% complete
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Zap
                className={`h-4 w-4 ${scheduleUtils.getEnergyLevelColor(
                  schedule?.energyLevel || 3
                )}`}
              />
              <span className="text-lg font-bold text-gray-900">
                {schedule?.energyLevel || 3}
              </span>
            </div>
            <div className="text-xs text-gray-500">Energy</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {schedule?.productivityScore || 0}
            </div>
            <div className="text-xs text-gray-500">Productivity</div>
          </div>
        </div>

        {/* Mood */}
        {schedule?.mood && (
          <div className="text-center pt-2 border-t border-gray-200">
            <div className="text-2xl mb-1">
              {scheduleUtils.getMoodEmoji(schedule.mood)}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {schedule.mood}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Stats Component
function QuickStats({ blocks }: { blocks: ScheduleBlock[] }) {
  const stats = {
    scheduled: blocks.filter((b) => b.status === "scheduled").length,
    inProgress: blocks.filter((b) => b.status === "in-progress").length,
    completed: blocks.filter((b) => b.status === "completed").length,
    totalTime: blocks.reduce((acc, block) => {
      return (
        acc +
        (scheduleUtils.timeToMinutes(block.endTime) -
          scheduleUtils.timeToMinutes(block.startTime))
      );
    }, 0),
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Scheduled</span>
          <span className="text-sm font-medium text-blue-600">
            {stats.scheduled}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">In Progress</span>
          <span className="text-sm font-medium text-yellow-600">
            {stats.inProgress}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Completed</span>
          <span className="text-sm font-medium text-green-600">
            {stats.completed}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Total Time</span>
          <span className="text-sm font-medium text-gray-900">
            {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
          </span>
        </div>
      </div>
    </div>
  );
}
interface DailyGoalsProps {
  schedule: IDailySchedule | null;
  onUpdateReflection: (data: any) => Promise<void>; // Fixed return type
}
// Daily Goals Component
function DailyGoals({ schedule, onUpdateReflection }: DailyGoalsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [goals, setGoals] = useState<string[]>(schedule?.dailyGoals || []);
  const [newGoal, setNewGoal] = useState("");

  const handleSave = async () => {
    try {
      await onUpdateReflection({ dailyGoals: goals });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update goals:", error);
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Daily Goals</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addGoal()}
              placeholder="Add a goal..."
              className="flex-1 text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={addGoal}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span className="text-sm text-gray-900">{goal}</span>
                <button
                  onClick={() => removeGoal(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Save Goals
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {goals.length > 0 ? (
            goals.map((goal, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-900">{goal}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-2">
                No goals set for today
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Add your first goal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
