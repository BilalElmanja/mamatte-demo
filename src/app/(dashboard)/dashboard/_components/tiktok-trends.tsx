"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";
import { TIKTOK_TRENDS } from "../../_data/mock-data";

export function TikTokTrends() {
  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.24 }}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon icon="simple-icons:tiktok" width={14} className="text-tiktok" />
        <h2 className="text-sm font-bold text-ink">TikTok Trends</h2>
        <span className="ml-auto text-[9px] font-bold text-tiktok bg-tiktok-bg px-2 py-0.5 rounded-full">
          Cette semaine
        </span>
      </div>
      <div className="space-y-2">
        {TIKTOK_TRENDS.map((trend) => (
          <div key={trend.rank} className="flex items-center gap-2.5 py-1.5">
            <span className="text-[10px] font-bold text-tiktok bg-tiktok-bg w-5 h-5 rounded-md flex items-center justify-center">
              {trend.rank}
            </span>
            <span className="text-[12px] font-semibold text-ink flex-1">
              {trend.hashtag}
            </span>
            <span className="text-[10px] text-muted-rb">{trend.views}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
