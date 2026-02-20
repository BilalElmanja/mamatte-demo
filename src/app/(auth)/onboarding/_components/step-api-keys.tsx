"use client";

import { Icon } from "@iconify/react";
import { ApiKeyCard } from "./api-key-card";

interface ApiKeyState {
  value: string;
  status: "idle" | "testing" | "valid" | "invalid";
}

interface StepApiKeysProps {
  apiKeys: Record<string, ApiKeyState>;
  onValueChange: (key: string, value: string) => void;
  onTest: (key: string) => void;
}

const API_KEY_CONFIG = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Transcription, analyse & génération d'idées",
    icon: "solar:magic-stick-3-linear",
    iconBgColor: "bg-ink",
    required: true,
    placeholder: "sk-...",
    helpUrl: "https://platform.openai.com",
    helpLabel: "Obtenir la clé → platform.openai.com",
  },
  {
    id: "apify",
    name: "Apify",
    description: "Scraping de Reels Instagram",
    icon: "solar:radar-2-linear",
    iconBgColor: "bg-emerald-600",
    required: true,
    placeholder: "apify_api_...",
    helpUrl: "https://console.apify.com",
    helpLabel: "Obtenir le token → console.apify.com",
  },
  {
    id: "rapidapi",
    name: "RapidAPI",
    description: "Recherche de profils Instagram",
    icon: "solar:bolt-circle-linear",
    iconBgColor: "bg-blue-600",
    required: true,
    placeholder: "Votre clé RapidAPI",
    helpUrl: "https://rapidapi.com",
    helpLabel: "Obtenir la clé → rapidapi.com",
  },
  {
    id: "resend",
    name: "Resend",
    description: "Rapports hebdomadaires par e-mail",
    icon: "solar:letter-linear",
    iconBgColor: "bg-stone-custom text-muted-rb",
    required: false,
    placeholder: "re_...",
    helpUrl: "",
    helpLabel: "",
    helpNote: "Passez si vous n'avez pas besoin des rapports par e-mail.",
  },
];

export function StepApiKeys({ apiKeys, onValueChange, onTest }: StepApiKeysProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/15 rounded-2xl mb-5">
          <Icon icon="solar:key-minimalistic-linear" width={28} className="text-golddark" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-[.95]">
          Connectez vos<br />
          <span className="font-serif italic font-medium text-gold">services IA</span>
        </h2>
        <p className="text-muted-rb mt-3 text-sm max-w-sm mx-auto">
          Fournissez vos propres clés API. Elles sont chiffrées et jamais partagées.
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-lg mx-auto">
        {API_KEY_CONFIG.map((config) => (
          <ApiKeyCard
            key={config.id}
            id={config.id}
            name={config.name}
            description={config.description}
            icon={config.icon}
            iconBgColor={config.iconBgColor}
            required={config.required}
            placeholder={config.placeholder}
            helpUrl={config.helpUrl}
            helpLabel={config.helpLabel}
            helpNote={config.helpNote}
            value={apiKeys[config.id]?.value || ""}
            status={apiKeys[config.id]?.status || "idle"}
            onValueChange={(value) => onValueChange(config.id, value)}
            onTest={() => onTest(config.id)}
          />
        ))}
        <p className="text-center text-[11px] text-muted-rb mt-1 flex items-center justify-center gap-1.5">
          <Icon icon="solar:shield-check-linear" width={13} className="text-gold" />
          Chiffrées et stockées en sécurité. Jamais partagées.
        </p>
      </div>
    </div>
  );
}
