"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur, staggerContainer } from "@/lib/motion";
import { ViewsAreaChart } from "./_components/views-area-chart";
import { CategoryDonut } from "./_components/category-donut";
import { GrowthIndicator } from "./_components/growth-indicator";
import { ReelRow, type Reel } from "./_components/reel-row";

/* ═══ MOCK DATA ═══ */

const REELS: Reel[] = [
  { hook: "\u00ab Tu ne vas pas croire ce qu\u2019on pr\u00e9pare \u00e0 5h du matin \u00bb", cat: "\ud83c\udf73 BTS", power: ["croire", "pr\u00e9pare"], views: "3 241", likes: "142", comments: "18", date: "12 F\u00e9v. 2026", emoji: "\u2615" },
  { hook: "\u00ab Le secret de notre cold brew infus\u00e9 24h \u00bb", cat: "\ud83e\uddd1\u200d\ud83c\udf73 Recette", power: ["secret"], views: "2 890", likes: "98", comments: "12", date: "8 F\u00e9v. 2026", emoji: "\ud83e\udeb6" },
  { hook: "\u00ab ASMR : le son du latte art vers\u00e9 dans la tasse \u00bb", cat: "\ud83d\udd0a ASMR", power: [], views: "2 456", likes: "203", comments: "31", date: "10 F\u00e9v. 2026", emoji: "\ud83c\udfa7" },
  { hook: "\u00ab On a test\u00e9 la recette TikTok de l\u2019avocado toast \u00bb", cat: "\ud83d\udd25 Tendance", power: ["test\u00e9"], views: "2 102", likes: "89", comments: "45", date: "5 F\u00e9v. 2026", emoji: "\ud83e\udd51" },
  { hook: "\u00ab Pourquoi votre caf\u00e9 maison n\u2019a pas le m\u00eame go\u00fbt \u00bb", cat: "\ud83d\udcd6 Story", power: ["pourquoi"], views: "1 876", likes: "67", comments: "23", date: "3 F\u00e9v. 2026", emoji: "\u2615" },
  { hook: "\u00ab Notre babka est le produit de la semaine \ud83e\udd47 \u00bb", cat: "\ud83c\udf73 BTS", power: [], views: "1 654", likes: "78", comments: "8", date: "1 F\u00e9v. 2026", emoji: "\ud83c\udf70" },
  { hook: "\u00ab Le cocktail offert de la Saint-Valentin \ud83d\udc8c \u00bb", cat: "\ud83d\udd25 Tendance", power: ["offert"], views: "1 432", likes: "112", comments: "67", date: "14 F\u00e9v. 2026", emoji: "\ud83c\udf78" },
  { hook: "\u00ab Ce que commande un barista quand il ne travaille PAS \u00bb", cat: "\ud83d\udcd6 Story", power: ["secret"], views: "1 298", likes: "55", comments: "14", date: "28 Jan. 2026", emoji: "\u2615" },
  { hook: "\u00ab 1000 grains de caf\u00e9 vers\u00e9s dans le moulin ASMR \u00bb", cat: "\ud83d\udd0a ASMR", power: [], views: "1 189", likes: "92", comments: "5", date: "25 Jan. 2026", emoji: "\ud83e\udeb6" },
  { hook: "\u00ab Le brunch parfait en 60 secondes chrono \u23f1\ufe0f \u00bb", cat: "\ud83e\uddd1\u200d\ud83c\udf73 Recette", power: ["parfait"], views: "987", likes: "43", comments: "9", date: "22 Jan. 2026", emoji: "\ud83c\udf73" },
];

const SORT_OPTIONS = ["Vues", "Likes", "Comm.", "Date"];
const PERIOD_OPTIONS = ["7j", "30j", "90j", "Tout"];

export default function MyReelsPage() {
  const [sort, setSort] = useState("Vues");
  const [period, setPeriod] = useState("30j");
  const [showAll, setShowAll] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  }, []);

  const displayedReels = showAll ? REELS : REELS;

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
            Mes{" "}
            <span className="font-serif italic text-gold">Reels</span>
          </h1>
          <p className="text-sm text-muted-rb mt-1">
            Dernier scraping :{" "}
            <span className="font-medium text-inksoft">il y a 2 jours</span>{" "}
            &middot; Prochain : dimanche 5h
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-rb bg-beige px-2.5 py-1 rounded-lg">
            18 Reels
          </span>
        </div>
      </motion.div>

      {/* Sort & Filter */}
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.06 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-faded uppercase tracking-wider mr-1">
            Trier
          </span>
          <div className="flex bg-white border border-stone-custom/40 rounded-lg p-0.5 gap-0.5">
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
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-faded uppercase tracking-wider mr-1">
            P\u00e9riode
          </span>
          <div className="flex bg-white border border-stone-custom/40 rounded-lg p-0.5 gap-0.5">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`sort-pill px-3 py-1.5 rounded-md text-[11px] font-bold ${
                  period === p ? "active" : "text-muted-rb"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance overview */}
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.09 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="md:col-span-2">
          <ViewsAreaChart />
        </div>
        <GrowthIndicator />
      </motion.div>
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <CategoryDonut />
      </motion.div>

      {/* Reels List */}
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.12 }}
        className="bg-white rounded-2xl border border-stone-custom/40 overflow-hidden"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {displayedReels.map((reel, i) => (
            <ReelRow key={reel.hook} reel={reel} index={i} />
          ))}
        </motion.div>
      </motion.div>

      {/* Show more */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <span className="text-xs text-muted-rb">
          {showAll ? "18 sur 18 Reels affich\u00e9s" : "10 sur 18 Reels affich\u00e9s"}
        </span>
        {!showAll ? (
          <button
            onClick={() => {
              setShowAll(true);
              showToast("18 Reels charg\u00e9s");
            }}
            className="btn-ghost text-xs font-bold text-gold flex items-center gap-1 hover:text-golddark"
          >
            Tout afficher{" "}
            <Icon icon="solar:arrow-down-linear" width={12} />
          </button>
        ) : (
          <span className="text-xs font-bold text-faded">
            Tous les Reels affich\u00e9s
          </span>
        )}
      </div>

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
