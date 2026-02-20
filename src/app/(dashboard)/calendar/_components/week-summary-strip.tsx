"use client";

import { motion } from "framer-motion";
import { slideUpBlur } from "@/lib/motion";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  type ScheduledItem,
  type ContentStatus,
} from "../_data/calendar-data";

type WeekSummaryStripProps = {
  items: ScheduledItem[];
};

export function WeekSummaryStrip({ items }: WeekSummaryStripProps) {
  const statusOrder: ContentStatus[] = [
    "publie",
    "planifie",
    "tournage",
    "montage",
    "script-pret",
    "idee",
  ];

  const counts = statusOrder.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    color: STATUS_COLORS[status],
    count: items.filter((i) => i.status === status).length,
  }));

  const nonZero = counts.filter((c) => c.count > 0);

  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.06 }}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 bg-white border border-stone-custom/40 rounded-xl px-4 py-3"
    >
      {nonZero.map((item) => (
        <div key={item.status} className="flex items-center gap-1.5">
          <span
            className="status-dot"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[11px] font-semibold text-ink">
            {item.count}
          </span>
          <span className="text-[11px] text-muted-rb">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
