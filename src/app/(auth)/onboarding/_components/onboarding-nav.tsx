"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface OnboardingNavProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
}

export function OnboardingNav({ currentStep, totalSteps, onBack, onNext }: OnboardingNavProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-custom/50">
      <button
        onClick={onBack}
        className={cn(
          "text-sm font-medium text-muted-rb flex items-center gap-2 transition-colors hover:text-ink",
          currentStep <= 1 && "invisible"
        )}
      >
        <Icon icon="solar:arrow-left-linear" width={16} />
        Retour
      </button>

      <button
        onClick={onNext}
        className="bg-ink text-white px-8 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2 group ml-auto transition-all duration-350 hover:translate-y-[-1px] hover:shadow-[0_12px_40px_rgba(0,0,0,.15)] active:translate-y-0 active:scale-[0.98]"
      >
        {isLastStep ? (
          <>
            Terminer
            <Icon icon="solar:check-read-linear" width={16} className="group-hover:scale-110 transition-transform duration-300" />
          </>
        ) : (
          <>
            Continuer
            <Icon icon="solar:arrow-right-linear" width={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </>
        )}
      </button>
    </div>
  );
}
