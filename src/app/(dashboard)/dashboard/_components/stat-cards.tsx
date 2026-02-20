"use client";

import { motion } from "framer-motion";
import { slideUpBlur, staggerContainer } from "@/lib/motion";
import { DASHBOARD_STATS } from "../../_data/mock-data";

export function StatCards() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7"
    >
      {DASHBOARD_STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          variants={slideUpBlur}
          className="stat-card bg-white rounded-2xl border border-stone-custom/40 p-5"
        >
          <p className="text-[10px] font-bold text-faded uppercase tracking-wider mb-2">
            {stat.label}
          </p>
          <p className="text-3xl font-extrabold text-ink">{stat.value}</p>
          {stat.change && (
            <p className={`text-[11px] font-bold mt-1 ${stat.changeColor}`}>
              {stat.change}
            </p>
          )}
          {stat.sub && (
            <div className="flex gap-1 mt-1">
              {stat.sub.map((s) => (
                <span
                  key={s.label}
                  className={`text-[9px] font-bold ${s.color} ${s.bg} px-1.5 py-0.5 rounded`}
                >
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
