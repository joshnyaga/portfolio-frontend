import { scheduleService } from "@/services/scheduleService";
import { DailySchedule, ScheduleAnalytics } from "@/lib/types/schedule";
import { useEffect, useState } from "react";

export const useSchedule = (date: string) => {
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getScheduleByDate(date);
      setSchedule(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      fetchSchedule();
    }
  }, [date]);

  const addBlock = async (blockData: any) => {
    try {
      const updatedSchedule = await scheduleService.addScheduleBlock(
        date,
        blockData
      );
      setSchedule(updatedSchedule.data);
      return updatedSchedule;
    } catch (err) {
      throw err;
    }
  };

  const updateBlock = async (blockId: string, data: any) => {
    try {
      const updatedSchedule = await scheduleService.updateScheduleBlock(
        date,
        blockId,
        data
      );
      setSchedule(updatedSchedule.data);
      return updatedSchedule;
    } catch (err) {
      throw err;
    }
  };

  const deleteBlock = async (blockId: string) => {
    try {
      const updatedSchedule = await scheduleService.deleteScheduleBlock(
        date,
        blockId
      );
      setSchedule(updatedSchedule.data);
      return updatedSchedule;
    } catch (err) {
      throw err;
    }
  };

  const updateReflection = async (data: any) => {
    try {
      const updatedSchedule = await scheduleService.updateDailyReflection(
        date,
        data
      );
      setSchedule(updatedSchedule.data);
      return updatedSchedule;
    } catch (err) {
      throw err;
    }
  };

  return {
    schedule,
    loading,
    error,
    refetch: fetchSchedule,
    addBlock,
    updateBlock,
    deleteBlock,
   updateReflection,
  };
};
