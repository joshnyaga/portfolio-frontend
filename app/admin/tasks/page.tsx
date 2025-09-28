"use client";

import React, { useState } from "react";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import { Task } from "@/lib/types/task";

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSave = (task: Task) => {
    // The TaskList component will handle updates via its internal state
    // You might want to add a refetch function here if needed
  };

  return (
    <div className="space-y-6">
      <TaskList onTaskClick={handleTaskClick} onCreateTask={handleCreateTask} />

      <TaskForm
        task={selectedTask}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleTaskSave}
      />
    </div>
  );
}
