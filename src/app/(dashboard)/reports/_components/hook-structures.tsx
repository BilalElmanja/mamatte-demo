"use client";

import { motion } from "framer-motion";
import { slideUpBlur } from "@/lib/motion";

const HOOK_STRUCTURES = [
  {
    title: "Pression temporelle + r\u00e9v\u00e9lation",
    example: "\u00ab Tu as X secondes avant que\u2026 \u00bb",
    multiplier: "\u00d72,8 vues",
  },
  {
    title: "Question + curiosit\u00e9",
    example:
      "\u00ab Et si je vous disais que\u2026 \u00bb / \u00ab Savez-vous pourquoi\u2026 \u00bb",
    multiplier: "\u00d72,1 vues",
  },
  {
    title: "Listicle insider",
    example:
      "\u00ab 3 choses que\u2026 \u00bb / \u00ab X choses que personne ne\u2026 \u00bb",
    multiplier: "\u00d71,9 vues",
  },
  {
    title: "Pol\u00e9mique douce + transparence",
    example:
      "\u00ab La v\u00e9rit\u00e9 sur\u2026 \u00bb / \u00ab Pourquoi notre X co\u00fbte Y\u20ac \u00bb",
    multiplier: "\u00d71,7 vues",
  },
  {
    title: "Transformation / Avant-Apr\u00e8s",
    example:
      "\u00ab De X \u00e0 Y en Z secondes \u00bb / \u00ab Regardez ce que\u2026 \u00bb",
    multiplier: "\u00d71,5 vues",
  },
];

export function HookStructures() {
  return (
    <motion.div
      variants={slideUpBlur}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
    >
      <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
        <span className="text-base">&#127907;</span>
        Structures de hooks qui convertissent
      </h3>
      <div className="space-y-3">
        {HOOK_STRUCTURES.map((hook) => (
          <div
            key={hook.title}
            className="topic-row rounded-xl px-3 py-3 flex items-start gap-3"
          >
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-ink mb-1">
                {hook.title}
              </p>
              <p className="text-[12px] text-muted-rb italic mb-1.5">
                {hook.example}
              </p>
            </div>
            <span className="text-[11px] font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-lg flex-shrink-0">
              {hook.multiplier}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
