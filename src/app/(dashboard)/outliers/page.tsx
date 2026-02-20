"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  slideUpBlur,
  staggerContainer,
  rowIn,
  overlayVariants,
} from "@/lib/motion";
import { PlatformTabs } from "./_components/platform-tabs";
import { OutlierRow, type Outlier } from "./_components/outlier-row";
import { TikTokTrendBar } from "./_components/tiktok-trend-bar";
import { InspireModal } from "./_components/inspire-modal";

/* ═══ MOCK DATA ═══ */

const IG_OUTLIERS: Outlier[] = [
  { id: 1, hook: "\u00ab Personne ne parle de cette technique de latte art \u00bb", account: "columbus_cafe_fr", views: "245K", likes: "12K", date: "5 F\u00e9v.", viral: true, emoji: "\u2615", platform: "ig" },
  { id: 2, hook: "\u00ab 3 choses que j\u2019aurais voulu savoir avant d\u2019ouvrir mon caf\u00e9 \u00bb", account: "cafe_joyeux", views: "89K", likes: "4.1K", date: "3 F\u00e9v.", viral: true, emoji: "\ud83d\udca1", platform: "ig" },
  { id: 3, hook: "\u00ab Ce client a command\u00e9 LE truc le plus bizarre \u00bb", account: "columbus_cafe_fr", views: "67K", likes: "3.2K", date: "1 F\u00e9v.", viral: false, emoji: "\ud83d\ude33", platform: "ig" },
  { id: 4, hook: "\u00ab Le bruit de notre machine \u00e0 espresso \u00e0 6h du matin \u00bb", account: "coutume_cafe", views: "52K", likes: "2.8K", date: "30 Jan.", viral: false, emoji: "\ud83c\udfa7", platform: "ig" },
  { id: 5, hook: "\u00ab J\u2019ai fait go\u00fbter notre nouveau menu \u00e0 des inconnus \u00bb", account: "cafe_joyeux", views: "41K", likes: "1.9K", date: "28 Jan.", viral: false, emoji: "\ud83c\udf5e", platform: "ig" },
  { id: 6, hook: "\u00ab Comment je transforme 2\u20ac de caf\u00e9 en 45\u20ac de CA \u00bb", account: "columbus_cafe_fr", views: "38K", likes: "2.1K", date: "25 Jan.", viral: false, emoji: "\ud83d\udcb0", platform: "ig" },
  { id: 7, hook: "\u00ab La v\u00e9rit\u00e9 sur notre croissant \u00e0 2,50\u20ac \u00bb", account: "coutume_cafe", views: "34K", likes: "1.6K", date: "22 Jan.", viral: false, emoji: "\ud83e\udd50", platform: "ig" },
];

const TK_OUTLIERS: Outlier[] = [
  { id: 101, hook: "\u00ab POV : tu es barista et un client commande un \u2018caf\u00e9 normal\u2019 \u00bb", account: "colombus.officiel", views: "1.2M", likes: "89K", date: "6 F\u00e9v.", viral: true, emoji: "\ud83d\ude02", platform: "tk" },
  { id: 102, hook: "\u00ab Le son de 50 grains de caf\u00e9 moulus au ralenti #ASMR \u00bb", account: "coutume.paris", views: "890K", likes: "67K", date: "4 F\u00e9v.", viral: true, emoji: "\ud83c\udfa7", platform: "tk" },
  { id: 103, hook: "\u00ab Petit caf\u00e9 ou GRAND caf\u00e9 ? La r\u00e9ponse va vous surprendre \u00bb", account: "colombus.officiel", views: "340K", likes: "24K", date: "2 F\u00e9v.", viral: true, emoji: "\u2615", platform: "tk" },
  { id: 104, hook: "\u00ab Recette secr\u00e8te : notre sauce hollandaise en 30 sec \u00bb", account: "coutume.paris", views: "156K", likes: "11K", date: "30 Jan.", viral: false, emoji: "\ud83c\udf73", platform: "tk" },
  { id: 105, hook: "\u00ab On a laiss\u00e9 un inconnu faire notre menu du jour \u00bb", account: "colombus.officiel", views: "128K", likes: "9.2K", date: "28 Jan.", viral: false, emoji: "\ud83c\udfb2", platform: "tk" },
  { id: 106, hook: "\u00ab Montrez cette vid\u00e9o \u00e0 quelqu\u2019un qui n\u2019aime pas le caf\u00e9 \u00bb", account: "coutume.paris", views: "98K", likes: "7.1K", date: "25 Jan.", viral: false, emoji: "\u2615", platform: "tk" },
];

