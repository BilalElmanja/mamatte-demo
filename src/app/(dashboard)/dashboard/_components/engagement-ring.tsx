"use client";

import { motion } from "framer-motion";
import { ENGAGEMENT_DATA } from "@/app/(dashboard)/_data/mock-data";
import { fadeInUp } from "@/lib/motion";

const RADIUS = 70;
const STROKE_WIDTH = 20;
const CENTER = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SEGMENTS = [
  { key: "likes", label: "Likes", value: ENGAGEMENT_DATA.likes, color: "#C8A97E" },
  { key: "comments", label: "Commentaires", value: ENGAGEMENT_DATA.comments, color: "#8b5cf6" },
  { key: "saves", label: "Sauvegardes", value: ENGAGEMENT_DATA.saves, color: "#10b981" },
];

export function EngagementRing() {
  const total = ENGAGEMENT_DATA.total;

  // Calculate cumulative offsets for each segment
  let cumulativeOffset = 0;
  const segmentData = SEGMENTS.map((seg) => {
    const proportion = seg.value / total;
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
      <div className="mb-3">
        <span className="text-xs font-bold text-muted-rb uppercase tracking-wider">
          Engagement
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* SVG Donut */}
        <div className="flex-shrink-0">
          <svg width={120} height={120} viewBox="0 0 200 200">
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
                key={seg.key}
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
                  delay: 0.2 + i * 0.15,
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
              style={{ fontSize: 24, fontWeight: 700 }}
            >
              1 648
            </text>
            <text
              x={CENTER}
              y={CENTER + 14}
              textAnchor="middle"
              className="fill-muted-rb"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              total
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5">
          {SEGMENTS.map((seg) => (
            <div key={seg.key} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: seg.color }}
              />
              <span className="text-xs text-muted-rb">{seg.label}</span>
              <span className="text-xs font-bold text-ink ml-auto">
                {seg.value.toLocaleString("fr-FR")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
