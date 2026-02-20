"use client";

import { motion } from "framer-motion";
import { easing } from "@/lib/motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: 0.3, ease: easing.smooth }}
      className={`glass rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-black/[.03] ${className}`}
    >
      {children}
    </motion.div>
  );
}
