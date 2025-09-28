import { useState, useEffect } from 'react';
import { taskService, TaskFilters } from '@/services/taskService';
import { Task, TaskStats } from '@/lib/types/task';

export const useTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks(filters);
      console.log(response)
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [JSON.stringify(filters)]);

  const createTask = async (data: any) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks(prev => [newTask.data, ...prev]);
      return newTask;
    } catch (err) {
      throw err;
    }
  };

  const updateTask = async (id: string, data: any) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask.data : task));
      return updatedTask;
    } catch (err) {
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    pagination,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};