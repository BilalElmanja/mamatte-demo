"use client";

import { motion } from "framer-motion";
import { staggerContainer, cardPop } from "@/lib/motion";
import { CalendarDayCell } from "./calendar-day-cell";
import { DAYS_FR, type ScheduledItem } from "../_data/calendar-data";

type CalendarGridProps = {
  month: number;
  year: number;
  items: ScheduledItem[];
  onDayClick: (day: number) => void;
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  // We want Mon=0, Tue=1, ..., Sun=6
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function CalendarGrid({ month, year, items, onDayClick }: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Previous month padding
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  // Build cells
  const cells: Array<{
    day: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }> = [];

  // Prev month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = String(prevMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    cells.push({
      day: d,
      isCurrentMonth: false,
      dateStr: `${prevYear}-${m}-${dd}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const m = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    cells.push({
      day: d,
      isCurrentMonth: true,
      dateStr: `${year}-${m}-${dd}`,
    });
  }

  // Next month padding (fill to complete last row)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = String(nextMonth + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      cells.push({
        day: d,
        isCurrentMonth: false,
        dateStr: `${nextYear}-${m}-${dd}`,
      });
    }
  }

  // Today string
  const todayStr = "2026-02-20";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_FR.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-[11px] font-bold text-faded uppercase tracking-wider py-2"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          const dayItems = items.filter((i) => i.date === cell.dateStr);
          return (
            <motion.div key={`${cell.dateStr}-${idx}`} variants={cardPop}>
              <CalendarDayCell
                day={cell.day}
                isToday={cell.dateStr === todayStr}
                isCurrentMonth={cell.isCurrentMonth}
                items={dayItems}
                onClick={() => {
                  if (cell.isCurrentMonth) onDayClick(cell.day);
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
