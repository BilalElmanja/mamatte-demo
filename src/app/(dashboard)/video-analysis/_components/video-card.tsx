"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { cardPop } from "@/lib/motion";
import type { ScrapedVideo } from "@/app/(dashboard)/_data/mock-data";

type VideoCardProps = {
  video: ScrapedVideo;
  onAnalyze: (video: ScrapedVideo) => void;
};

export function VideoCard({ video, onAnalyze }: VideoCardProps) {
  const isTK = video.platform === "tk";
  const isScriptless = video.badge.includes("Sans script");

  return (
    <motion.div variants={cardPop} className="video-card bg-white rounded-2xl border border-stone-custom/40 overflow-hidden">
      {/* Thumbnail area */}
      <div className={`aspect-video bg-gradient-to-br ${video.thumbnailGradient} relative overflow-hidden`}>
        {/* Large centered emoji as background decoration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl opacity-30">{video.emoji}</span>
        </div>

        {/* Play button overlay */}
        <div className="play-overlay absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path d="M2 1.5L16 10L2 18.5V1.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          {video.duration}
        </div>

        {/* Platform icon */}
        <div className="absolute bottom-2 left-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isTK ? "bg-tiktok-bg" : "bg-pink-50"
            }`}
          >
            <Icon
              icon={isTK ? "simple-icons:tiktok" : "simple-icons:instagram"}
              width={12}
              className={isTK ? "text-tiktok" : "text-[#E1306C]"}
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4">
        {/* Badge row */}
        <div className="flex gap-2 mb-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isScriptless
                ? "bg-gold/15 text-golddark"
                : "bg-violet-50 text-violet-700"
            }`}
          >
            {video.badge}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              video.analyzed
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {video.analyzed ? "Analysee \u2705" : "Nouvelle \ud83c\udd95"}
          </span>
        </div>

        {/* Hook text */}
        <p className="text-[14px] font-semibold text-ink leading-snug line-clamp-2 mb-2">
          {video.hook}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-[11px] text-muted-rb">
          <Icon
            icon={isTK ? "simple-icons:tiktok" : "simple-icons:instagram"}
            width={10}
            className={isTK ? "text-tiktok" : "text-[#E1306C]"}
          />
          <span>@{video.account}</span>
          <span>&middot;</span>
          <span>{video.views} vues</span>
          <span>&middot;</span>
          <span>{video.likes} likes</span>
        </div>
      </div>

      {/* Action area */}
      <div className="border-t border-stone-custom/30 px-4 py-3">
        {video.analyzed ? (
          <button
            onClick={() => onAnalyze(video)}
            className="btn-outline border border-stone-custom rounded-lg px-4 py-2 text-[11px] font-bold text-muted-rb flex items-center gap-1.5 w-full justify-center"
          >
            <Icon icon="solar:eye-linear" width={14} />
            Voir l&apos;analyse
          </button>
        ) : (
          <button
            onClick={() => onAnalyze(video)}
            className="inspire-btn border border-gold/60 rounded-lg px-4 py-2 text-[11px] font-bold text-gold flex items-center gap-1.5 w-full justify-center"
          >
            <Icon icon="solar:cpu-bolt-linear" width={14} />
            Analyser la vid&eacute;o
          </button>
        )}
      </div>
    </motion.div>
  );
}
