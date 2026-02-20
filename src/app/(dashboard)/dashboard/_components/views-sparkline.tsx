"use client";

import { motion } from "framer-motion";
import { WEEKLY_VIEWS } from "@/app/(dashboard)/_data/mock-data";
import { drawOn, fadeInUp } from "@/lib/motion";

const W = 400;
const H = 120;
const PADDING_X = 10;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 24;

export function ViewsSparkline() {
  const maxViews = Math.max(...WEEKLY_VIEWS.map((d) => d.views));
  const minViews = Math.min(...WEEKLY_VIEWS.map((d) => d.views));
  const range = maxViews - minViews || 1;

  const chartW = W - PADDING_X * 2;
  const chartH = H - PADDING_TOP - PADDING_BOTTOM;

  const points = WEEKLY_VIEWS.map((d, i) => {
    const x = PADDING_X + (i / (WEEKLY_VIEWS.length - 1)) * chartW;
    const y = PADDING_TOP + (1 - (d.views - minViews) / range) * chartH;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  const areaPath = `${linePath} L${points[points.length - 1].x},${H - PADDING_BOTTOM} L${points[0].x},${H - PADDING_BOTTOM} Z`;

  return (
    <motion.div
      className="chart-card"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-muted-rb uppercase tracking-wider">
          Vues hebdomadaires
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-ink">9 200</span>
          <span className="text-[11px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded-md">
            ↑ +9.5%
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A97E" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#C8A97E" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#sparkline-gradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Stroke line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#C8A97E"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawOn}
          initial="hidden"
          animate="visible"
        />

        {/* X-axis labels */}
        {WEEKLY_VIEWS.map((d, i) => {
          const x = PADDING_X + (i / (WEEKLY_VIEWS.length - 1)) * chartW;
          return (
            <text
              key={d.week}
              x={x}
              y={H - 4}
              textAnchor="middle"
              className="fill-muted-rb"
              style={{ fontSize: 9, fontWeight: 600 }}
            >
              {d.week}
            </text>
          );
        })}
      </svg>
    </motion.div>
  );
}
