"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur, staggerContainer } from "@/lib/motion";
import { IdeaCard, type Idea } from "./_components/idea-card";
import { ThemeModal } from "./_components/theme-modal";
import { RemixModal } from "./_components/remix-modal";

const IDEAS_DATA: Idea[] = [
  {
    id: 1,
    hook: "\u00AB Tu as 3 secondes avant que ce latte art disparaisse \u00BB",
    concept:
      "Filmez le barista versant le latte art en plong\u00e9e. Gros plan. Laissez le dessin se former en temps r\u00e9el.",
    why: "L\u2019ASMR + vue a\u00e9rienne sont en tendance. 2,8x plus de vues.",
    cats: ["\uD83D\uDD0A ASMR", "\uD83C\uDFA8 Plating"],
    diff: "easy",
    saved: false,
    emoji: "\u2615",
    platforms: ["ig", "tk"],
  },
  {
    id: 2,
    hook: "\u00AB Comment on pr\u00e9pare nos brunchs \u00e0 5h du mat\u2019 \u00BB",
    concept:
      "Montrez les coulisses : p\u00e2te \u00e0 croissant, mise en place, premi\u00e8re machine caf\u00e9 dans le noir.",
    why: "Le BTS cuisine explose. Les spectateurs adorent le processus.",
    cats: ["\uD83C\uDF73 BTS"],
    diff: "easy",
    saved: true,
    emoji: "\uD83E\uDDD1\u200D\uD83C\uDF73",
    platforms: ["ig"],
  },
  {
    id: 3,
    hook: "\u00AB On a test\u00e9 la recette TikTok de l\u2019avocado toast \u00BB",
    concept:
      "Recr\u00e9ez une recette virale. Comparez avec votre version maison. R\u00e9action de l\u2019\u00e9quipe.",
    why: "Le format test viral est \u00e9prouv\u00e9. +45% d\u2019engagement.",
    cats: ["\uD83D\uDD25 Tendance", "\uD83E\uDDD1\u200D\uD83C\uDF73 Recette"],
    diff: "medium",
    saved: false,
    emoji: "\uD83E\uDD51",
    platforms: ["ig", "tk"],
  },
  {
    id: 4,
    hook: "\u00AB Ce que commande un barista quand il ne travaille PAS \u00BB",
    concept:
      "Votre barista montre sa commande personnelle, ses personnalisations secr\u00e8tes.",
    why: "Le contenu insider cr\u00e9e un sentiment d\u2019exclusivit\u00e9.",
    cats: ["\uD83D\uDCD6 Story"],
    diff: "easy",
    saved: false,
    emoji: "\u2615",
    platforms: ["ig"],
  },
  {
    id: 5,
    hook: "\u00AB Le son de 1000 grains vers\u00e9s dans le moulin \u00BB",
    concept:
      "S\u00e9quence ASMR pure : grains, moulin, extraction, mousse. Z\u00e9ro parole, son maximal.",
    why: "Reels ASMR caf\u00e9 font 3,1x plus de vues.",
    cats: ["\uD83D\uDD0A ASMR"],
    diff: "easy",
    saved: false,
    emoji: "\uD83C\uDFA7",
    platforms: ["ig", "tk"],
  },
  {
    id: 6,
    hook: "\u00AB Notre babka est le produit de la semaine \uD83E\uDD47 \u00BB",
    concept:
      "D\u00e9voilez un produit star. Montrez texture, cuisson, premier croc. Invitez \u00e0 voter.",
    why: "Format \u2018produit de la semaine\u2019 cr\u00e9e un rendez-vous r\u00e9current.",
    cats: ["\uD83C\uDF73 BTS", "\uD83E\uDDD1\u200D\uD83C\uDF73 Recette"],
    diff: "medium",
    saved: false,
    emoji: "\uD83C\uDF70",
    platforms: ["ig"],
  },
  {
    id: 7,
    hook: "\u00AB Pourquoi votre caf\u00e9 maison n\u2019a pas le m\u00eame go\u00fbt \u00BB",
    concept:
      "\u00c9ducatif : mouture, temp\u00e9rature eau, fra\u00eecheur grains. Mini-masterclass en 30 sec.",
    why: "Contenu \u00e9ducatif \u2192 expert. Bon taux de sauvegarde (+120%).",
    cats: ["\uD83D\uDCD6 Story"],
    diff: "medium",
    saved: false,
    emoji: "\u2615",
    platforms: ["ig"],
  },
  {
    id: 8,
    hook: "\u00AB Le cocktail offert de la Saint-Valentin \uD83D\uDC8C \u00BB",
    concept:
      "Pr\u00e9paration cocktail en slow-motion. Ambiance romantique. Annoncez l\u2019offre.",
    why: "Contenu saisonnier viral 3-5 jours avant l\u2019\u00e9v\u00e9nement.",
    cats: ["\uD83D\uDD25 Tendance"],
    diff: "easy",
    saved: false,
    emoji: "\uD83C\uDF78",
    platforms: ["ig", "tk"],
  },
  {
    id: 9,
    hook: "\u00AB 1 journ\u00e9e dans la vie d\u2019un franchis\u00e9 Mamatte \u00BB",
    concept:
      "Suivez le patron de 5h \u00e0 la fermeture. Hauts, bas, moments humains. Vlog court.",
    why: "Format \u2018day in the life\u2019 parmi les plus performants.",
    cats: ["\uD83D\uDCD6 Story", "\uD83C\uDF73 BTS"],
    diff: "hard",
    saved: false,
    emoji: "\uD83D\uDCF9",
    platforms: ["ig"],
  },
];

