import { ApiResponse } from "@/lib/types";
import { api } from "@/lib/types/api/client";
import {
  DailySchedule,
  ScheduleBlock,
  ScheduleAnalytics,
} from "@/lib/types/schedule";

export interface CreateScheduleBlockData {
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  category: ScheduleBlock["category"];
  taskId?: string;
}

export interface UpdateScheduleBlockData
  extends Partial<CreateScheduleBlockData> {
  status?: ScheduleBlock["status"];
  actualStartTime?: string;
  actualEndTime?: string;
  notes?: string;
}

export interface UpdateReflectionData {
  dailyGoals?: string[];
  accomplishments?: string[];
  challenges?: string[];
  mood?: DailySchedule["mood"];
  energyLevel?: DailySchedule["energyLevel"];
  productivityScore?: number;
  notes?: string;
}

export const scheduleService = {
  // Get schedule by date
  getScheduleByDate: (date: string) =>
    api.get<ApiResponse>(`/schedules/${date}`),

  // Get schedules for date range
  getScheduleRange: (startDate: string, endDate: string) =>
    api.get<ApiResponse[]>(
      `/schedules/range?startDate=${startDate}&endDate=${endDate}`
    ),

  // Create or update entire schedule
  createOrUpdateSchedule: (date: string, data: Partial<DailySchedule>) =>
    api.put<ApiResponse>(`/schedules/${date}`, data),

  // Add schedule block
  addScheduleBlock: (date: string, data: CreateScheduleBlockData) =>
    api.post<ApiResponse>(`/schedules/${date}/blocks`, data),

  // Update schedule block
  updateScheduleBlock: (
    date: string,
    blockId: string,
    data: UpdateScheduleBlockData
  ) => api.put<ApiResponse>(`/schedules/${date}/blocks/${blockId}`, data),

  // Delete schedule block
  deleteScheduleBlock: (date: string, blockId: string) =>
    api.delete<ApiResponse>(`/schedules/${date}/blocks/${blockId}`),

  // Update daily reflection
  updateDailyReflection: (date: string, data: UpdateReflectionData) =>
    api.patch<ApiResponse>(`/schedules/${date}/reflection`, data),

  // Get schedule analytics
  getScheduleAnalytics: (days?: number) =>
    api.get<ScheduleAnalytics>(
      `/schedules/analytics${days ? `?days=${days}` : ""}`
    ),

  // Quick block status update
  updateBlockStatus: (
    date: string,
    blockId: string,
    status: ScheduleBlock["status"]
  ) => scheduleService.updateScheduleBlock(date, blockId, { status }),

  // Start a schedule block
  startBlock: (date: string, blockId: string) =>
    scheduleService.updateScheduleBlock(date, blockId, {
      status: "in-progress",
      actualStartTime: new Date().toTimeString().slice(0, 5),
    }),

  // Complete a schedule block
  completeBlock: (date: string, blockId: string, notes?: string) =>
    scheduleService.updateScheduleBlock(date, blockId, {
      status: "completed",
      actualEndTime: new Date().toTimeString().slice(0, 5),
      notes,
    }),
};
