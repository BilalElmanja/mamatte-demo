"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { rowIn } from "@/lib/motion";

export type Outlier = {
  id: number;
  hook: string;
  account: string;
  views: string;
  likes: string;
  date: string;
  viral: boolean;
  emoji: string;
  platform: "ig" | "tk";
};

type OutlierRowProps = {
  outlier: Outlier;
  index: number;
  onInspire: (id: number, platform: "ig" | "tk") => void;
};

export function OutlierRow({ outlier, index, onInspire }: OutlierRowProps) {
  const isTK = outlier.platform === "tk";

  return (
    <motion.div
      variants={rowIn}
      custom={index}
      className={`outlier-row ${outlier.viral ? "border-l-[3px] border-l-orange-500" : ""} flex items-center gap-3 md:grid md:grid-cols-[56px_1fr_120px_80px_65px_70px_90px] md:gap-3 px-5 py-3.5 ${index > 0 ? "border-t border-stone-custom/30" : ""}`}
    >
      {/* Emoji thumbnail */}
      <div
        className={`w-11 h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${isTK ? "from-pink-50 to-stone-custom" : "from-beige to-stone-custom"} flex items-center justify-center shrink-0 relative`}
      >
        <span className="text-lg">{outlier.emoji}</span>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-custom/20">
          <Icon
            icon={isTK ? "simple-icons:tiktok" : "simple-icons:instagram"}
            width={8}
            className={isTK ? "text-tiktok" : "text-[#E1306C]"}
          />
        </div>
      </div>

      {/* Hook text */}
      <div className="flex-1 min-w-0 md:pr-2">
        <p className="text-[13px] md:text-[14px] font-semibold text-ink leading-snug line-clamp-2">
          {outlier.hook}
        </p>
        <div className="flex gap-1 mt-1 md:hidden">
          <span className="text-[10px] text-muted-rb">@{outlier.account}</span>
          <span className="text-[10px] text-muted-rb">&middot;</span>
          <span className="text-[10px] font-bold text-ink">
            {outlier.views}
            {outlier.viral && " \ud83d\udd25"}
          </span>
        </div>
      </div>

      {/* Account - desktop */}
      <span className="hidden md:block text-xs font-medium text-muted-rb truncate">
        @{outlier.account}
      </span>

      {/* Views - desktop */}
      <span className="hidden md:flex items-center gap-1 text-sm font-bold text-ink">
        {outlier.views}
        {outlier.viral && (
          <span className="text-orange-500 text-xs">{"\ud83d\udd25"}</span>
        )}
      </span>

      {/* Likes - desktop */}
      <span className="hidden md:block text-xs font-semibold text-muted-rb">
        {outlier.likes}
      </span>

      {/* Date - desktop */}
      <span className="hidden md:block text-xs text-faded">
        {outlier.date}
      </span>

      {/* Inspire button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onInspire(outlier.id, outlier.platform);
        }}
        className="inspire-btn border border-gold/60 rounded-lg px-3 py-1.5 text-[10px] font-bold text-gold flex items-center gap-1 shrink-0 whitespace-nowrap"
      >
        <Icon icon="solar:magic-stick-3-linear" width={12} />
        S&apos;inspirer
      </button>
    </motion.div>
  );
}
