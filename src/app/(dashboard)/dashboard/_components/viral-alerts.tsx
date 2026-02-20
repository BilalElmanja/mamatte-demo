"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";
import { VIRAL_ALERTS } from "../../_data/mock-data";

export function ViralAlerts() {
  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.18 }}
      className="section-card bg-gradient-to-br from-orange-50 to-cream rounded-2xl border border-orange-200/40 p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🔥</span>
        <h2 className="text-sm font-bold text-orange-600">Alertes virales</h2>
        <span className="ml-auto text-[9px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
          2 nouvelles
        </span>
      </div>
      <div className="space-y-3">
        {VIRAL_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="bg-white/80 rounded-xl p-3 border border-orange-100/50"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon
                icon={alert.platformIcon}
                width={alert.platform === "tk" ? 9 : 10}
                className={alert.platformColor}
              />
              <span className="text-[10px] font-bold text-ink">{alert.account}</span>
              <span className="text-[10px] text-orange-500 font-bold ml-auto">
                {alert.views}
              </span>
            </div>
            <p className="text-[12px] text-inksoft font-medium leading-snug">
              {alert.hook}
            </p>
            <Link
              href="/outliers"
              className="mt-2 text-[10px] font-bold text-gold hover:text-golddark transition-colors flex items-center gap-1"
            >
              <Icon icon="solar:magic-stick-3-linear" width={11} />
              S&apos;inspirer →
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
