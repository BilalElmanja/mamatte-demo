"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { rowIn } from "@/lib/motion";

export type Reel = {
  hook: string;
  cat: string;
  power: string[];
  views: string;
  likes: string;
  comments: string;
  date: string;
  emoji: string;
};

type ReelRowProps = {
  reel: Reel;
  index: number;
};

export function ReelRow({ reel, index }: ReelRowProps) {
  return (
    <motion.div
      variants={rowIn}
      custom={index}
      className={`reel-row flex items-start gap-4 px-5 py-4 ${index > 0 ? "border-t border-stone-custom/30" : ""} cursor-pointer`}
      onClick={() => window.open("https://instagram.com", "_blank")}
    >
      {/* Thumbnail */}
      <div className="thumb relative w-[72px] h-[72px] md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-beige to-stone-custom flex items-center justify-center shrink-0 overflow-hidden">
        <span className="text-2xl">{reel.emoji}</span>
        <div className="play-overlay absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
          <Icon icon="solar:play-bold" width={20} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-[14px] md:text-[15px] font-semibold text-ink leading-snug line-clamp-2 mb-1.5">
          {reel.hook}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="text-[10px] font-bold text-muted-rb bg-beige px-2 py-0.5 rounded">
            {reel.cat}
          </span>
          {reel.power.map((w) => (
            <span
              key={w}
              className="power-word text-[10px] font-bold text-ink bg-gold/15 px-2 py-0.5 rounded cursor-default"
            >
              &laquo; {w} &raquo;
            </span>
          ))}
        </div>
        <p className="text-[11px] text-faded">
          Publi\u00e9 le {reel.date}
        </p>
      </div>

      {/* Metrics */}
      <div className="flex flex-col items-end gap-1 shrink-0 pt-1">
        <div className="metric flex items-center gap-1.5">
          <span className="metric-val text-sm font-bold text-ink">
            {reel.views}
          </span>
          <Icon icon="solar:eye-linear" width={14} className="text-faded" />
        </div>
        <div className="metric flex items-center gap-1.5">
          <span className="metric-val text-xs font-semibold text-muted-rb">
            {reel.likes}
          </span>
          <Icon icon="solar:heart-linear" width={12} className="text-faded" />
        </div>
        <div className="metric flex items-center gap-1.5">
          <span className="metric-val text-xs font-semibold text-muted-rb">
            {reel.comments}
          </span>
          <Icon
            icon="solar:chat-round-linear"
            width={12}
            className="text-faded"
          />
        </div>
      </div>
    </motion.div>
  );
}
