"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface CompetitorRowProps {
  name: string;
  followers: string;
  onRemove: () => void;
}

export function CompetitorRow({ name, followers, onRemove }: CompetitorRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-xl p-3 flex items-center gap-3 border border-stone-custom/50 shadow-sm"
    >
      <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
        {name[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-ink">@{name}</span>
        <span className="text-xs text-muted-rb ml-2">{followers}</span>
      </div>
      <button
        onClick={onRemove}
        className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-all flex-shrink-0 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 duration-250"
      >
        <Icon icon="solar:close-circle-linear" width={13} />
      </button>
    </motion.div>
  );
}