const IG_FILTERS = ["Tous", "@columbus_cafe_fr", "@cafe_joyeux", "@coutume_cafe"];
const TK_FILTERS = ["Tous", "@colombus.officiel", "@coutume.paris"];
const SORT_OPTIONS = ["Vues", "Likes", "Date"];

export default function OutliersPage() {
  const [platform, setPlatform] = useState<"ig" | "tk">("ig");
  const [igFilter, setIgFilter] = useState("Tous");
  const [tkFilter, setTkFilter] = useState("Tous");
  const [igSort, setIgSort] = useState("Vues");
  const [tkSort, setTkSort] = useState("Vues");

  // Modal
  const [inspireOpen, setInspireOpen] = useState(false);
  const [inspireOutlier, setInspireOutlier] = useState<Outlier | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  }, []);

  const handleInspire = useCallback(
    (id: number, plat: "ig" | "tk") => {
      const all = [...IG_OUTLIERS, ...TK_OUTLIERS];
      const outlier = all.find((o) => o.id === id) || null;
      setInspireOutlier(outlier);
      setInspireOpen(true);
    },
    []
  );

  // Filter logic
  const activeFilter = platform === "ig" ? igFilter : tkFilter;
  const outliers = platform === "ig" ? IG_OUTLIERS : TK_OUTLIERS;
  const filteredOutliers =
    activeFilter === "Tous"
      ? outliers
      : outliers.filter(
          (o) => `@${o.account}` === activeFilter
        );
  const filters = platform === "ig" ? IG_FILTERS : TK_FILTERS;
  const activeSort = platform === "ig" ? igSort : tkSort;

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
            Niche{" "}
            <span className="font-serif italic text-gold">Outliers</span>{" "}
            {"\ud83d\udd25"}
          </h1>
          <p className="text-sm text-muted-rb mt-1">
            Top vid\u00e9os virales de vos concurrents &mdash; Instagram Reels &amp; TikTok
          </p>
        </div>
        <button
          onClick={() => showToast("Export CSV t\u00e9l\u00e9charg\u00e9 \ud83d\udce5")}
          className="btn-outline border border-stone-custom rounded-xl px-5 py-2.5 text-xs font-bold text-muted-rb flex items-center gap-2 self-start"
        >
          <Icon icon="solar:file-download-linear" width={16} />
          Exporter CSV
        </button>
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
          {/* TikTok trend bar */}
          {platform === "tk" && <TikTokTrendBar />}

          {/* Filters + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
            >
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() =>
                    platform === "ig"
                      ? setIgFilter(f)
                      : setTkFilter(f)
                  }
                  className={`filter-chip border border-stone-custom rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap ${
                    activeFilter === f
                      ? "active"
                      : "text-muted-rb"
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
                  onClick={() =>
                    platform === "ig"
                      ? setIgSort(s)
                      : setTkSort(s)
                  }
                  className={`sort-pill px-3 py-1.5 rounded-md text-[11px] font-bold ${
                    activeSort === s ? "active" : "text-muted-rb"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Outlier Table */}
          <div className="bg-white rounded-2xl border border-stone-custom/40 overflow-hidden">
            {/* Column headers - desktop only */}
            <div
              className={`hidden md:grid grid-cols-[56px_1fr_120px_80px_65px_70px_90px] gap-3 px-5 py-3 border-b border-stone-custom/30 ${
                platform === "tk" ? "bg-tiktok-bg/30" : "bg-beige/30"
              }`}
            >
              <span />
              <span className="text-[10px] font-bold text-faded uppercase tracking-wider">
                Hook
              </span>
              <span className="text-[10px] font-bold text-faded uppercase tracking-wider">
                Compte
              </span>
              <span className="text-[10px] font-bold text-faded uppercase tracking-wider">
                Vues
              </span>
              <span className="text-[10px] font-bold text-faded uppercase tracking-wider">
                Likes
              </span>
              <span className="text-[10px] font-bold text-faded uppercase tracking-wider">
                Date
              </span>
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider text-center">
                Action
              </span>
            </div>

            {/* Rows */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredOutliers.map((outlier, i) => (
                <OutlierRow
                  key={outlier.id}
                  outlier={outlier}
                  index={i}
                  onInspire={handleInspire}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Inspire Modal */}
      <InspireModal
        open={inspireOpen}
        onClose={() => setInspireOpen(false)}
        outlier={inspireOutlier}
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
