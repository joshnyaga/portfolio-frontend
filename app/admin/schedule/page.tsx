"use client";

import React, { useState } from "react";
import DailySchedule from "@/components/schedule/DailySchedule";
import ScheduleBlockForm from "@/components/schedule/ScheduleBlockForm";
import { ScheduleBlock } from "@/lib/types/schedule";
import { scheduleUtils } from "@/utils/scheduleUtils";

export default function SchedulePage() {
  const [selectedBlock, setSelectedBlock] = useState<ScheduleBlock | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(scheduleUtils.getTodayDate());

  const handleBlockClick = (block: ScheduleBlock) => {
    setSelectedBlock(block);
    setIsFormOpen(true);
  };

  const handleCreateBlock = (date: string) => {
    setCurrentDate(date);
    setSelectedBlock(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedBlock(null);
  };

  const handleBlockSave = (block: ScheduleBlock) => {
    // The DailySchedule component will handle updates via its internal state
  };

  return (
    <div className="space-y-6">
      <DailySchedule
        onBlockClick={handleBlockClick}
        onCreateBlock={handleCreateBlock}
      />

      <ScheduleBlockForm
        block={selectedBlock}
        date={currentDate}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleBlockSave}
      />
    </div>
  );
}
