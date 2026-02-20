"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { modalIn, overlayVariants } from "@/lib/motion";

type ThemeModalProps = {
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
};

export function ThemeModal({ open, onClose, onGenerate }: ThemeModalProps) {
  const [theme, setTheme] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setTheme("");
      onClose();
      onGenerate();
    }, 3000);
  };

  const handleClose = () => {
    setTheme("");
    setGenerating(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
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
            className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
            variants={modalIn}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gold/15 rounded-xl flex items-center justify-center">
                <Icon
                  icon="solar:magic-stick-3-linear"
                  width={20}
                  className="text-golddark"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">
                  Idees sur un theme
                </h3>
                <p className="text-xs text-muted-rb">
                  Decrivez le sujet pour generer des idees ciblees
                </p>
              </div>
            </div>

            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder={'Ex: "Menu glace d\'ete" ou "Saint-Valentin"'}
              className="w-full bg-beige/50 border border-stone-custom rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-faded outline-none focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,26,26,.06)] transition-all resize-none h-28"
            />

            <div className="flex items-center justify-between mt-5">
              <button
                onClick={handleClose}
                className="text-sm font-medium text-muted-rb hover:text-ink transition-colors"
              >
                Annuler
              </button>
              <button
                disabled={theme.trim().length < 3 || generating}
                onClick={handleGenerate}
                className="btn-primary bg-ink text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <Icon
                      icon="solar:refresh-linear"
                      width={16}
                      className="animate-spin"
                    />
                    Generation...
                  </>
                ) : (
                  <>
                    <Icon
                      icon="solar:stars-minimalistic-linear"
                      width={16}
                    />
                    Generer
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
