"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur, stagger } from "@/lib/motion";
import type { Report } from "./report-list";
import { TopReels } from "./top-reels";
import { WinningTopics } from "./winning-topics";
import { HookStructures } from "./hook-structures";
import { EmotionalTriggers } from "./emotional-triggers";
import { PowerWords } from "./power-words";

type ReportDetailProps = {
  report: Report;
  onBack: () => void;
};

export function ReportDetail({ report, onBack }: ReportDetailProps) {
  return (
    <motion.div
      variants={stagger(0, 0.06)}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        variants={slideUpBlur}
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-rb hover:text-ink transition-colors mb-6"
      >
        <Icon icon="solar:arrow-left-linear" width={16} />
        Retour aux rapports
      </motion.button>

      <motion.div variants={slideUpBlur} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/15 rounded-xl flex items-center justify-center">
            <Icon icon="solar:chart-2-linear" width={20} className="text-golddark" />
          </div>
          <div>
            <p className="text-xs font-bold text-gold uppercase tracking-wider">
              Rapport patterns
            </p>
            <h2 className="text-xl font-bold text-ink">{report.title}</h2>
          </div>
        </div>
      </motion.div>

      <TopReels />
      <WinningTopics />
      <HookStructures />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <EmotionalTriggers />
        <PowerWords />
      </div>
    </motion.div>
  );
}
