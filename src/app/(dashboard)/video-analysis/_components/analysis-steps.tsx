"use client";

import { Icon } from "@iconify/react";

const STEPS = [
  { label: "Extraction des frames", icon: "solar:gallery-wide-linear" },
  { label: "Analyse visuelle par IA", icon: "solar:cpu-bolt-linear" },
  { label: "D\u00e9tection des patterns", icon: "solar:graph-up-linear" },
  { label: "G\u00e9n\u00e9ration des insights", icon: "solar:document-text-linear" },
];

type AnalysisStepsProps = {
  currentStep: number;
};

export function AnalysisSteps({ currentStep }: AnalysisStepsProps) {
  return (
    <div className="flex flex-col gap-3">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.label} className="analysis-step flex items-center gap-3">
            {isCompleted && (
              <Icon
                icon="solar:check-circle-bold"
                width={20}
                className="text-green-500 shrink-0"
              />
            )}
            {isCurrent && (
              <Icon
                icon="solar:refresh-linear"
                width={20}
                className="text-gold animate-spin shrink-0"
              />
            )}
            {!isCompleted && !isCurrent && (
              <Icon
                icon="solar:circle-linear"
                width={20}
                className="text-faded shrink-0"
              />
            )}
            <span
              className={`text-[13px] ${
                isCompleted
                  ? "text-muted-rb line-through"
                  : isCurrent
                  ? "font-bold text-ink"
                  : "text-faded"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
