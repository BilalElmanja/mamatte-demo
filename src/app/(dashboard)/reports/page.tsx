"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideUpBlur } from "@/lib/motion";
import { ReportList, type Report } from "./_components/report-list";
import { ReportDetail } from "./_components/report-detail";

const REPORTS: Report[] = [
  {
    title: "Semaine du 17 F\u00e9v. 2026",
    summary:
      "3 sujets gagnants \u00b7 5 structures de hook \u00b7 12 power words",
    isNew: true,
  },
  {
    title: "Semaine du 10 F\u00e9v. 2026",
    summary:
      "4 sujets gagnants \u00b7 3 structures de hook \u00b7 10 power words",
    isNew: false,
  },
  {
    title: "Semaine du 3 F\u00e9v. 2026",
    summary:
      "2 sujets gagnants \u00b7 4 structures de hook \u00b7 8 power words",
    isNew: false,
  },
  {
    title: "Semaine du 27 Jan. 2026",
    summary:
      "3 sujets gagnants \u00b7 2 structures de hook \u00b7 9 power words",
    isNew: false,
  },
];

export default function ReportsPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedIndex(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideUpBlur}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
          Rapports{" "}
          <span className="font-serif italic text-gold">hebdomadaires</span>
        </h1>
        <p className="text-sm text-muted-rb mt-1">
          Analyse des tendances et patterns de vos concurrents
        </p>
      </motion.div>

      {/* Views */}
      <AnimatePresence mode="wait">
        {selectedIndex === null ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ReportList reports={REPORTS} onSelect={handleSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ReportDetail
              report={REPORTS[selectedIndex]}
              onBack={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
