"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slideUpBlur, stagger, easing } from "@/lib/motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen font-sans antialiased bg-cream flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background orbs */}
      <div
        className="absolute w-[300px] h-[300px] bg-gradient-to-br from-gold/10 to-beige/30 rounded-full blur-3xl top-[10%] left-[5%]"
        style={{ animation: "drift 8s ease-in-out infinite" }}
      />
      <div
        className="absolute w-[400px] h-[400px] bg-gradient-to-br from-stone-custom/20 to-goldlight/10 rounded-full blur-3xl bottom-[10%] right-[5%]"
        style={{ animation: "drift 10s 2s ease-in-out infinite reverse" }}
      />

      {/* Giant 404 background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="text-[20rem] md:text-[28rem] font-extrabold text-ink/10 leading-none tracking-tighter"
          style={{ animation: "pulse404 4s ease-in-out infinite" }}
        >
          404
        </span>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-md"
        variants={stagger(0, 0.1)}
        initial="hidden"
        animate="visible"
      >
        {/* Coffee cup illustration */}
        <motion.div variants={slideUpBlur} className="mb-8">
          <div
            className="relative inline-block"
            style={{ animation: "float404 5s ease-in-out infinite" }}
          >
            {/* Steam */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-3">
              <div
                className="w-2 h-6 bg-gradient-to-t from-stone-custom/40 to-transparent rounded-full"
                style={{ animation: "steamAnim 2.5s ease-out infinite" }}
              />
              <div
                className="w-1.5 h-5 bg-gradient-to-t from-stone-custom/30 to-transparent rounded-full"
                style={{ animation: "steamAnim 2.5s 0.6s ease-out infinite" }}
              />
              <div
                className="w-2 h-7 bg-gradient-to-t from-stone-custom/35 to-transparent rounded-full"
                style={{ animation: "steamAnim 2.5s 1.2s ease-out infinite" }}
              />
            </div>
            {/* Cup body */}
            <div className="w-28 h-28 bg-white rounded-3xl border-2 border-stone-custom/50 flex items-center justify-center shadow-xl shadow-ink/5 relative">
              <div className="w-20 h-20 bg-ink rounded-2xl flex items-center justify-center">
                <Icon icon="solar:cup-hot-bold" width={36} className="text-white" />
              </div>
              {/* Cup handle */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-10 border-2 border-stone-custom/50 border-l-0 rounded-r-full bg-white" />
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.h1
          variants={slideUpBlur}
          className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-3"
        >
          Page{" "}
          <span className="font-serif italic text-gold">introuvable</span>
        </motion.h1>

        <motion.p
          variants={slideUpBlur}
          className="text-base text-muted-rb leading-relaxed mb-8"
        >
          Cette page a peut-\u00eatre \u00e9t\u00e9 d\u00e9plac\u00e9e, supprim\u00e9e, ou n&apos;a jamais
          exist\u00e9. Comme un Reel qui n&apos;a jamais \u00e9t\u00e9 film\u00e9.
        </motion.p>

        {/* Actions */}
        <motion.div
          variants={slideUpBlur}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/dashboard"
            className="btn-primary bg-ink text-white px-7 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-ink/10"
          >
            <Icon icon="solar:widget-2-linear" width={16} />
            Retour au tableau de bord
          </Link>
          <button
            onClick={() => router.back()}
            className="btn-ghost text-sm font-semibold text-muted-rb flex items-center gap-2 px-4 py-3"
          >
            <Icon icon="solar:arrow-left-linear" width={14} />
            Page pr\u00e9c\u00e9dente
          </button>
        </motion.div>

        {/* Breadcrumbs */}
        <motion.div variants={slideUpBlur} className="mt-12">
          <div className="flex items-center justify-center gap-4 text-[11px] text-faded">
            <Link href="/ideas" className="hover:text-ink transition-colors">
              Id\u00e9es
            </Link>
            <span>&middot;</span>
            <Link
              href="/competitors"
              className="hover:text-ink transition-colors"
            >
              Concurrents
            </Link>
            <span>&middot;</span>
            <Link href="/reports" className="hover:text-ink transition-colors">
              Rapports
            </Link>
            <span>&middot;</span>
            <Link href="/settings" className="hover:text-ink transition-colors">
              Param\u00e8tres
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
