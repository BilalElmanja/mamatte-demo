"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  SCHEDULED_ITEMS,
  UNSCHEDULED_ITEMS,
  type ScheduledItem,
  type UnscheduledItem,
} from "./_data/calendar-data";
import { CalendarHeader } from "./_components/calendar-header";
import { WeekSummaryStrip } from "./_components/week-summary-strip";
import { CalendarGrid } from "./_components/calendar-grid";
import { MobileListView } from "./_components/mobile-list-view";
import { UnscheduledSidebar } from "./_components/unscheduled-sidebar";
import { DayDetailModal } from "./_components/day-detail-modal";
import { ScheduleModal } from "./_components/schedule-modal";

export default function CalendarPage() {
  // Month/year state — default Feb 2026
  const [currentMonth, setCurrentMonth] = useState(1); // 0-indexed, so 1 = February
  const [currentYear, setCurrentYear] = useState(2026);

  // Day detail modal state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Schedule modal state
  const [scheduleItem, setScheduleItem] = useState<UnscheduledItem | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Data state
  const [items, setItems] = useState<ScheduledItem[]>(SCHEDULED_ITEMS);
  const [unscheduled, setUnscheduled] = useState<UnscheduledItem[]>(UNSCHEDULED_ITEMS);

  // Toast state
  const [toastMsg, setToastMsg] = useState("");

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 2800);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Filter items for current month
  const monthItems = useMemo(() => {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const prefix = `${currentYear}-${monthStr}`;
    return items.filter((i) => i.date.startsWith(prefix));
  }, [items, currentMonth, currentYear]);

  // Day detail modal
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const dayDetailItems = useMemo(() => {
    if (selectedDay === null) return [];
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(selectedDay).padStart(2, "0");
    const dateStr = `${currentYear}-${m}-${d}`;
    return items.filter((i) => i.date === dateStr);
  }, [items, selectedDay, currentMonth, currentYear]);

  // Schedule modal
  const handleOpenSchedule = (item: UnscheduledItem | null) => {
    setScheduleItem(item);
    setScheduleOpen(true);
  };

  const handleSchedule = (data: {
    itemId: number;
    date: string;
    time: string;
    platform: "ig" | "tk" | "both";
  }) => {
    // Find the unscheduled item
    const unschedItem = unscheduled.find((u) => u.id === data.itemId);
    if (!unschedItem) return;

    // Create a new scheduled item
    const newItem: ScheduledItem = {
      id: unschedItem.id,
      hook: unschedItem.hook,
      emoji: unschedItem.emoji,
      cat: unschedItem.cat,
      status: "planifie",
      platform: data.platform,
      date: data.date,
      time: data.time,
    };

    // Add to scheduled, remove from unscheduled
    setItems((prev) => [...prev, newItem]);
    setUnscheduled((prev) => prev.filter((u) => u.id !== data.itemId));

    // Close modal and show toast
    setScheduleOpen(false);
    setScheduleItem(null);
    showToast("Contenu planifié avec succès");
  };

  // Mobile item click -> open day detail for that item's day
  const handleMobileItemClick = (item: ScheduledItem) => {
    const day = parseInt(item.date.split("-")[2], 10);
    setSelectedDay(day);
  };

  return (
    <>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <CalendarHeader
          month={currentMonth}
          year={currentYear}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          itemCount={monthItems.length}
          onScheduleClick={() => handleOpenSchedule(unscheduled[0] || null)}
        />

        {/* Status summary strip */}
        <WeekSummaryStrip items={monthItems} />

        {/* Main layout: calendar + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          {/* Desktop: calendar grid */}
          <div className="hidden md:block">
            <CalendarGrid
              month={currentMonth}
              year={currentYear}
              items={items}
              onDayClick={handleDayClick}
            />
          </div>

          {/* Mobile: list view */}
          <div className="md:hidden">
            <MobileListView
              items={monthItems}
              onItemClick={handleMobileItemClick}
            />
          </div>

          {/* Unscheduled sidebar — desktop only */}
          <div className="hidden lg:block">
            <UnscheduledSidebar
              items={unscheduled}
              onSchedule={handleOpenSchedule}
            />
          </div>
        </div>

        {/* Mobile: unscheduled section below */}
        <div className="lg:hidden mt-6">
          <UnscheduledSidebar
            items={unscheduled}
            onSchedule={handleOpenSchedule}
          />
        </div>
      </div>

      {/* Day detail modal */}
      <DayDetailModal
        open={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        day={selectedDay ?? 1}
        month={currentMonth}
        year={currentYear}
        items={dayDetailItems}
      />

      {/* Schedule modal */}
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
          setScheduleItem(null);
        }}
        item={scheduleItem}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onSchedule={handleSchedule}
      />

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8, x: "-50%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 md:bottom-6 left-1/2 z-50 pointer-events-none"
          >
            <div className="bg-ink text-white px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 shadow-2xl shadow-ink/20">
              <Icon icon="solar:check-circle-bold" width={17} />
              <span>{toastMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
