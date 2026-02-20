"use client";

import { CAT_COLORS, type ScheduledItem } from "../_data/calendar-data";

type CalendarItemChipProps = {
  item: ScheduledItem;
};

export function CalendarItemChip({ item }: CalendarItemChipProps) {
  const catColor = CAT_COLORS[item.cat] || { bg: "bg-gray-50", text: "text-gray-700" };

  return (
    <div className={`cal-chip ${catColor.bg} ${catColor.text} flex items-center gap-1`}>
      <span>{item.emoji}</span>
      <span className="truncate">{item.hook}</span>
    </div>
  );
}
