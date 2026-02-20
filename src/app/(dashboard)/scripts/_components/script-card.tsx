"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cardPop } from "@/lib/motion";

export type Script = {
  id: number;
  hook: string;
  cat: string;
  catLabel: string;
  diff: "easy" | "medium";
  words: number;
  duration: string;
  date: string;
  status: "edited" | "original";
};

type ScriptCardProps = {
  script: Script;
  index: number;
  onVariant: (id: number) => void;
  onToast: (msg: string) => void;
};

export function ScriptCard({
  script,
  index,
  onVariant,
  onToast,
}: ScriptCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    onToast("Script copi\u00e9 \ud83d\udccb");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      variants={cardPop}
      custom={index}
      className="script-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6"
    >
      <div className="flex items-start gap-4">
        {/* Document icon */}
        <div className="w-10 h-10 bg-gold/12 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          <Icon
            icon="solar:document-text-linear"
            width={20}
            className="text-golddark"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Hook */}
          <p className="text-[14px] md:text-[15px] font-semibold text-ink leading-snug line-clamp-2 mb-2">
            {script.hook}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="text-[10px] font-bold text-muted-rb bg-beige px-2 py-0.5 rounded">
              {script.cat} {script.catLabel}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                script.diff === "easy"
                  ? "text-green-600 bg-green-50"
                  : "text-amber-600 bg-amber-50"
              }`}
            >
              {script.diff === "easy" ? "\ud83d\udfe2" : "\ud83d\udfe1"}{" "}
              {script.diff === "easy" ? "Facile" : "Moyen"}
            </span>
            <span className="text-[10px] font-bold text-muted-rb bg-beige px-2 py-0.5 rounded">
              {script.words} mots &middot; {script.duration}
            </span>
            {script.status === "edited" ? (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                \u270f\ufe0f Modifi\u00e9
              </span>
            ) : (
              <span className="text-[10px] font-bold text-faded bg-beige/60 px-2 py-0.5 rounded">
                Original
              </span>
            )}
          </div>

          {/* Date */}
          <p className="text-[11px] text-faded mb-3">
            G\u00e9n\u00e9r\u00e9 le {script.date}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/ideas/${script.id}`}
              className="btn-primary bg-ink text-white px-4 py-2 rounded-lg text-[11px] font-bold flex items-center gap-1.5"
            >
              Voir le script{" "}
              <Icon icon="solar:arrow-right-linear" width={12} />
            </Link>
            <button
              onClick={() => onVariant(script.id)}
              className="remix-btn border border-gold/60 rounded-lg px-3 py-2 text-[11px] font-bold text-gold flex items-center gap-1.5"
            >
              <Icon icon="solar:magic-stick-3-linear" width={13} />
              Variante
            </button>
            <button
              onClick={handleCopy}
              className={`copy-btn btn-outline border border-stone-custom rounded-lg px-3 py-2 text-[11px] font-semibold text-muted-rb flex items-center gap-1.5 ${copied ? "copied" : ""}`}
            >
              <Icon
                icon={
                  copied
                    ? "solar:check-read-linear"
                    : "solar:copy-linear"
                }
                width={13}
              />
              {copied ? "Copi\u00e9 !" : "Copier"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
