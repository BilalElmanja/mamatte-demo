"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { modalIn, overlayVariants } from "@/lib/motion";

type AddModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (platform: "ig" | "tk", handle: string) => void;
};

export function AddModal({ open, onClose, onAdd }: AddModalProps) {
  const [platform, setPlatform] = useState<"ig" | "tk">("ig");
  const [handle, setHandle] = useState("");

  const handleSubmit = () => {
    if (handle.trim()) {
      onAdd(platform, handle.trim());
      setHandle("");
      setPlatform("ig");
    }
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
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-ink">
                Ajouter un concurrent
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-beige"
              >
                <Icon
                  icon="solar:close-circle-linear"
                  width={18}
                  className="text-muted-rb"
                />
              </button>
            </div>

            {/* Platform select */}
            <div className="mb-4">
              <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2">
                Plateforme
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlatform("ig")}
                  className={`platform-chip border border-stone-custom rounded-lg px-4 py-2.5 text-[12px] font-bold flex items-center gap-2 ${
                    platform === "ig"
                      ? "bg-ink text-white border-ink"
                      : "text-muted-rb"
                  }`}
                >
                  <Icon icon="simple-icons:instagram" width={14} />
                  Instagram
                </button>
                <button
                  onClick={() => setPlatform("tk")}
                  className={`platform-chip border border-stone-custom rounded-lg px-4 py-2.5 text-[12px] font-bold flex items-center gap-2 ${
                    platform === "tk"
                      ? "bg-ink text-white border-ink"
                      : "text-muted-rb"
                  }`}
                >
                  <Icon icon="simple-icons:tiktok" width={13} />
                  TikTok
                </button>
              </div>
            </div>

            {/* Username */}
            <div className="mb-5">
              <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2">
                Nom d&apos;utilisateur
              </p>
              <div className="flex items-center bg-beige/30 border border-stone-custom rounded-xl px-4 py-3 gap-2 focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgba(26,26,26,.06)] transition-all">
                <span className="text-sm text-muted-rb font-medium">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="nom_du_concurrent"
                  className="flex-1 bg-transparent text-sm text-ink font-medium outline-none placeholder:text-faded"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="btn-primary w-full bg-ink text-white py-3.5 rounded-xl text-sm font-bold shadow-md shadow-ink/10 flex items-center justify-center gap-2"
            >
              <Icon icon="solar:add-circle-linear" width={16} />
              Ajouter et scraper
            </button>
            <p className="text-[10px] text-faded text-center mt-3">
              Le premier scraping commence imm&eacute;diatement
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
