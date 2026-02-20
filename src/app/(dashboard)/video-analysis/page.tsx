"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur, staggerContainer, cardPop } from "@/lib/motion";
import { PlatformTabs } from "@/app/(dashboard)/outliers/_components/platform-tabs";
import { SCRAPED_VIDEOS } from "@/app/(dashboard)/_data/mock-data";
import type { ScrapedVideo } from "@/app/(dashboard)/_data/mock-data";
import { VideoCard } from "./_components/video-card";
import { AnalysisModal } from "./_components/analysis-modal";

const FILTERS = ["Tous", "Sans script \ud83c\udfac", "Visuel pur \u2728", "Analys\u00e9es", "Nouvelles"] as const;
type Filter = (typeof FILTERS)[number];

const SORT_OPTIONS = ["Vues", "Likes", "Date"] as const;
type Sort = (typeof SORT_OPTIONS)[number];

function parseViewCount(views: string): number {
  const str = views.replace(/\s/g, "");
  if (str.endsWith("M")) return parseFloat(str) * 1_000_000;
  if (str.endsWith("K")) return parseFloat(str) * 1_000;
  return parseFloat(str) || 0;
}

function parseDateSort(date: string): number {
  // Simple ordering: newer dates get higher values
  // The dates are in format like "8 Fev.", "6 Fev.", "30 Jan."
  const monthOrder: Record<string, number> = {
    "Jan.": 1,
    "F\u00e9v.": 2,
    "Fev.": 2,
    "F\u00e9v": 2,
    "Mars": 3,
  };
  const parts = date.trim().split(" ");
  const day = parseInt(parts[0], 10) || 0;
  const monthStr = parts[1] || "";
  const month = monthOrder[monthStr] || 0;
  return month * 100 + day;
}

export default function VideoAnalysisPage() {
  const [platform, setPlatform] = useState<"ig" | "tk">("ig");
  const [filter, setFilter] = useState<Filter>("Tous");
  const [sort, setSort] = useState<Sort>("Vues");
  const [selectedVideo, setSelectedVideo] = useState<ScrapedVideo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  }, []);

  const handleAnalyze = useCallback((video: ScrapedVideo) => {
    setSelectedVideo(video);
    setModalOpen(true);
  }, []);

  // Filter + sort logic
  const filteredVideos = useMemo(() => {
    let videos = SCRAPED_VIDEOS.filter((v) => v.platform === platform);

    // Badge filter
    switch (filter) {
      case "Sans script \ud83c\udfac":
        videos = videos.filter((v) => v.badge.includes("Sans script"));
        break;
      case "Visuel pur \u2728":
        videos = videos.filter((v) => v.badge.includes("Visuel"));
        break;
      case "Analys\u00e9es":
        videos = videos.filter((v) => v.analyzed === true);
        break;
      case "Nouvelles":
        videos = videos.filter((v) => v.analyzed === false);
        break;
      default:
        break;
    }

    // Sort
    const sorted = [...videos];
    switch (sort) {
      case "Vues":
        sorted.sort((a, b) => parseViewCount(b.views) - parseViewCount(a.views));
        break;
      case "Likes":
        sorted.sort((a, b) => parseViewCount(b.likes) - parseViewCount(a.likes));
        break;
      case "Date":
        sorted.sort((a, b) => parseDateSort(b.date) - parseDateSort(a.date));
        break;
    }

    return sorted;
  }, [platform, filter, sort]);

  return (
    <>
      {/* Header */}
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
            Analyse{" "}
            <span className="font-serif italic text-gold">Vid&eacute;o</span>{" "}
            {"\ud83c\udfac"}
          </h1>
          <p className="text-sm text-muted-rb mt-1">
            Vid&eacute;os sans script scrap&eacute;es chez vos concurrents &mdash; analyse par IA
          </p>
        </div>
      </motion.div>

      {/* Platform Switcher */}
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.06 }}
        className="mb-6"
      >
        <PlatformTabs active={platform} onSwitch={setPlatform} />
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={platform}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Filter chips + Sort pills */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`filter-chip border border-stone-custom rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap ${
                    filter === f ? "active" : "text-muted-rb"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex bg-white border border-stone-custom/40 rounded-lg p-0.5 gap-0.5 ml-auto self-start shrink-0">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`sort-pill px-3 py-1.5 rounded-md text-[11px] font-bold ${
                    sort === s ? "active" : "text-muted-rb"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Video card grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onAnalyze={handleAnalyze}
              />
            ))}
          </motion.div>

          {/* Empty state */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-faded text-sm">
                Aucune vid&eacute;o trouv&eacute;e pour ce filtre.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Analysis Modal */}
      <AnalysisModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        video={selectedVideo}
        onToast={showToast}
      />

      {/* Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8, x: "-50%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 md:bottom-6 left-1/2 z-50 pointer-events-none"
          >
            <div className="bg-ink text-white px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 shadow-2xl shadow-ink/20">
              <Icon icon="solar:check-circle-bold" width={17} />
              <span>{toastMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
