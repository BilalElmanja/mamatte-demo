"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { heroFade, easing } from "@/lib/motion";
import { HeroPhoneMockup } from "./hero-phone-mockup";

const staggerItem = {
  hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: easing.smooth,
      delay,
    },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center pt-24 pb-16 overflow-hidden">
      {/* Ambient blobs */}
      <div
        className="absolute top-10 right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-gold/6 to-beige/15 rounded-full blur-[100px]"
        style={{ animation: "floatSlow 8s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-0 left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-stone-custom/20 to-goldlight/5 rounded-full blur-[80px]"
        style={{ animation: "floatSlow 10s 2s ease-in-out infinite" }}
      />

      {/* Decorative dots */}
      <div
        className="absolute top-[20%] left-[12%] w-2 h-2 bg-gold/25 rounded-full"
        style={{ animation: "float 4s 0.5s ease-in-out infinite" }}
      />
      <div
        className="absolute top-[40%] left-[8%] w-1.5 h-1.5 bg-gold/15 rounded-full"
        style={{ animation: "float 5s 1s ease-in-out infinite" }}
      />
      <div
        className="absolute top-[55%] right-[8%] w-2.5 h-2.5 bg-gold/20 rounded-full"
        style={{ animation: "float 6s 1.5s ease-in-out infinite" }}
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* LEFT: Copy */}
          <div className="flex-1 max-w-[580px] text-center lg:text-left">
            {/* Badge */}
            <motion.div
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-stone-custom/40 rounded-full px-4 py-2 mb-8 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                  style={{ animation: "pulse 2s infinite" }}
                />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              <span className="text-[12px] font-semibold text-muted-rb">
                Instagram Reels + TikTok &middot;{" "}
                <span className="text-ink font-bold">240+</span> cafes en France
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              custom={0.25}
              className="text-[2.6rem] sm:text-[3.2rem] lg:text-[3.75rem] font-extrabold leading-[1.06] tracking-tight text-ink mb-7 text-balance"
            >
              Vos concurrents cartonnent sur Instagram.
              <span className="block font-serif italic font-normal gradient-text mt-1">
                Et vous ?
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="text-base sm:text-lg text-muted-rb leading-[1.7] mb-10 max-w-[480px] mx-auto lg:mx-0"
            >
              ReelBoost{" "}
              <strong className="text-ink font-semibold">
                analyse les Reels &amp; TikToks de vos concurrents
              </strong>
              , detecte ce qui marche, et genere chaque semaine des{" "}
              <strong className="text-ink font-semibold">
                idees de contenu pretes a filmer
              </strong>{" "}
              &mdash; avec hook, script et caption. Pour Instagram{" "}
              <em>et</em> TikTok.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="flex flex-wrap gap-4 mb-7 justify-center lg:justify-start"
            >
              <Link
                href="/sign-up"
                className="btn-hero bg-ink text-white px-8 py-4 rounded-2xl text-[15px] font-bold inline-flex items-center gap-3 shadow-xl shadow-ink/15"
              >
                Commencer gratuitement
                <Icon icon="solar:arrow-right-linear" width={18} />
              </Link>
              <a
                href="#how"
                className="btn-outline-hero border-2 border-stone-custom/60 px-7 py-4 rounded-2xl text-[15px] font-semibold text-muted-rb inline-flex items-center gap-2.5 hover:bg-ink hover:text-white hover:border-ink transition-all duration-350"
              >
                <Icon
                  icon="solar:play-circle-linear"
                  width={20}
                  className="text-gold"
                />
                Voir la demo
              </a>
            </motion.div>

            {/* Trust line */}
            <motion.p
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              custom={0.7}
              className="text-[11px] text-faded flex items-center gap-2.5 flex-wrap justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-1">
                <Icon icon="solar:lock-linear" width={13} />
                Aucune carte requise
              </span>
              <span className="w-1 h-1 bg-stone-custom rounded-full" />
              <span>Configuration en 5 min</span>
              <span className="w-1 h-1 bg-stone-custom rounded-full" />
              <span>Vos cles API, vos donnees</span>
            </motion.p>
          </div>

          {/* RIGHT: Phone mockup */}
          <div className="flex-1 hidden lg:flex justify-center relative">
            <HeroPhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
