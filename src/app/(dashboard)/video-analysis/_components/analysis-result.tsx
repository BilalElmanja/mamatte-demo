"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { resultIn } from "@/lib/motion";
import type { VideoAnalysis } from "@/app/(dashboard)/_data/mock-data";

type AnalysisResultProps = {
  analysis: VideoAnalysis;
  onToast: (msg: string) => void;
  onRegenerate: () => void;
};

const KEY_ELEMENTS_META = [
  { key: "colorPalette" as const, emoji: "\ud83c\udfa8", label: "Palette de couleurs" },
  { key: "lighting" as const, emoji: "\ud83d\udca1", label: "\u00c9clairage" },
  { key: "composition" as const, emoji: "\ud83d\udcd0", label: "Composition" },
  { key: "rhythm" as const, emoji: "\ud83c\udfb5", label: "Rythme" },
];

export function AnalysisResult({ analysis, onToast, onRegenerate }: AnalysisResultProps) {
  return (
    <motion.div
      variants={resultIn}
      initial="hidden"
      animate="visible"
    >
      <div className="border-2 border-gold/30 rounded-2xl p-5 bg-gradient-to-br from-gold/5 to-transparent">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="solar:stars-minimalistic-bold" width={14} className="text-gold" />
          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
            R&eacute;sultat de l&apos;analyse
          </span>
        </div>

        {/* 1. Description de la scene */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1.5">
            Description de la sc&egrave;ne
          </p>
          <p className="text-[13px] text-inksoft leading-relaxed">
            {analysis.sceneDescription}
          </p>
        </div>

        {/* 2. Techniques visuelles */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
            Techniques visuelles
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.visualTechniques.map((tech) => (
              <div
                key={tech.name}
                className="confidence-badge bg-beige px-3 py-1.5 rounded-lg text-[11px] font-semibold text-ink flex items-center gap-2"
              >
                {tech.name}
                <span className="bg-gold/20 text-golddark text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                  {tech.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Pourquoi c'est viral */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1.5">
            Pourquoi c&apos;est viral
          </p>
          <p className="text-[13px] text-inksoft leading-relaxed">
            {analysis.whyViral}
          </p>
        </div>

        {/* 4. Elements cles */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
            &Eacute;l&eacute;ments cl&eacute;s
          </p>
          <div>
            {KEY_ELEMENTS_META.map((elem) => (
              <div
                key={elem.key}
                className="flex gap-3 py-2.5 border-b border-stone-custom/20 last:border-0"
              >
                <span className="text-base shrink-0">{elem.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-ink mb-0.5">{elem.label}</p>
                  <p className="text-[12px] text-muted-rb leading-relaxed">
                    {analysis.keyElements[elem.key]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Suggestion de recreation */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
            Suggestion de recr&eacute;ation
          </p>
          <div>
            {analysis.recreationSteps.map((step, i) => (
              <div key={i} className="flex gap-3 py-2">
                <div className="w-6 h-6 rounded-full bg-gold/15 text-golddark text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-[12px] text-inksoft leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gold/20">
          <button
            onClick={() => onToast("Script cr\u00e9\u00e9 \ud83d\udcdd")}
            className="btn-primary bg-ink text-white px-4 py-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
          >
            <Icon icon="solar:document-add-linear" width={13} />
            Cr&eacute;er un script
          </button>
          <button
            onClick={() => onToast("Analyse sauvegard\u00e9e \u2b50")}
            className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
          >
            <Icon icon="solar:bookmark-linear" width={13} />
            Sauvegarder
          </button>
          <button
            onClick={onRegenerate}
            className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
          >
            <Icon icon="solar:refresh-linear" width={13} />
            R&eacute;g&eacute;n&eacute;rer
          </button>
          <button
            onClick={() => onToast("Copi\u00e9 \ud83d\udccb")}
            className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5 ml-auto"
          >
            <Icon icon="solar:copy-linear" width={13} />
            Copier
          </button>
        </div>
      </div>
    </motion.div>
  );
}
