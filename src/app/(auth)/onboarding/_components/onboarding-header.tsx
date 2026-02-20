"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { easing } from "@/lib/motion";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingHeader({ currentStep, totalSteps }: OnboardingHeaderProps) {
  const label = currentStep <= totalSteps ? `Étape ${currentStep} sur ${totalSteps}` : "Terminé !";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: easing.smooth }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
            <Icon icon="solar:cup-hot-bold" width={14} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-ink">ReelBoost</span>
        </div>
        <span className="text-[10px] font-bold text-faded uppercase tracking-[.2em]">{label}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1, ease: easing.smooth }}
        className="flex gap-1.5 mb-10"
      >
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full"
            animate={{
              backgroundColor: i < currentStep || currentStep > totalSteps ? "#1A1A1A" : "#E8E2DA",
            }}
            transition={{ duration: 0.5, ease: easing.smooth }}
          />
        ))}
      </motion.div>
    </>
  );
}
