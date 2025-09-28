'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/lib/types/task';
import { taskService } from '@/services/taskService';
import { scheduleUtils } from '@/utils/scheduleUtils';
import { X, Save, Calendar, Clock, Tag, Plus } from 'lucide-react';

interface TaskFormProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function TaskForm({ task, isOpen, onClose, onSave }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other" as Task["category"],
    priority: "medium" as Task["priority"],
    status: "pending" as Task["status"],
    dueDate: "",
    scheduledDate: "",
    scheduledTime: "",
    estimatedDuration: "",
    tags: [] as string[],
    notes: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        category: task.category,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        scheduledDate: task.scheduledDate
          ? task.scheduledDate.split("T")[0]
          : "",
        scheduledTime: task.scheduledTime || "",
        estimatedDuration: task.estimatedDuration?.toString() || "",
        tags: task.tags || [],
        notes: task.notes || "",
      });
    } else {
      // Reset form for new task
      setFormData({
        title: "",
        description: "",
        category: "other",
        priority: "medium",
        status: "pending",
        dueDate: "",
        scheduledDate: "",
        scheduledTime: "",
        estimatedDuration: "",
        tags: [],
        notes: "",
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        estimatedDuration: formData.estimatedDuration
          ? parseInt(formData.estimatedDuration)
          : undefined,
        dueDate: formData.dueDate || undefined,
        scheduledDate: formData.scheduledDate || undefined,
        scheduledTime: formData.scheduledTime || undefined,
      };

      let savedTask;
      if (task) {
        savedTask = await taskService.updateTask(task._id, submitData);
      } else {
        savedTask = await taskService.createTask(submitData);
      }

      onSave(savedTask.data);
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? "Edit Task" : "Create New Task"}
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
              transition outline-none"
              placeholder="Enter task title"
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
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500
              transition outline-none"
              placeholder="Enter task description"
            />
          </div>

          {/* Category, Priority, Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as Task["category"],
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                transition outline-none bg-white"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="learning">Learning</option>
                <option value="health">Health</option>
                <option value="project">Project</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as Task["priority"],
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                transition outline-none bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
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
                    status: e.target.value as Task["status"],
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                transition outline-none bg-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="deferred">Deferred</option>
              </select>
            </div>
          </div>

          {/* Dates and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                 transition outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedDuration: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                 transition outline-none bg-white"
                placeholder="e.g., 60"
              />
            </div>
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledDate: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                 transition outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Time
              </label>
              <select
                value={formData.scheduledTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledTime: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                 transition outline-none bg-white"
              >
                <option value="">Select time...</option>
                {scheduleUtils.generateTimeSlots(30).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 w-full rounded-md border border-gray-300 px-3 py-2
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                 transition outline-none bg-white"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                 transition outline-none bg-white"
              placeholder="Additional notes or details"
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
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
