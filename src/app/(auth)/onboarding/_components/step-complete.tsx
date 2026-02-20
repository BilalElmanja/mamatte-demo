"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";

const PIPELINE_STAGES = [
  { width: 30, label: "Étape 1 sur 3 — Scraping de vos Reels" },
  { width: 60, label: "Étape 2 sur 3 — Analyse du contenu concurrent" },
  { width: 88, label: "Étape 3 sur 3 — Génération de vos idées" },
  { width: 100, label: "Terminé ! Vos idées sont prêtes." },
];

export function StepComplete() {
  const [progress, setProgress] = useState(12);
  const [label, setLabel] = useState("Étape 1 sur 3 — Scraping de vos Reels");

  useEffect(() => {
    const timers = PIPELINE_STAGES.map((stage, i) =>
      setTimeout(() => {
        setProgress(stage.width);
        setLabel(stage.label);
      }, 2000 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="text-center py-4 sm:py-8">
      {/* Sonar checkmark */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <div className="absolute w-20 h-20 bg-ink/10 rounded-full sonar" />
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-16 h-16 bg-ink rounded-full flex items-center justify-center shadow-xl shadow-ink/20"
        >
          <Icon icon="solar:check-read-bold" width={28} className="text-white" />
        </motion.div>
      </div>

      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[.95] mb-3">
        Tout est <span className="font-serif italic font-medium text-gold">prêt !</span>
      </h2>
      <p className="text-muted-rb text-[15px] max-w-sm mx-auto mb-10">
        ReelBoost analyse votre contenu et celui de vos concurrents. Vos 10 premières idées virales seront prêtes dans environ 10 minutes.
      </p>

      {/* Pipeline progress */}
      <div className="glass rounded-2xl p-5 max-w-xs mx-auto mb-10 shadow-lg shadow-black/[.03]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-ink text-white rounded-lg flex items-center justify-center">
            <Icon icon="solar:refresh-linear" width={15} className="animate-spin" style={{ animationDuration: "2s" }} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-ink">Analyse en cours...</p>
            <p className="text-[11px] text-muted-rb">{label}</p>
          </div>
        </div>
        <div className="h-1.5 bg-stone-custom rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ink rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps explanation */}
      <div className="flex flex-col gap-3 max-w-xs mx-auto text-left mb-10">
        {[
          "Scraping de vos derniers Reels et ceux de vos concurrents",
          "L'IA transcrit et analyse les hooks & tendances",
          "Génération de vos 10 premières idées virales",
        ].map((text, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-ink/5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-[10px] font-bold text-inksoft">{i + 1}</span>
            </div>
            <p className="text-sm text-muted-rb">{text}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/dashboard"
        className="bg-ink text-white px-10 py-4 rounded-full font-semibold text-sm inline-flex items-center gap-2 group shadow-xl shadow-ink/10 transition-all duration-350 hover:translate-y-[-1px] hover:shadow-[0_12px_40px_rgba(0,0,0,.15)] active:translate-y-0 active:scale-[0.98]"
      >
        Aller au Tableau de bord
        <Icon icon="solar:arrow-right-linear" width={16} className="group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  );
}
