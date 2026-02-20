"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { cardPop, stagger } from "@/lib/motion";

export type Report = {
  title: string;
  summary: string;
  isNew: boolean;
};

type ReportListProps = {
  reports: Report[];
  onSelect: (index: number) => void;
};

export function ReportList({ reports, onSelect }: ReportListProps) {
  return (
    <motion.div
      variants={stagger(0, 0.06)}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-3">
        {reports.map((report, i) => (
          <motion.div
            key={i}
            variants={cardPop}
            onClick={() => onSelect(i)}
            className="report-card bg-white rounded-2xl border border-stone-custom/40 p-5 flex items-center gap-4"
          >
            <div
              className={`w-11 h-11 ${
                report.isNew ? "bg-gold/15" : "bg-beige"
              } rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              <Icon
                icon="solar:chart-2-linear"
                width={22}
                className={report.isNew ? "text-golddark" : "text-muted-rb"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-ink">{report.title}</p>
              <p className="text-[12px] text-muted-rb mt-0.5">
                {report.summary}
              </p>
            </div>
            {report.isNew && (
              <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-1 rounded-md flex-shrink-0 hidden sm:block">
                Nouveau
              </span>
            )}
            <Icon
              icon="solar:arrow-right-linear"
              width={16}
              className="text-faded flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="text-center py-6">
        <button className="btn-ghost text-sm font-semibold text-muted-rb flex items-center gap-2 mx-auto">
          <Icon icon="solar:arrow-down-linear" width={16} />
          Charger plus
        </button>
      </div>
    </motion.div>
  );
}
