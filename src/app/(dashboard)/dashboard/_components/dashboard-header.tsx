"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";

export function DashboardHeader() {
  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
          Bonjour, <span className="font-serif italic text-gold">Mamatte</span> ☕
        </h1>
        <p className="text-sm text-muted-rb mt-1">
          Dernier scraping : <span className="font-medium text-inksoft">il y a 2 jours</span> · Prochain : dimanche 5h
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="platform-badge inline-flex items-center gap-1.5 text-[10px] font-bold text-[#E1306C] bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-lg">
          <Icon icon="simple-icons:instagram" width={11} />
          Connecté
        </span>
        <span className="platform-badge inline-flex items-center gap-1.5 text-[10px] font-bold text-tiktok bg-tiktok-bg border border-pink-100 px-2.5 py-1 rounded-lg">
          <Icon icon="simple-icons:tiktok" width={10} />
          Connecté
        </span>
      </div>
    </motion.div>
  );
}
