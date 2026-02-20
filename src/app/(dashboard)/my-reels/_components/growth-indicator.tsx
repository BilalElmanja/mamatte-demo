"use client";

import { motion } from "framer-motion";
import { GROWTH_DATA } from "@/app/(dashboard)/_data/mock-data";
import { fadeInUp, drawOn } from "@/lib/motion";

const SPARKLINE_POINTS = "10,25 25,20 40,22 55,12 70,8";

export function GrowthIndicator() {
  return (
    <motion.div
      className="chart-card flex flex-col justify-between"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* Growth percentage */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-bold text-green-500"
        >
          +{GROWTH_DATA.change}%
        </motion.div>
        <p className="text-xs text-muted-rb mt-1">vs. mois dernier</p>
      </div>

      {/* Mini sparkline */}
      <div className="my-3">
        <svg width="100%" viewBox="0 0 80 30" className="overflow-visible">
          <motion.polyline
            points={SPARKLINE_POINTS}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={drawOn}
            initial="hidden"
            animate="visible"
          />
        </svg>
      </div>

      {/* Values */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-ink">
            {GROWTH_DATA.current.toLocaleString("fr-FR")} vues
          </span>
          <span className="text-[10px] text-muted-rb">ce mois</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm text-muted-rb">
            {GROWTH_DATA.previous.toLocaleString("fr-FR")} vues
          </span>
          <span className="text-[10px] text-faded">mois pr&eacute;c&eacute;dent</span>
        </div>
      </div>
    </motion.div>
  );
}
