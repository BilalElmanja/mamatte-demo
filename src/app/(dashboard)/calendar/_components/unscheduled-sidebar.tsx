"use client";

import { motion } from "framer-motion";
import { slideUpBlur, staggerContainer, cardPop } from "@/lib/motion";
import { UnscheduledItemCard } from "./unscheduled-item";
import type { UnscheduledItem } from "../_data/calendar-data";

type UnscheduledSidebarProps = {
  items: UnscheduledItem[];
  onSchedule: (item: UnscheduledItem) => void;
};

export function UnscheduledSidebar({ items, onSchedule }: UnscheduledSidebarProps) {
  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.12 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-bold text-ink">Non planifi&eacute;s</h3>
        <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {/* Items list */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {items.map((item) => (
          <motion.div key={item.id} variants={cardPop}>
            <UnscheduledItemCard item={item} onSchedule={onSchedule} />
          </motion.div>
        ))}

        {items.length === 0 && (
          <p className="text-[12px] text-faded text-center py-6">
            Tous les contenus sont planifi&eacute;s !
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
