"use client";

import { CalendarItemChip } from "./calendar-item-chip";
import type { ScheduledItem } from "../_data/calendar-data";

type CalendarDayCellProps = {
  day: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  items: ScheduledItem[];
  onClick: () => void;
};

export function CalendarDayCell({
  day,
  isToday,
  isCurrentMonth,
  items,
  onClick,
}: CalendarDayCellProps) {
  const cellClass = [
    "cal-cell",
    isToday ? "today" : "",
    !isCurrentMonth ? "other-month" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const visibleItems = items.slice(0, 2);
  const overflow = items.length - 2;

  return (
    <div
      className={`${cellClass} p-2 min-h-[100px] bg-white relative`}
      onClick={onClick}
    >
      <span
        className={`text-[12px] font-bold ${
          isToday
            ? "bg-gold text-white w-6 h-6 rounded-full flex items-center justify-center"
            : isCurrentMonth
            ? "text-ink"
            : "text-faded"
        }`}
      >
        {day}
      </span>

      <div className="mt-1.5 flex flex-col gap-1">
        {visibleItems.map((item) => (
          <CalendarItemChip key={item.id} item={item} />
        ))}
        {overflow > 0 && (
          <span className="text-[10px] font-bold text-gold mt-0.5">
            +{overflow}
          </span>
        )}
      </div>
    </div>
  );
}