const FILTERS = [
  "Toutes",
  "\uD83C\uDF73 BTS",
  "\uD83D\uDD0A ASMR",
  "\uD83D\uDD25 Tendance",
  "\uD83D\uDCD6 Story",
  "\u2B50 Sauvegard\u00e9es",
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState(IDEAS_DATA);
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [themeOpen, setThemeOpen] = useState(false);
  const [remixOpen, setRemixOpen] = useState(false);
  const [remixHook, setRemixHook] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 2800);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const toggleSave = (id: number) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, saved: !idea.saved } : idea
      )
    );
    const idea = ideas.find((i) => i.id === id);
    showToast(idea?.saved ? "Retiree" : "Sauvegardee");
  };

  const openRemix = (id: number) => {
    const idea = ideas.find((i) => i.id === id);
    if (idea) {
      setRemixHook(idea.hook);
      setRemixOpen(true);
    }
  };

  const filtered = (() => {
    if (activeFilter === "Toutes") return ideas;
    if (activeFilter === "\u2B50 Sauvegard\u00e9es")
      return ideas.filter((i) => i.saved);
    return ideas.filter((i) => i.cats.some((c) => c.includes(activeFilter.slice(2))));
  })();

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
              Vos <span className="font-serif italic text-gold">Id&eacute;es</span>
            </h1>
          </div>
          <button
            onClick={() => setThemeOpen(true)}
            className="btn-primary bg-ink text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start shadow-md shadow-ink/8"
          >
            <Icon icon="solar:magic-stick-3-linear" width={16} />
            Id&eacute;es sur un th&egrave;me
          </button>
        </motion.div>

        {/* Filter chips */}
        <motion.div
          variants={slideUpBlur}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.06 }}
          className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`filter-chip border border-stone-custom rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap ${
                activeFilter === f
                  ? "active bg-ink text-white border-ink"
                  : "text-muted-rb"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Week section */}
        <motion.div
          variants={slideUpBlur}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.12 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-ink">
              Semaine du 17 F&eacute;v. 2026
            </h2>
            <span className="text-xs font-medium text-muted-rb bg-beige px-2 py-1 rounded-md">
              {filtered.length} id&eacute;es
            </span>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onToggleSave={toggleSave}
                onRemix={openRemix}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Load more */}
        <div className="text-center py-6">
          <button className="btn-ghost text-sm font-semibold text-muted-rb flex items-center gap-2 mx-auto">
            <Icon icon="solar:arrow-down-linear" width={16} />
            Charger plus de semaines
          </button>
        </div>
      </div>

      {/* Theme modal */}
      <ThemeModal
        open={themeOpen}
        onClose={() => setThemeOpen(false)}
        onGenerate={() => showToast("5 nouvelles idees generees !")}
      />

      {/* Remix modal */}
      <RemixModal
        open={remixOpen}
        sourceHook={remixHook}
        onClose={() => setRemixOpen(false)}
        onSave={(msg) => showToast(msg)}
      />

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
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
