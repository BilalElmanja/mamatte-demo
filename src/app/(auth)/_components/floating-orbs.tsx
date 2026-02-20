"use client";

import { motion } from "framer-motion";

export function FloatingOrbs() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Orb 1: gold/amber gradient — top-right area */}
      <motion.div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-gold/10 via-beige/30 to-transparent blur-3xl"
        animate={{
          y: [0, -20, 0, 10, 0],
          x: [0, 15, -10, 5, 0],
          scale: [1, 1.05, 0.95, 1.02, 1],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Orb 2: rose/stone gradient — bottom-left area */}
      <motion.div
        className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-stone-custom/40 via-transparent to-transparent blur-3xl"
        animate={{
          y: [0, 15, -10, 5, 0],
          x: [0, -10, 20, -15, 0],
          scale: [1, 0.98, 1.03, 0.97, 1],
        }}
        transition={{
          duration: 24,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Orb 3: blue/indigo gradient — center area */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-gold/5 blur-3xl"
        animate={{
          y: [0, -15, 10, -5, 0],
          x: [0, 10, -20, 15, 0],
          scale: [1, 1.04, 0.96, 1.01, 1],
        }}
        transition={{
          duration: 18,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
