"use client";

import { motion } from "framer-motion";
import { CATEGORY_PERFORMANCE } from "@/app/(dashboard)/_data/mock-data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const sorted = [...CATEGORY_PERFORMANCE].sort((a, b) => b.views - a.views);
const maxViews = sorted[0].views;

export function CategoryBars() {
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
          Performance par cat&eacute;gorie
        </span>
      </div>

      {/* Bars */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {sorted.map((cat, i) => {
          const widthPct = (cat.views / maxViews) * 100;

          return (
            <motion.div
              key={cat.cat}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="flex items-center gap-3"
            >
              {/* Label */}
              <span className="text-xs font-medium text-ink w-[90px] flex-shrink-0 truncate">
                {cat.cat}
              </span>

              {/* Bar */}
              <div className="flex-1 h-6 bg-beige/50 rounded-md overflow-hidden relative">
                <motion.div
                  className="h-full rounded-md"
                  style={{ background: cat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>

              {/* Value */}
              <span className="text-xs font-bold text-ink w-[42px] text-right flex-shrink-0">
                {cat.views.toLocaleString("fr-FR")}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
