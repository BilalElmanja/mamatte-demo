"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { phonePop, easing } from "@/lib/motion";

export function HeroPhoneMockup() {
  return (
    <motion.div
      variants={phonePop}
      initial="hidden"
      animate="visible"
      className="relative"
      style={{ perspective: 1200 }}
    >
      {/* Main phone */}
      <div className="w-[310px] bg-white rounded-[2.8rem] shadow-[0_30px_80px_rgba(0,0,0,.12)] border border-stone-custom/30 overflow-hidden relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-ink rounded-b-2xl z-10" />

        {/* Screen content */}
        <div className="pt-8 pb-3 px-4 bg-cream min-h-[560px]">
          {/* App header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
                <Icon
                  icon="solar:cup-hot-bold"
                  width={12}
                  className="text-white"
                />
              </div>
              <span className="text-[11px] font-extrabold text-ink">
                ReelBoost
              </span>
            </div>
            <div className="w-6 h-6 bg-beige rounded-full flex items-center justify-center">
              <span className="text-[8px] font-bold text-muted-rb">M</span>
            </div>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white rounded-xl p-3 border border-stone-custom/25 shadow-sm">
              <p className="text-[8px] text-faded font-semibold uppercase tracking-wider">
                Idees
              </p>
              <p className="text-xl font-extrabold text-ink mt-0.5">12</p>
              <p className="text-[8px] text-green-500 font-bold mt-0.5">
                &uarr; cette semaine
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-stone-custom/25 shadow-sm">
              <p className="text-[8px] text-faded font-semibold uppercase tracking-wider">
                Outliers
              </p>
              <p className="text-xl font-extrabold text-ink mt-0.5">13</p>
              <div className="flex gap-0.5 mt-0.5">
                <span className="text-[7px] font-bold text-[#E1306C] bg-pink-50 px-1 py-0.5 rounded">
                  7 IG
                </span>
                <span className="text-[7px] font-bold text-tiktok bg-tiktok-bg px-1 py-0.5 rounded">
                  6 TK
                </span>
              </div>
            </div>
          </div>

          {/* Idea card */}
          <div className="bg-white rounded-xl p-3 border border-stone-custom/25 shadow-sm mb-2">
            <p className="text-[10px] font-bold text-ink leading-snug mb-1.5">
              &laquo; Tu as 3 secondes avant que ce latte art disparaisse &raquo;
            </p>
            <div className="flex gap-1 mb-2">
              <span className="text-[7px] bg-beige px-1.5 py-0.5 rounded font-bold text-muted-rb">
                ASMR
              </span>
              <span className="text-[7px] bg-green-50 px-1.5 py-0.5 rounded font-bold text-green-600">
                Facile
              </span>
            </div>
            <div className="flex gap-1.5">
              <div className="bg-ink rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1">
                <span className="text-[8px] text-white font-bold">
                  Script &rarr;
                </span>
              </div>
              <div className="bg-gold/15 border border-gold/30 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1">
                <Icon
                  icon="solar:magic-stick-3-linear"
                  width={10}
                  className="text-gold"
                />
                <span className="text-[8px] text-gold font-bold">Remixer</span>
              </div>
            </div>
          </div>

          {/* Outlier alert */}
          <div className="bg-gradient-to-r from-orange-50 to-cream rounded-xl p-3 border border-orange-200/40 mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px]">&#128293;</span>
              <span className="text-[8px] font-bold text-orange-600 uppercase tracking-wider">
                Alerte virale
              </span>
            </div>
            <p className="text-[10px] text-ink font-bold">
              @columbus_cafe &mdash; 245K vues
            </p>
            <p className="text-[9px] text-muted-rb mt-0.5">
              &laquo; Personne ne parle de cette technique... &raquo;
            </p>
            <div className="mt-2 bg-gold/15 border border-gold/25 rounded-lg px-2 py-1 inline-flex items-center gap-1">
              <Icon
                icon="solar:magic-stick-3-linear"
                width={9}
                className="text-gold"
              />
              <span className="text-[7px] text-gold font-bold">
                S&apos;inspirer
              </span>
            </div>
          </div>

          {/* 2nd idea */}
          <div className="bg-white rounded-xl p-3 border border-stone-custom/25 shadow-sm">
            <p className="text-[10px] font-bold text-ink leading-snug">
              &laquo; Le secret de notre cold brew &raquo;
            </p>
            <div className="flex gap-1 mt-1">
              <span className="text-[7px] bg-beige px-1.5 py-0.5 rounded font-bold text-muted-rb">
                Recette
              </span>
              <span className="text-[7px] bg-amber-50 px-1.5 py-0.5 rounded font-bold text-amber-600">
                Moyen
              </span>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="bg-white border-t border-stone-custom/25 px-6 py-2.5 flex justify-around">
          <div className="flex flex-col items-center gap-0.5">
            <Icon icon="solar:widget-2-bold" width={16} className="text-ink" />
            <span className="text-[7px] font-bold text-ink">Accueil</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Icon
              icon="solar:lightbulb-linear"
              width={16}
              className="text-faded"
            />
            <span className="text-[7px] text-faded">Idees</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Icon icon="solar:fire-linear" width={16} className="text-faded" />
            <span className="text-[7px] text-faded">Outliers</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Icon
              icon="solar:document-text-linear"
              width={16}
              className="text-faded"
            />
            <span className="text-[7px] text-faded">Scripts</span>
          </div>
        </div>
      </div>

      {/* ═══ Floating cards ═══ */}

      {/* Top-left: +340% views card */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: easing.smooth }}
        className="absolute -left-20 top-16 bg-white rounded-2xl shadow-xl shadow-ink/8 p-3.5 border border-stone-custom/25 z-20"
        style={{ animation: "cardFloat 5s 1s ease-in-out infinite" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop"
              className="w-full h-full object-cover"
              alt="coffee"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold text-ink">+340%</p>
            <p className="text-[9px] text-muted-rb">vues en 4 sem.</p>
          </div>
        </div>
      </motion.div>

      {/* Right: Script ready card */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: easing.smooth }}
        className="absolute -right-16 top-56 bg-white rounded-2xl shadow-xl shadow-ink/8 p-3 border border-stone-custom/25 z-20"
        style={{ animation: "cardFloat 6s 2s ease-in-out infinite" }}
      >
        <div className="flex items-center gap-2">
          <Icon
            icon="solar:stars-minimalistic-bold"
            width={16}
            className="text-gold"
          />
          <div>
            <p className="text-[10px] font-bold text-ink">Script pret</p>
            <p className="text-[8px] text-muted-rb">Hook + CTA + Caption</p>
          </div>
        </div>
      </motion.div>

      {/* Bottom-left: Outlier detected card */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: easing.smooth }}
        className="absolute -left-12 bottom-28 bg-ink rounded-2xl shadow-xl p-3 z-20"
        style={{ animation: "cardFloat 7s 3s ease-in-out infinite" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">&#128293;</span>
          <p className="text-[10px] font-bold text-white">
            Outlier detecte !
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
