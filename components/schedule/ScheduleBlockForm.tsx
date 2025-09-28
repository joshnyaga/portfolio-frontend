"use client";

import React, { useState, useEffect } from "react";
import { ScheduleBlock } from "@/lib/types/schedule";
import { scheduleService } from "@/services/scheduleService";
import { scheduleUtils } from "@/utils/scheduleUtils";
import { useTasks } from "@/hooks/useTasks";
import { X, Save, Clock } from "lucide-react";

interface ScheduleBlockFormProps {
  block?: ScheduleBlock | null;
  date: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: ScheduleBlock) => void;
}

export default function ScheduleBlockForm({
  block,
  date,
  isOpen,
  onClose,
  onSave,
}: ScheduleBlockFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other" as ScheduleBlock["category"],
    startTime: "",
    endTime: "",
    taskId: "",
    status: "scheduled" as ScheduleBlock["status"],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const { tasks } = useTasks({ status: "pending,in-progress", limit: 100 });

  useEffect(() => {
    if (block) {
      setFormData({
        title: block.title,
        description: block.description || "",
        category: block.category,
        startTime: block.startTime,
        endTime: block.endTime,
        taskId: block.taskId || "",
        status: block.status,
        notes: block.notes || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "other",
        startTime: "",
        endTime: "",
        taskId: "",
        status: "scheduled",
        notes: "",
      });
    }
  }, [block]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        taskId: formData.taskId || undefined,
      };

      let savedBlock;
      if (block) {
        const response = await scheduleService.updateScheduleBlock(
          date,
          block.id,
          submitData
        );
        savedBlock = response.data.scheduleBlocks.find(
          (b: ScheduleBlock) => b.id === block.id
        );
      } else {
        const response = await scheduleService.addScheduleBlock(
          date,
          submitData
        );
        savedBlock =
          response.data.scheduleBlocks[response.data.scheduleBlocks?.length - 1];
      }

      if (savedBlock) {
        onSave(savedBlock);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save schedule block:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = scheduleUtils.timeToMinutes(formData.startTime);
      const end = scheduleUtils.timeToMinutes(formData.endTime);
      if (end > start) {
        const duration = end - start;
        return `${Math.floor(duration / 60)}h ${duration % 60}m`;
      }
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {block ? "Edit Schedule Block" : "Add Schedule Block"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="dw-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
              placeholder="Enter block title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={2}
              className="dw-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
              placeholder="Enter description"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <select
                required
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="dw-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
              >
                <option value="">Select start time</option>
                {scheduleUtils.generateTimeSlots(15).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <select
                required
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                }
                className="dw-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
              >
                <option value="">Select end time</option>
                {scheduleUtils.generateTimeSlots(15).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration Display */}
          {calculateDuration() && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              Duration: {calculateDuration()}
            </div>
          )}

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as ScheduleBlock["category"],
                  }))
                }
                className="dw-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="learning">Learning</option>
                <option value="health">Health</option>
                <option value="project">Project</option>
                <option value="meeting">Meeting</option>
                <option value="break">Break</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as ScheduleBlock["status"],
                  }))
                }
                className="dw-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>

          {/* Link to Task */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link to Task (Optional)
            </label>
            <select
              value={formData.taskId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, taskId: e.target.value }))
              }
              className="dw-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
            >
              <option value="">No linked task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title} ({task.category})
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={2}
              className="dw-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
              placeholder="Additional notes"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {block ? "Update Block" : "Add Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
