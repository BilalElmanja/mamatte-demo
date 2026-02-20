"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  selected: boolean;
  onSelect: () => void;
  emoji: string;
  label: string;
}

export function SelectionCard({ selected, onSelect, emoji, label }: SelectionCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "glass rounded-2xl p-6 flex flex-col items-center gap-3 border-2 transition-all duration-400 cursor-pointer",
        selected
          ? "border-ink bg-white/80 shadow-[0_0_0_3px_rgba(26,26,26,.06),0_12px_40px_rgba(0,0,0,.06)] translate-y-[-3px]"
          : "border-transparent hover:translate-y-[-3px] hover:shadow-[0_12px_40px_rgba(0,0,0,.06)]"
      )}
    >
      <span className="text-4xl">{emoji}</span>
      <span className="font-semibold text-sm text-ink">{label}</span>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="w-5 h-5 bg-ink rounded-full flex items-center justify-center"
          >
            <Icon icon="solar:check-read-linear" width={11} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
