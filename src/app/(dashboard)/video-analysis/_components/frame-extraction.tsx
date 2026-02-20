"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cardPop } from "@/lib/motion";

type FrameExtractionProps = {
  currentStep: number;
  videoGradient: string;
};

const TIMESTAMPS = ["0:03", "0:11", "0:18", "0:24"];
const EMOJIS = ["\u2615", "\ud83c\udfac", "\ud83c\udfa8", "\u2728"];

// Subtle gradient variations for each frame
const GRADIENT_VARIATIONS = [
  "from-amber-200 via-orange-100 to-stone-200",
  "from-stone-200 via-amber-100 to-beige",
  "from-amber-100 via-yellow-100 to-stone-200",
  "from-stone-300 via-amber-200 to-cream",
];

export function FrameExtraction({ currentStep, videoGradient }: FrameExtractionProps) {
  // Determine which frames are visible based on currentStep
  const getFrameVisible = (frameIndex: number) => {
    if (frameIndex <= 1) return currentStep >= 0;
    if (frameIndex === 2) return currentStep >= 1;
    if (frameIndex === 3) return currentStep >= 2;
    return false;
  };

  return (
    <div>
      <p className="text-[10px] font-bold text-faded uppercase tracking-wider mb-3">
        FRAMES EXTRAITES
      </p>
      <div className="flex gap-3">
        <AnimatePresence>
          {TIMESTAMPS.map((ts, i) =>
            getFrameVisible(i) ? (
              <motion.div
                key={i}
                variants={cardPop}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`w-20 h-14 rounded-lg bg-gradient-to-br ${GRADIENT_VARIATIONS[i]} overflow-hidden relative`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg opacity-30">{EMOJIS[i]}</span>
                  </div>
                </div>
                <p className="text-[9px] text-faded text-center mt-1">{ts}</p>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
