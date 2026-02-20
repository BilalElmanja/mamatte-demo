"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { easing } from "@/lib/motion";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easing.smooth },
  },
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  // Split title to handle the italic gold word
  // Expected format: "Créez du contenu\nvirAL." where last word is styled
  // We'll handle it by splitting at the line break marker
  const titleParts = title.split("{italic}");
  const hasItalic = titleParts.length > 1;

  return (
    <motion.div
      className="text-center mb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div
        className="inline-flex items-center gap-2.5 mb-8"
        variants={itemVariants}
      >
        <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center shadow-lg shadow-ink/15">
          <Icon icon="solar:cup-hot-bold" width={20} className="text-white" />
        </div>
        <span className="text-base font-bold tracking-tight text-ink">
          ReelBoost
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[.95]"
        variants={itemVariants}
      >
        {hasItalic ? (
          <>
            {titleParts[0]}
            <br />
            <span className="font-serif italic font-medium text-gold">
              {titleParts[1]}
            </span>
          </>
        ) : (
          title
        )}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-muted-rb mt-4 text-[15px] leading-relaxed"
        variants={itemVariants}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
}
