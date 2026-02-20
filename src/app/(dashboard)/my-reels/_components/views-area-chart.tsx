"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DAILY_VIEWS } from "@/app/(dashboard)/_data/mock-data";
import { drawOn, fadeInUp } from "@/lib/motion";

const W = 600;
const H = 200;
const PX = 30;
const PT = 20;
const PB = 30;

export function ViewsAreaChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxViews = Math.max(...DAILY_VIEWS.map((d) => d.views));
  const minViews = Math.min(...DAILY_VIEWS.map((d) => d.views));
  const range = maxViews - minViews || 1;

  const chartW = W - PX * 2;
  const chartH = H - PT - PB;

  const points = DAILY_VIEWS.map((d, i) => {
    const x = PX + (i / (DAILY_VIEWS.length - 1)) * chartW;
    const y = PT + (1 - (d.views - minViews) / range) * chartH;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  const areaPath = `${linePath} L${points[points.length - 1].x},${H - PB} L${points[0].x},${H - PB} Z`;

  // X-axis label days: 1, 5, 10, 15, 20, 25, 30
  const labelDays = [1, 5, 10, 15, 20, 25, 30];

  return (
    <motion.div
      className="chart-card"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold text-muted-rb uppercase tracking-wider">
            Vues quotidiennes
          </span>
          <span className="text-[11px] text-faded ml-2">30 derniers jours</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          className="overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="area-gradient-daily" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8A97E" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#C8A97E" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#area-gradient-daily)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Stroke line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#C8A97E"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={drawOn}
            initial="hidden"
            animate="visible"
          />

          {/* Interactive hover zones */}
          {points.map((p, i) => (
            <rect
              key={`hover-${i}`}
              x={p.x - chartW / DAILY_VIEWS.length / 2}
              y={PT}
              width={chartW / DAILY_VIEWS.length}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              className="cursor-crosshair"
            />
          ))}

          {/* Hover vertical line */}
          {hoveredIndex !== null && (
            <line
              x1={points[hoveredIndex].x}
              y1={PT}
              x2={points[hoveredIndex].x}
              y2={H - PB}
              stroke="#C8A97E"
              strokeWidth={1}
              strokeDasharray="4 3"
              opacity={0.6}
            />
          )}

          {/* Hover circle */}
          {hoveredIndex !== null && (
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].y}
              r={4}
              fill="#C8A97E"
              stroke="white"
              strokeWidth={2}
            />
          )}

          {/* X-axis labels */}
          {labelDays.map((day) => {
            const idx = day - 1;
            if (idx >= points.length) return null;
            return (
              <text
                key={`label-${day}`}
                x={points[idx].x}
                y={H - 8}
                textAnchor="middle"
                className="fill-muted-rb"
                style={{ fontSize: 10, fontWeight: 600 }}
              >
                {day}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute pointer-events-none bg-ink text-white px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-lg"
            style={{
              left: `${(points[hoveredIndex].x / W) * 100}%`,
              top: `${((points[hoveredIndex].y - 14) / H) * 100}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="text-gold font-bold">Jour {DAILY_VIEWS[hoveredIndex].day}</span>
            <span className="mx-1">·</span>
            <span>{DAILY_VIEWS[hoveredIndex].views.toLocaleString("fr-FR")} vues</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
