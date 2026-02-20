"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur, staggerContainer } from "@/lib/motion";
import {
  CompetitorCard,
  type Competitor,
} from "./_components/competitor-card";
import { AddCard } from "./_components/add-card";
import { AddModal } from "./_components/add-modal";
import { Toast } from "./_components/toast";

const COMPETITORS: Competitor[] = [
  {
    id: 1,
    handle: "@columbus_cafe_fr",
    name: "Columbus Cafe & Co",
    initial: "C",
    followers: "124K",
    reels: "89",
    topViews: "245K",
    growth: "+12%",
    growthPositive: true,
    platform: "ig",
    gradient: "from-purple-100 to-pink-50",
  },
  {
    id: 2,
    handle: "@cafe_joyeux",
    name: "Cafe Joyeux",
    initial: "J",
    followers: "89K",
    reels: "56",
    topViews: "89K",
    growth: "+8%",
    growthPositive: true,
    platform: "ig",
    gradient: "from-yellow-100 to-amber-50",
  },
  {
    id: 3,
    handle: "@coutume_cafe",
    name: "Coutume Cafe",
    initial: "Co",
    followers: "45K",
    reels: "34",
    topViews: "52K",
    growth: "-3%",
    growthPositive: false,
    platform: "ig",
    gradient: "from-stone-custom to-beige",
  },
  {
    id: 4,
    handle: "@colombus.officiel",
    name: "Columbus Cafe TikTok",
    initial: "C",
    followers: "210K",
    reels: "156",
    topViews: "1.2M",
    growth: "+34%",
    growthPositive: true,
    platform: "tk",
    gradient: "from-pink-50 to-tiktok-bg",
  },
  {
    id: 5,
    handle: "@coutume.paris",
    name: "Coutume Cafe TikTok",
    initial: "Ct",
    followers: "67K",
    reels: "89",
    topViews: "890K",
    growth: "+21%",
    growthPositive: true,
    platform: "tk",
    gradient: "from-pink-50 to-tiktok-bg",
  },
];

type PlatformFilter = "all" | "ig" | "tk";

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState(COMPETITORS);
  const [filter, setFilter] = useState<PlatformFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 2800);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const filtered =
    filter === "all"
      ? competitors
      : competitors.filter((c) => c.platform === filter);

  const igCount = competitors.filter((c) => c.platform === "ig").length;
  const tkCount = competitors.filter((c) => c.platform === "tk").length;

  const handleDelete = (id: number) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    showToast("Concurrent supprime");
  };

  const handleAdd = (platform: "ig" | "tk", handle: string) => {
    const newComp: Competitor = {
      id: Date.now(),
      handle: `@${handle}`,
      name: handle,
      initial: handle.charAt(0).toUpperCase(),
      followers: "0",
      reels: "0",
      topViews: "0",
      growth: "+0%",
      growthPositive: true,
      platform,
      gradient:
        platform === "ig"
          ? "from-purple-100 to-pink-50"
          : "from-pink-50 to-tiktok-bg",
    };
    setCompetitors((prev) => [...prev, newComp]);
    setModalOpen(false);
    showToast("Concurrent ajoute");
  };

  return (
    <>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          variants={slideUpBlur}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
              Vos{" "}
              <span className="font-serif italic text-gold">Concurrents</span>
            </h1>
            <p className="text-sm text-muted-rb mt-1">
              {competitors.length} comptes suivis &middot; Instagram Reels &amp;
              TikTok
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary bg-ink text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start shadow-md shadow-ink/10"
          >
            <Icon icon="solar:add-circle-linear" width={16} />
            Ajouter un concurrent
          </button>
        </motion.div>

        {/* Platform filter */}
        <motion.div
          variants={slideUpBlur}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.06 }}
          className="flex gap-2 mb-6"
        >
          <button
            onClick={() => setFilter("all")}
            className={`platform-chip border border-stone-custom rounded-lg px-4 py-2 text-[11px] font-bold ${
              filter === "all"
                ? "bg-ink text-white border-ink"
                : "text-muted-rb"
            }`}
          >
            Tous ({competitors.length})
          </button>
          <button
            onClick={() => setFilter("ig")}
            className={`platform-chip border border-stone-custom rounded-lg px-4 py-2 text-[11px] font-bold flex items-center gap-1.5 ${
              filter === "ig"
                ? "bg-ink text-white border-ink"
                : "text-muted-rb"
            }`}
          >
            <Icon icon="simple-icons:instagram" width={11} />
            Instagram ({igCount})
          </button>
          <button
            onClick={() => setFilter("tk")}
            className={`platform-chip border border-stone-custom rounded-lg px-4 py-2 text-[11px] font-bold flex items-center gap-1.5 ${
              filter === "tk"
                ? "bg-ink text-white border-ink"
                : "text-muted-rb"
            }`}
          >
            <Icon icon="simple-icons:tiktok" width={10} />
            TikTok ({tkCount})
          </button>
        </motion.div>

        {/* Competitors grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((comp) => (
            <CompetitorCard
              key={comp.id}
              competitor={comp}
              onDelete={handleDelete}
            />
          ))}
          <AddCard onOpen={() => setModalOpen(true)} />
        </motion.div>
      </div>

      {/* Add modal */}
      <AddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />

      {/* Toast */}
      <Toast message={toastMsg} />
    </>
  );
}
