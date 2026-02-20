"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur, staggerContainer } from "@/lib/motion";
import { ScriptCard, type Script } from "./_components/script-card";
import { VariantModal } from "./_components/variant-modal";

/* ═══ MOCK DATA ═══ */

const SCRIPTS: Script[] = [
  { id: 1, hook: "\u00ab Tu as 3 secondes avant que ce latte art disparaisse \u00bb", cat: "\ud83d\udd0a ASMR", catLabel: "Food ASMR", diff: "easy", words: 147, duration: "~60s", date: "17 F\u00e9v. 2026", status: "edited" },
  { id: 2, hook: "\u00ab Le secret de notre cold brew infus\u00e9 24h \u00bb", cat: "\ud83e\uddd1\u200d\ud83c\udf73 Recette", catLabel: "Recette", diff: "medium", words: 143, duration: "~55s", date: "14 F\u00e9v. 2026", status: "original" },
  { id: 3, hook: "\u00ab Comment on pr\u00e9pare nos brunchs \u00e0 5h du mat\u2019 \u00bb", cat: "\ud83c\udf73 BTS", catLabel: "BTS", diff: "easy", words: 132, duration: "~50s", date: "12 F\u00e9v. 2026", status: "edited" },
  { id: 4, hook: "\u00ab On a test\u00e9 la recette TikTok de l\u2019avocado toast \u00bb", cat: "\ud83d\udd25 Tendance", catLabel: "Tendance", diff: "medium", words: 158, duration: "~65s", date: "10 F\u00e9v. 2026", status: "original" },
  { id: 5, hook: "\u00ab Ce que commande un barista quand il ne travaille PAS \u00bb", cat: "\ud83d\udcd6 Story", catLabel: "Story", diff: "easy", words: 121, duration: "~45s", date: "8 F\u00e9v. 2026", status: "original" },
];

const SORT_OPTIONS = ["R\u00e9cent", "Modifi\u00e9", "Mots"];

export default function ScriptsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("R\u00e9cent");

  // Modal
  const [varOpen, setVarOpen] = useState(false);
  const [varScript, setVarScript] = useState<Script | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  }, []);

  const handleVariant = useCallback((id: number) => {
    const script = SCRIPTS.find((s) => s.id === id) || null;
    setVarScript(script);
    setVarOpen(true);
  }, []);

  // Client-side search filter
  const filteredScripts = useMemo(() => {
    if (!search.trim()) return SCRIPTS;
    const q = search.toLowerCase();
    return SCRIPTS.filter(
      (s) =>
        s.hook.toLowerCase().includes(q) ||
        s.catLabel.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Header */}
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
            Biblioth\u00e8que de{" "}
            <span className="font-serif italic text-gold">Scripts</span>
          </h1>
          <p className="text-sm text-muted-rb mt-1">
            Cliquez{" "}
            <span className="font-semibold text-gold">Variante</span> pour
            cr\u00e9er une version alternative
          </p>
        </div>
        <span className="text-xs font-bold text-muted-rb bg-beige px-3 py-1.5 rounded-lg self-start">
          5 scripts
        </span>
      </motion.div>

      {/* Search + Sort */}
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.06 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Icon
            icon="solar:magnifer-linear"
            width={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faded"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un script..."
            className="search-input w-full bg-white border border-stone-custom/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-faded outline-none"
          />
        </div>
        <div className="flex bg-white border border-stone-custom/40 rounded-lg p-0.5 gap-0.5 shrink-0 self-start">
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
      </motion.div>

      {/* Script Cards */}
      <motion.div
        variants={slideUpBlur}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.12 }}
      >
        {filteredScripts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {filteredScripts.map((script, i) => (
              <ScriptCard
                key={script.id}
                script={script}
                index={i}
                onVariant={handleVariant}
                onToast={showToast}
              />
            ))}
          </motion.div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-beige rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="solar:magnifer-linear"
                width={28}
                className="text-muted-rb"
              />
            </div>
            <p className="text-sm font-semibold text-ink mb-1">
              Aucun script trouv\u00e9
            </p>
            <p className="text-xs text-muted-rb">Essayez un autre terme</p>
          </div>
        )}
      </motion.div>

      {/* Variant Modal */}
      <VariantModal
        open={varOpen}
        onClose={() => setVarOpen(false)}
        script={varScript}
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
    </div>
  );
}
