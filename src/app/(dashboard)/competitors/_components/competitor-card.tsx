"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cardPop } from "@/lib/motion";

export type Competitor = {
  id: number;
  handle: string;
  name: string;
  initial: string;
  followers: string;
  reels: string;
  topViews: string;
  growth: string;
  growthPositive: boolean;
  platform: "ig" | "tk";
  gradient: string;
};

type CompetitorCardProps = {
  competitor: Competitor;
  onDelete: (id: number) => void;
};

export function CompetitorCard({ competitor, onDelete }: CompetitorCardProps) {
  const isIG = competitor.platform === "ig";

  return (
    <motion.div
      variants={cardPop}
      className="comp-card bg-white rounded-2xl border border-stone-custom/40 p-5 relative"
    >
      {/* Platform badge */}
      <div className="absolute top-4 right-4">
        {isIG ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#E1306C] bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
            <Icon icon="simple-icons:instagram" width={9} />
            Instagram
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-tiktok bg-tiktok-bg border border-pink-100 px-2 py-0.5 rounded-full">
            <Icon icon="simple-icons:tiktok" width={8} />
            TikTok
          </span>
        )}
      </div>

      {/* Avatar + info */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${competitor.gradient} border-2 border-stone-custom/30 flex items-center justify-center text-lg font-bold text-ink`}
        >
          {competitor.initial}
        </div>
        <div>
          <p className="text-[14px] font-bold text-ink">{competitor.handle}</p>
          <p className="text-[11px] text-muted-rb">{competitor.name}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-lg font-extrabold text-ink">
            {competitor.followers}
          </p>
          <p className="text-[9px] text-muted-rb">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-extrabold text-ink">{competitor.reels}</p>
          <p className="text-[9px] text-muted-rb">
            {isIG ? "Reels" : "Videos"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-extrabold text-ink">
            {competitor.topViews}
          </p>
          <p className="text-[9px] text-muted-rb">Top vues</p>
        </div>
      </div>

      {/* Growth badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            competitor.growthPositive
              ? "text-green-600 bg-green-50"
              : "text-red-500 bg-red-50"
          }`}
        >
          {competitor.growthPositive ? "\u2191" : "\u2193"} {competitor.growth}{" "}
          ce mois
        </span>
        <span className="text-[9px] text-muted-rb">
          &middot; Dernier scrape : il y a 2j
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Link
          href="/outliers"
          className="btn-outline flex-1 border border-stone-custom rounded-lg py-2 text-[10px] font-bold text-muted-rb text-center"
        >
          Outliers &rarr;
        </Link>
        <button
          onClick={() => onDelete(competitor.id)}
          className="btn-danger border border-stone-custom rounded-lg px-3 py-2 text-[10px] text-muted-rb"
        >
          <Icon icon="solar:trash-bin-minimalistic-linear" width={13} />
        </button>
      </div>
    </motion.div>
  );
}
