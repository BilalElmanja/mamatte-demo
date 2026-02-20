"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";
import { MONTHS_FR } from "../_data/calendar-data";

type CalendarHeaderProps = {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  itemCount: number;
  onScheduleClick: () => void;
};

export function CalendarHeader({
  month,
  year,
  onPrev,
  onNext,
  itemCount,
  onScheduleClick,
}: CalendarHeaderProps) {
  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
          <span className="font-serif italic text-gold">Calendrier</span>
        </h1>
        <p className="text-sm text-muted-rb mt-1">
          Planifiez et suivez vos contenus
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Month navigation */}
        <div className="flex items-center gap-2 bg-white border border-stone-custom/40 rounded-xl px-3 py-2">
          <button
            onClick={onPrev}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-beige transition-colors"
          >
            <Icon icon="solar:alt-arrow-left-linear" width={16} className="text-ink" />
          </button>
          <span className="text-sm font-bold text-ink min-w-[140px] text-center">
            {MONTHS_FR[month]} {year}
          </span>
          <button
            onClick={onNext}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-beige transition-colors"
          >
            <Icon icon="solar:alt-arrow-right-linear" width={16} className="text-ink" />
          </button>
        </div>

        {/* Item count badge */}
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-rb bg-beige/60 border border-stone-custom/30 px-3 py-2 rounded-xl">
          <Icon icon="solar:calendar-bold" width={14} className="text-gold" />
          {itemCount} contenus
        </span>

        {/* Schedule button */}
        <button
          onClick={onScheduleClick}
          className="btn-primary bg-ink text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-ink/10"
        >
          <Icon icon="solar:add-circle-linear" width={16} />
          Planifier
        </button>
      </div>
    </motion.div>
  );
}
