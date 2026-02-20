"use client";

import { motion } from "framer-motion";
import { POSTING_HEATMAP } from "@/app/(dashboard)/_data/mock-data";
import { fadeInUp, staggerContainer, cardPop } from "@/lib/motion";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];
const WEEKS = ["Sem. 1", "Sem. 2", "Sem. 3", "Sem. 4"];
const HEAT_CLASSES = ["heat-0", "heat-1", "heat-2", "heat-3"];

export function PostingHeatmap() {
  return (
    <motion.div
      className="chart-card"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="mb-4">
        <span className="text-xs font-bold text-muted-rb uppercase tracking-wider">
          Fr&eacute;quence de publication
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        {/* Day column labels */}
        <div className="flex items-center gap-1.5 mb-2 ml-[52px]">
          {DAYS.map((day, i) => (
            <span
              key={`day-${i}`}
              className="w-8 h-5 flex items-center justify-center text-[10px] font-bold text-muted-rb"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Rows (weeks) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1.5"
        >
          {POSTING_HEATMAP.map((week, wIdx) => (
            <div key={`week-${wIdx}`} className="flex items-center gap-1.5">
              {/* Row label */}
              <span className="w-[48px] text-[10px] font-bold text-muted-rb text-right pr-1 flex-shrink-0">
                {WEEKS[wIdx]}
              </span>

              {/* Cells */}
              {week.map((value, dIdx) => (
                <motion.div
                  key={`cell-${wIdx}-${dIdx}`}
                  variants={cardPop}
                  className={`w-8 h-8 rounded-md ${HEAT_CLASSES[Math.min(value, 3)]} cursor-default`}
                  title={`${value} publication${value !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 ml-[52px]">
        <span className="text-[10px] text-muted-rb mr-1">Moins</span>
        {[0, 1, 2, 3].map((level) => (
          <div
            key={`legend-${level}`}
            className={`w-4 h-4 rounded-sm ${HEAT_CLASSES[level]}`}
            title={`${level}${level === 3 ? "+" : ""}`}
          />
        ))}
        <span className="text-[10px] text-muted-rb ml-1">Plus</span>
      </div>
    </motion.div>
  );
}
