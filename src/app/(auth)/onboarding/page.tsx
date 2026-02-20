"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stepVariants } from "@/lib/motion";
import { OnboardingHeader } from "./_components/onboarding-header";
import { OnboardingNav } from "./_components/onboarding-nav";
import { StepLanguage } from "./_components/step-language";
import { StepCompetitors } from "./_components/step-competitors";
import { StepApiKeys } from "./_components/step-api-keys";
import { StepComplete } from "./_components/step-complete";

interface Competitor {
  name: string;
  followers: string;
}

interface ApiKeyState {
  value: string;
  status: "idle" | "testing" | "valid" | "invalid";
}

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1
  const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en">("fr");

  // Step 2
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  // Step 3
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyState>>({
    openai: { value: "", status: "idle" },
    apify: { value: "", status: "idle" },
    rapidapi: { value: "", status: "idle" },
    resend: { value: "", status: "idle" },
  });

  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep(4);
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleAddCompetitor = useCallback((competitor: Competitor) => {
    setCompetitors((prev) => [...prev, competitor]);
  }, []);

  const handleRemoveCompetitor = useCallback((index: number) => {
    setCompetitors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleApiKeyChange = useCallback((key: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [key]: { ...prev[key], value, status: "idle" },
    }));
  }, []);

  const handleApiKeyTest = useCallback((key: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [key]: { ...prev[key], status: "testing" },
    }));

    setTimeout(() => {
      setApiKeys((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: "valid" },
      }));
    }, 1600);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-[600px] mx-auto">
        <OnboardingHeader currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <div className="min-h-[480px]">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <StepLanguage
                  selectedLanguage={selectedLanguage}
                  onSelect={setSelectedLanguage}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <StepCompetitors
                  competitors={competitors}
                  onAdd={handleAddCompetitor}
                  onRemove={handleRemoveCompetitor}
                  onSkip={goNext}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <StepApiKeys
                  apiKeys={apiKeys}
                  onValueChange={handleApiKeyChange}
                  onTest={handleApiKeyTest}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <StepComplete />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {currentStep <= TOTAL_STEPS && (
          <OnboardingNav
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onBack={goBack}
            onNext={goNext}
          />
        )}
      </div>
    </div>
  );
}
