"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { CompetitorRow } from "./competitor-row";

interface Competitor {
  name: string;
  followers: string;
}

interface StepCompetitorsProps {
  competitors: Competitor[];
  onAdd: (competitor: Competitor) => void;
  onRemove: (index: number) => void;
  onSkip: () => void;
}

const SAMPLE_COMPETITORS: Competitor[] = [
  { name: "mamatte.brunch.cafe", followers: "15.2K" },
  { name: "columbus_cafe_fr", followers: "89K" },
  { name: "cafe_joyeux", followers: "62.3K" },
  { name: "starbucks_fr", followers: "245K" },
  { name: "coutume_cafe", followers: "22.1K" },
  { name: "belleville_brulerie", followers: "18.9K" },
];

export function StepCompetitors({ competitors, onAdd, onRemove, onSkip }: StepCompetitorsProps) {
  const [input, setInput] = useState("");
  const [sampleIndex, setSampleIndex] = useState(0);

  const handleAdd = () => {
    if (competitors.length >= 10) return;
    const sample = SAMPLE_COMPETITORS[sampleIndex % SAMPLE_COMPETITORS.length];
    onAdd(sample);
    setSampleIndex((prev) => prev + 1);
    setInput("");
  };

  return (
    <div>
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-beige rounded-2xl mb-5">
          <Icon icon="solar:users-group-rounded-linear" width={28} className="text-ink" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-[.95]">
          Ajoutez les cafés que vous<br />
          <span className="font-serif italic font-medium text-gold">admirez</span>
        </h2>
        <p className="text-muted-rb mt-3 text-sm max-w-sm mx-auto">
          Nous analyserons leurs meilleurs Reels pour trouver des tendances que vous pouvez utiliser.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
        <div className="flex gap-2">
          <div className="flex items-center bg-white/70 border border-stone-custom rounded-xl px-3.5 text-faded text-sm font-medium select-none">
            @
          </div>
          <input
            type="text"
            placeholder="nom_du_concurrent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 bg-white/70 border border-stone-custom rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-faded outline-none input-focus transition-all duration-300 min-w-0"
          />
          <button
            onClick={handleAdd}
            disabled={competitors.length >= 10}
            className="bg-ink text-white px-5 py-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-350 hover:translate-y-[-1px] hover:shadow-[0_12px_40px_rgba(0,0,0,.15)] active:translate-y-0 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed"
          >
            Chercher
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {competitors.length === 0 ? (
            <p className="text-xs text-muted-rb text-center py-5">
              Ajoutez au moins 1 concurrent pour de meilleurs résultats. Jusqu&apos;à 10 au total.
            </p>
          ) : (
            <AnimatePresence>
              {competitors.map((comp, i) => (
                <CompetitorRow
                  key={`${comp.name}-${i}`}
                  name={comp.name}
                  followers={comp.followers}
                  onRemove={() => onRemove(i)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-custom/50">
          <span className="text-[11px] font-bold text-faded uppercase tracking-wider">
            {competitors.length} / 10
          </span>
          <button
            onClick={onSkip}
            className="text-xs text-muted-rb flex items-center gap-1.5 transition-colors hover:text-ink"
          >
            Passer <Icon icon="solar:arrow-right-linear" width={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
