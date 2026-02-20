"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { staggerContainer, cardPop } from "@/lib/motion";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  MONTHS_FR,
  DAYS_FR,
  type ScheduledItem,
} from "../_data/calendar-data";

type MobileListViewProps = {
  items: ScheduledItem[];
  onItemClick: (item: ScheduledItem) => void;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const dayOfWeek = d.getDay();
  // Convert from Sun=0 to Mon=0
  const frDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const dayName = DAYS_FR[frDayIndex];
  const dayNum = d.getDate();
  const monthName = MONTHS_FR[d.getMonth()];
  return `${dayName} ${dayNum} ${monthName}`;
}

export function MobileListView({ items, onItemClick }: MobileListViewProps) {
  // Sort by date ascending
  const sorted = [...items].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group by date
  const groups: Record<string, ScheduledItem[]> = {};
  for (const item of sorted) {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  }

  const todayStr = "2026-02-20";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      {Object.entries(groups).map(([date, dateItems]) => (
        <motion.div key={date} variants={cardPop}>
          {/* Date header */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[12px] font-bold ${
                date === todayStr ? "text-gold" : "text-ink"
              }`}
            >
              {formatDate(date)}
            </span>
            {date === todayStr && (
              <span className="text-[9px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                Aujourd&apos;hui
              </span>
            )}
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2">
            {dateItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick(item)}
                className="bg-white border border-stone-custom/40 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-gold/30 transition-colors"
              >
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-ink truncate">
                    {item.hook}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${STATUS_COLORS[item.status]}15`,
                        color: STATUS_COLORS[item.status],
                      }}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                    {/* Platform */}
                    <span className="flex items-center gap-1">
                      {(item.platform === "ig" || item.platform === "both") && (
                        <Icon
                          icon="simple-icons:instagram"
                          width={10}
                          className="text-[#E1306C]"
                        />
                      )}
                      {(item.platform === "tk" || item.platform === "both") && (
                        <Icon
                          icon="simple-icons:tiktok"
                          width={9}
                          className="text-ink"
                        />
                      )}
                    </span>
                    {item.time && (
                      <span className="text-[10px] text-faded">
                        {item.time}
                      </span>
                    )}
                  </div>
                </div>
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  width={14}
                  className="text-faded flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
