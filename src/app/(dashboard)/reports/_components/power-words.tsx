"use client";

import { motion } from "framer-motion";
import { slideUpBlur } from "@/lib/motion";

const POWER_WORDS = [
  { word: "secret", count: 12 },
  { word: "avant", count: 8 },
  { word: "personne", count: 7 },
  { word: "seulement", count: 6 },
  { word: "v\u00e9rit\u00e9", count: 5 },
  { word: "enfin", count: 4 },
  { word: "bizarre", count: 4 },
  { word: "croire", count: 3 },
  { word: "jamais", count: 3 },
  { word: "gratuit", count: 2 },
];

export function PowerWords() {
  return (
    <motion.div
      variants={slideUpBlur}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6"
    >
      <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
        <span className="text-base">&#128292;</span>
        Top Power Words
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {POWER_WORDS.map((pw) => (
          <div
            key={pw.word}
            className="word-pill bg-beige/60 rounded-xl px-3 py-2 flex items-center justify-between"
          >
            <span className="text-xs font-bold text-ink">{pw.word}</span>
            <span className="text-[10px] font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded">
              {pw.count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
