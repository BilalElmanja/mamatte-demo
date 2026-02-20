"use client";

import { Icon } from "@iconify/react";

const TRENDS = [
  "#CoffeeTok",
  "#BaristaLife",
  "#ASMRcafe",
  "#FoodTok",
  "#SmallBusiness",
];

export function TikTokTrendBar() {
  return (
    <div className="bg-gradient-to-r from-tiktok-bg to-cream border border-pink-100/50 rounded-xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-2">
        <Icon icon="simple-icons:tiktok" width={16} className="text-tiktok" />
        <span className="text-[13px] font-bold text-ink">
          Tendances TikTok de la semaine
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {TRENDS.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-bold text-tiktok bg-white border border-pink-200/50 px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
