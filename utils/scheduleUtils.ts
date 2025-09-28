import { DailySchedule, ScheduleBlock } from "@/lib/types/schedule";

export const scheduleUtils = {
  // Get block status color
  getBlockStatusColor: (status: ScheduleBlock["status"]) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
      missed: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.scheduled;
  },

  // Get mood emoji
  getMoodEmoji: (mood: DailySchedule["mood"]) => {
    const emojis = {
      excellent: "😄",
      good: "😊",
      okay: "😐",
      poor: "😞",
      terrible: "😢",
    };
    return emojis[mood] || emojis.okay;
  },

  // Get energy level color
  getEnergyLevelColor: (level: DailySchedule["energyLevel"]) => {
    const colors = {
      1: "text-red-500",
      2: "text-orange-500",
      3: "text-yellow-500",
      4: "text-blue-500",
      5: "text-green-500",
    };
    return colors[level] || colors[3];
  },

  // Convert time to minutes
  timeToMinutes: (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  },

  // Convert minutes to time
  minutesToTime: (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  },

  // Check if times overlap
  timesOverlap: (
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ) => {
    const start1Min = scheduleUtils.timeToMinutes(start1);
    const end1Min = scheduleUtils.timeToMinutes(end1);
    const start2Min = scheduleUtils.timeToMinutes(start2);
    const end2Min = scheduleUtils.timeToMinutes(end2);
    return start1Min < end2Min && start2Min < end1Min;
  },

  // Format date for display
  formatDate: (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Get today's date in YYYY-MM-DD format
  getTodayDate: () => {
    return new Date().toISOString().split("T")[0];
  },

  // Generate time slots for dropdowns
  generateTimeSlots: (interval: number = 30) => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${min
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  },
};

