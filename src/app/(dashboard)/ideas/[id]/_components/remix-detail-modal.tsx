"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { modalIn, overlayVariants } from "@/lib/motion";

type RemixDetailModalProps = {
  open: boolean;
  onClose: () => void;
  onScrollToGenerator: () => void;
};

export function RemixDetailModal({
  open,
  onClose,
  onScrollToGenerator,
}: RemixDetailModalProps) {
  const handleGoToGenerator = () => {
    onClose();
    setTimeout(() => {
      onScrollToGenerator();
    }, 200);
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
            className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl text-center"
            variants={modalIn}
          >
            <div className="w-14 h-14 bg-gold/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="solar:magic-stick-3-bold"
                width={28}
                className="text-golddark"
              />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">
              Remixer cette id&eacute;e
            </h3>
            <p className="text-sm text-muted-rb mb-6">
              Utilisez le panneau &laquo; G&eacute;n&eacute;rer du contenu
              &raquo; ci-dessous pour cr&eacute;er des variantes, hooks, scripts
              ou captions &agrave; partir de cette id&eacute;e.
            </p>
            <button
              onClick={handleGoToGenerator}
              className="btn-primary bg-ink text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto"
            >
              <Icon icon="solar:arrow-down-linear" width={16} />
              Aller au g&eacute;n&eacute;rateur
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
