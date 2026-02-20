"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { modalIn, overlayVariants } from "@/lib/motion";
import { MONTHS_FR, DAYS_FR, type UnscheduledItem } from "../_data/calendar-data";

type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  item: UnscheduledItem | null;
  currentMonth: number;
  currentYear: number;
  onSchedule: (data: {
    itemId: number;
    date: string;
    time: string;
    platform: "ig" | "tk" | "both";
  }) => void;
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function ScheduleModal({
  open,
  onClose,
  item,
  currentMonth,
  currentYear,
  onSchedule,
}: ScheduleModalProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [time, setTime] = useState("10:00");
  const [platform, setPlatform] = useState<"ig" | "tk" | "both">("ig");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedDay(null);
      setTime("10:00");
      setPlatform("ig");
    }
  }, [open]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const todayStr = "2026-02-20";
  const todayDate = new Date(todayStr);
  const todayDay = todayDate.getDate();
  const todayMonth = todayDate.getMonth();
  const todayYear = todayDate.getFullYear();

  const handleSubmit = () => {
    if (!item || !selectedDay) return;
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(selectedDay).padStart(2, "0");
    onSchedule({
      itemId: item.id,
      date: `${currentYear}-${m}-${d}`,
      time,
      platform,
    });
  };

  const isDateInPast = (day: number): boolean => {
    if (currentYear < todayYear) return true;
    if (currentYear > todayYear) return false;
    if (currentMonth < todayMonth) return true;
    if (currentMonth > todayMonth) return false;
    return day < todayDay;
  };

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
              <h2 className="text-lg font-bold text-ink">
                Planifier un contenu
              </h2>
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

            {/* Item preview */}
            {item && (
              <div className="bg-cream/50 border border-stone-custom/30 rounded-xl p-3 mb-5 flex items-center gap-2.5">
                <span className="text-xl">{item.emoji}</span>
                <p className="text-[13px] font-semibold text-ink truncate">
                  {item.hook}
                </p>
              </div>
            )}

            {/* Mini calendar */}
            <div className="mb-4">
              <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2">
                Date &mdash; {MONTHS_FR[currentMonth]} {currentYear}
              </p>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS_FR.map((dayName) => (
                  <div
                    key={dayName}
                    className="text-center text-[9px] font-bold text-faded uppercase"
                  >
                    {dayName}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Padding */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isPast = isDateInPast(day);
                  const isSelected = selectedDay === day;
                  const isToday =
                    currentMonth === todayMonth &&
                    currentYear === todayYear &&
                    day === todayDay;
                  return (
                    <button
                      key={day}
                      disabled={isPast}
                      onClick={() => setSelectedDay(day)}
                      className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${
                        isSelected
                          ? "bg-ink text-white"
                          : isToday
                          ? "bg-gold/15 text-gold"
                          : isPast
                          ? "text-faded/40 cursor-not-allowed"
                          : "text-ink hover:bg-beige"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time */}
            <div className="mb-4">
              <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2">
                Heure de publication
              </p>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-2.5 text-sm text-ink font-medium outline-none"
              />
            </div>

            {/* Platform */}
            <div className="mb-5">
              <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2">
                Plateforme
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlatform("ig")}
                  className={`platform-chip border border-stone-custom rounded-lg px-4 py-2.5 text-[12px] font-bold flex items-center gap-2 ${
                    platform === "ig"
                      ? "bg-ink text-white border-ink selected"
                      : "text-muted-rb"
                  }`}
                >
                  <Icon icon="simple-icons:instagram" width={14} />
                  IG
                </button>
                <button
                  onClick={() => setPlatform("tk")}
                  className={`platform-chip border border-stone-custom rounded-lg px-4 py-2.5 text-[12px] font-bold flex items-center gap-2 ${
                    platform === "tk"
                      ? "bg-ink text-white border-ink selected"
                      : "text-muted-rb"
                  }`}
                >
                  <Icon icon="simple-icons:tiktok" width={13} />
                  TK
                </button>
                <button
                  onClick={() => setPlatform("both")}
                  className={`platform-chip border border-stone-custom rounded-lg px-4 py-2.5 text-[12px] font-bold flex items-center gap-2 ${
                    platform === "both"
                      ? "bg-ink text-white border-ink selected"
                      : "text-muted-rb"
                  }`}
                >
                  <Icon icon="solar:link-circle-linear" width={14} />
                  Les deux
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!selectedDay || !item}
              className="btn-primary w-full bg-ink text-white py-3.5 rounded-xl text-sm font-bold shadow-md shadow-ink/10 flex items-center justify-center gap-2"
            >
              <Icon icon="solar:calendar-add-bold" width={16} />
              Planifier
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
