"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";

export function PlatformComparison() {
  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 }}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 mt-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon icon="solar:chart-2-linear" width={18} className="text-gold" />
        <h2 className="text-sm font-bold text-ink">Vos performances cross-platform</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Instagram */}
        <div className="bg-gradient-to-br from-pink-50/50 to-cream rounded-xl border border-pink-100/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="simple-icons:instagram" width={14} className="text-[#E1306C]" />
            <span className="text-[12px] font-bold text-ink">Instagram Reels</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-extrabold text-ink">18</p>
              <p className="text-[9px] text-muted-rb">Reels</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-ink">2.1K</p>
              <p className="text-[9px] text-muted-rb">Vues moy.</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-green-500">+42%</p>
              <p className="text-[9px] text-muted-rb">vs. mois dern.</p>
            </div>
          </div>
        </div>
        {/* TikTok */}
        <div className="bg-gradient-to-br from-tiktok-bg/50 to-cream rounded-xl border border-pink-100/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="simple-icons:tiktok" width={13} className="text-tiktok" />
            <span className="text-[12px] font-bold text-ink">TikTok</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-extrabold text-ink">8</p>
              <p className="text-[9px] text-muted-rb">Vidéos</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-ink">4.6K</p>
              <p className="text-[9px] text-muted-rb">Vues moy.</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-green-500">+128%</p>
              <p className="text-[9px] text-muted-rb">vs. mois dern.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
