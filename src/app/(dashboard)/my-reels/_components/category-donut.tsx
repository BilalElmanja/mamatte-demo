"use client";

import { motion } from "framer-motion";
import { REELS } from "@/app/(dashboard)/_data/mock-data";
import { fadeInUp } from "@/lib/motion";

const RADIUS = 70;
const STROKE_WIDTH = 20;
const CENTER = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CATEGORY_COLORS: Record<string, string> = {
  "BTS": "#f59e0b",
  "ASMR": "#8b5cf6",
  "Recette": "#10b981",
  "Tendance": "#f43f5e",
  "Story": "#3b82f6",
};

// Count reels per category
function getCategoryCounts() {
  const counts: Record<string, number> = {};
  REELS.forEach((reel) => {
    // Extract category name from emoji label (e.g., "BTS" from "BTS")
    const catName = reel.cat.replace(/^[^\w]*\s*/, "").trim();
    counts[catName] = (counts[catName] || 0) + 1;
  });
  return counts;
}

const categoryCounts = getCategoryCounts();
const totalReels = REELS.length;

const segments = Object.entries(categoryCounts).map(([name, count]) => ({
  name,
  count,
  color: CATEGORY_COLORS[name] || "#8B8680",
  emoji: name === "BTS" ? "\ud83c\udf73" : name === "ASMR" ? "\ud83d\udd0a" : name === "Recette" ? "\ud83e\uddd1\u200d\ud83c\udf73" : name === "Tendance" ? "\ud83d\udd25" : "\ud83d\udcd6",
  percentage: Math.round((count / totalReels) * 100),
}));

export function CategoryDonut() {
  let cumulativeOffset = 0;
  const segmentData = segments.map((seg) => {
    const proportion = seg.count / totalReels;
    const dashLength = proportion * CIRCUMFERENCE;
    const gapLength = CIRCUMFERENCE - dashLength;
    const offset = -cumulativeOffset;
    cumulativeOffset += dashLength;
    return { ...seg, dashLength, gapLength, offset };
  });

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
          R&eacute;partition par cat&eacute;gorie
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut */}
        <div className="flex-shrink-0">
          <svg width={140} height={140} viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="rgba(232, 226, 218, 0.3)"
              strokeWidth={STROKE_WIDTH}
            />

            {/* Segments */}
            {segmentData.map((seg, i) => (
              <motion.circle
                key={seg.name}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={`${seg.dashLength} ${seg.gapLength}`}
                strokeDashoffset={seg.offset}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: seg.offset }}
                transition={{
                  duration: 1,
                  delay: 0.2 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}

            {/* Center text */}
            <text
              x={CENTER}
              y={CENTER - 4}
              textAnchor="middle"
              className="fill-ink"
              style={{ fontSize: 26, fontWeight: 700 }}
            >
              {totalReels}
            </text>
            <text
              x={CENTER}
              y={CENTER + 14}
              textAnchor="middle"
              className="fill-muted-rb"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              reels
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1">
          {segments.map((seg) => (
            <div key={seg.name} className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: seg.color }}
              />
              <span className="text-xs text-ink">
                {seg.emoji} {seg.name}
              </span>
              <span className="text-xs font-bold text-ink ml-auto">
                {seg.count}
              </span>
              <span className="text-[10px] text-muted-rb w-[32px] text-right">
                {seg.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
