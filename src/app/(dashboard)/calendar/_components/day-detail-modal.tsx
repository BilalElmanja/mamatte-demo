"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { modalIn, overlayVariants } from "@/lib/motion";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  MONTHS_FR,
  type ScheduledItem,
} from "../_data/calendar-data";

type DayDetailModalProps = {
  open: boolean;
  onClose: () => void;
  day: number;
  month: number;
  year: number;
  items: ScheduledItem[];
};

const WEEKDAYS_FULL = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

function formatFullDate(day: number, month: number, year: number): string {
  const d = new Date(year, month, day);
  const weekday = WEEKDAYS_FULL[d.getDay()];
  const monthName = MONTHS_FR[month];
  return `${weekday} ${day} ${monthName} ${year}`;
}

export function DayDetailModal({
  open,
  onClose,
  day,
  month,
  year,
  items,
}: DayDetailModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            variants={overlayVariants}
          />
          <motion.div
            className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl p-6"
            variants={modalIn}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-ink">
                  {formatFullDate(day, month, year)}
                </h2>
                <p className="text-[11px] text-muted-rb mt-0.5">
                  {items.length} contenu{items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-beige transition-colors"
              >
                <Icon
                  icon="solar:close-circle-linear"
                  width={18}
                  className="text-muted-rb"
                />
              </button>
            </div>

            {/* Items list */}
            {items.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto scrollbar-thin">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-cream/50 border border-stone-custom/30 rounded-xl p-3 flex items-start gap-3"
                  >
                    <span className="text-xl flex-shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-ink leading-snug">
                        {item.hook}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${STATUS_COLORS[item.status]}15`,
                            color: STATUS_COLORS[item.status],
                          }}
                        >
                          {STATUS_LABELS[item.status]}
                        </span>
                        <span className="flex items-center gap-1">
                          {(item.platform === "ig" ||
                            item.platform === "both") && (
                            <Icon
                              icon="simple-icons:instagram"
                              width={10}
                              className="text-[#E1306C]"
                            />
                          )}
                          {(item.platform === "tk" ||
                            item.platform === "both") && (
                            <Icon
                              icon="simple-icons:tiktok"
                              width={9}
                              className="text-ink"
                            />
                          )}
                        </span>
                        {item.time && (
                          <span className="text-[10px] text-faded flex items-center gap-1">
                            <Icon
                              icon="solar:clock-circle-linear"
                              width={10}
                            />
                            {item.time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-faded text-center py-8">
                Aucun contenu pour cette journ&eacute;e
              </p>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="btn-outline w-full border border-stone-custom rounded-xl py-3 text-sm font-bold text-muted-rb mt-4"
            >
              Fermer
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
