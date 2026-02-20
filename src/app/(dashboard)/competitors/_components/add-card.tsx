"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { cardPop } from "@/lib/motion";

type AddCardProps = {
  onOpen: () => void;
};

export function AddCard({ onOpen }: AddCardProps) {
  return (
    <motion.button
      variants={cardPop}
      onClick={onOpen}
      className="comp-card border-2 border-dashed border-stone-custom/40 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[220px] hover:border-gold/50 hover:bg-gold/5 transition-all cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-beige flex items-center justify-center">
        <Icon icon="solar:add-circle-linear" width={24} className="text-gold" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-ink">Ajouter un concurrent</p>
        <p className="text-[11px] text-muted-rb">
          Instagram ou TikTok &middot; 5 restants
        </p>
      </div>
    </motion.button>
  );
}
