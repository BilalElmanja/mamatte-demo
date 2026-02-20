"use client";

import { motion } from "framer-motion";
import { slideUpBlur } from "@/lib/motion";

const EMOTIONAL_TRIGGERS = [
  "\ud83d\ude32 Curiosit\u00e9",
  "\u23f0 Urgence",
  "\ud83d\ude30 FOMO",
  "\ud83e\udd2b Exclusivit\u00e9",
  "\ud83d\ude0d Admiration",
  "\ud83d\ude4c Appartenance",
];

export function EmotionalTriggers() {
  return (
    <motion.div
      variants={slideUpBlur}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6"
    >
      <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
        <span className="text-base">&#128161;</span>
        D\u00e9clencheurs \u00e9motionnels
      </h3>
      <div className="flex flex-wrap gap-2">
        {EMOTIONAL_TRIGGERS.map((trigger) => (
          <span
            key={trigger}
            className="bg-beige rounded-xl px-4 py-2 text-xs font-bold text-ink"
          >
            {trigger}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
