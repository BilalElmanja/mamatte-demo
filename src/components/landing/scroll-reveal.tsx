"use client";

import { motion } from "framer-motion";
import { easing } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}

const directionMap = {
  up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const { hidden, visible } = directionMap[direction];

  return (
    <motion.div
      initial={hidden}
      whileInView={{
        ...visible,
        transition: {
          duration: 1,
          ease: easing.smooth,
          delay,
        },
      }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
