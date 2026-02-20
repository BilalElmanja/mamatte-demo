"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { slideUpBlur } from "@/lib/motion";
import { IdeaHero } from "./_components/idea-hero";
import { ScriptPanel } from "./_components/script-panel";
import { GeneratePanel } from "./_components/generate-panel";
import { RemixDetailModal } from "./_components/remix-detail-modal";

export default function IdeaDetailPage() {
  const [remixOpen, setRemixOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const generateRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(""), 2800);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const scrollToGenerator = () => {
    generateRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="max-w-[820px] mx-auto">
        {/* Back link */}
        <motion.div
          variants={slideUpBlur}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-rb hover:text-ink transition-colors mb-6"
          >
            <Icon icon="solar:arrow-left-linear" width={16} />
            Retour aux id&eacute;es
          </Link>
        </motion.div>

        {/* Idea card */}
        <IdeaHero
          onRemix={() => setRemixOpen(true)}
          onToast={showToast}
        />

        {/* Script panel */}
        <ScriptPanel onToast={showToast} />

        {/* Generate panel */}
        <GeneratePanel onToast={showToast} panelRef={generateRef} />

        {/* Export PDF */}
        <motion.div
          variants={slideUpBlur}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.24 }}
          className="flex justify-end"
        >
          <button
            onClick={() => showToast("PDF export\u00e9")}
            className="btn-outline border border-stone-custom rounded-xl px-5 py-2.5 text-xs font-bold text-muted-rb items-center gap-2 hidden md:flex"
          >
            <Icon icon="solar:file-download-linear" width={14} />
            Exporter en PDF
          </button>
        </motion.div>
      </div>

      {/* Remix modal */}
      <RemixDetailModal
        open={remixOpen}
        onClose={() => setRemixOpen(false)}
        onScrollToGenerator={scrollToGenerator}
      />

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8, x: "-50%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 md:bottom-6 left-1/2 z-50 pointer-events-none"
          >
            <div className="bg-ink text-white px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 shadow-2xl shadow-ink/20">
              <Icon icon="solar:check-circle-bold" width={17} />
              <span>{toastMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
