"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";
import { LATEST_IDEAS_PREVIEW } from "../../_data/mock-data";

export function LatestIdeas() {
  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.12 }}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-stone-custom/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="solar:lightbulb-linear" width={18} className="text-gold" />
          <h2 className="text-sm font-bold text-ink">Dernières idées</h2>
        </div>
        <Link
          href="/ideas"
          className="text-[11px] font-bold text-gold hover:text-golddark transition-colors"
        >
          Tout voir →
        </Link>
      </div>
      <div>
        {LATEST_IDEAS_PREVIEW.map((idea, i) => (
          <div
            key={idea.id}
            className={`idea-row px-5 py-3.5 flex items-start gap-3 ${
              i < LATEST_IDEAS_PREVIEW.length - 1 ? "border-b border-stone-custom/20" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-beige flex items-center justify-center flex-shrink-0 text-sm">
              {idea.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-ink leading-snug line-clamp-1">
                {idea.hook}
              </p>
              <div className="flex gap-1 mt-1">
                <span className="text-[9px] font-bold text-muted-rb bg-beige px-1.5 py-0.5 rounded">
                  {idea.cat}
                </span>
                <span className={`text-[9px] font-bold ${idea.diffColor} px-1.5 py-0.5 rounded`}>
                  {idea.diff}
                </span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {idea.platforms.includes("ig") && (
                <span className="text-[8px] font-bold text-[#E1306C] bg-pink-50 px-1.5 py-0.5 rounded">
                  <Icon icon="simple-icons:instagram" width={8} />
                </span>
              )}
              {idea.platforms.includes("tk") && (
                <span className="text-[8px] font-bold text-tiktok bg-tiktok-bg px-1.5 py-0.5 rounded">
                  <Icon icon="simple-icons:tiktok" width={7} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
