"use client";

import { Icon } from "@iconify/react";
import { SelectionCard } from "./selection-card";

interface StepLanguageProps {
  selectedLanguage: "fr" | "en";
  onSelect: (lang: "fr" | "en") => void;
}

export function StepLanguage({ selectedLanguage, onSelect }: StepLanguageProps) {
  return (
    <div>
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-beige rounded-2xl mb-5">
          <Icon icon="solar:globus-linear" width={28} className="text-ink" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-[.95]">
          Quelle langue parlent vos<br />
          <span className="font-serif italic font-medium text-gold">clients</span> ?
        </h2>
        <p className="text-muted-rb mt-3 text-sm max-w-sm mx-auto">
          Toutes les idées, scripts et rapports seront générés dans cette langue.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        <SelectionCard
          selected={selectedLanguage === "fr"}
          onSelect={() => onSelect("fr")}
          emoji="🇫🇷"
          label="Français"
        />
        <SelectionCard
          selected={selectedLanguage === "en"}
          onSelect={() => onSelect("en")}
          emoji="🇬🇧"
          label="English"
        />
      </div>
    </div>
  );
}
