"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cardPop } from "@/lib/motion";

export type Idea = {
  id: number;
  hook: string;
  concept: string;
  why: string;
  cats: string[];
  diff: "easy" | "medium" | "hard";
  saved: boolean;
  emoji: string;
  platforms: string[];
};

const DIFF_MAP: Record<string, string> = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

const DIFF_DOT: Record<string, string> = {
  easy: "\uD83D\uDFE2",
  medium: "\uD83D\uDFE1",
  hard: "\uD83D\uDD34",
};

const DIFF_COLOR: Record<string, string> = {
  easy: "text-green-600",
  medium: "text-amber-600",
  hard: "text-red-600",
};

type IdeaCardProps = {
  idea: Idea;
  onToggleSave: (id: number) => void;
  onRemix: (id: number) => void;
};

export function IdeaCard({ idea, onToggleSave, onRemix }: IdeaCardProps) {
  return (
    <motion.div
      variants={cardPop}
      className="idea-card bg-white rounded-2xl border border-stone-custom/40 p-5 flex flex-col"
    >
      {/* Hook */}
      <Link href={`/ideas/${idea.id}`}>
        <p className="text-[15px] font-semibold text-ink leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-gold transition-colors">
          {idea.hook}
        </p>
      </Link>

      {/* Concept */}
      <p className="text-[13px] text-muted-rb leading-relaxed mb-3 line-clamp-3">
        {idea.concept}
      </p>

      {/* Why */}
      <p className="text-[12px] text-faded italic leading-relaxed mb-4 line-clamp-2">
        <span className="font-semibold not-italic text-muted-rb">
          Pourquoi :
        </span>{" "}
        {idea.why}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {idea.cats.map((cat) => (
          <span
            key={cat}
            className="text-[10px] font-bold text-muted-rb bg-beige px-2 py-1 rounded-md"
          >
            {cat}
          </span>
        ))}
        <span
          className={`text-[10px] font-bold ${DIFF_COLOR[idea.diff]} bg-beige px-2 py-1 rounded-md`}
        >
          {DIFF_DOT[idea.diff]} {DIFF_MAP[idea.diff]}
        </span>
      </div>

      {/* Action bar */}
      <div
        className="mt-auto pt-3 border-t border-stone-custom/30 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onToggleSave(idea.id)}
          className={`action-btn border rounded-lg px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 ${
            idea.saved
              ? "saved bg-gold text-white border-gold"
              : "text-muted-rb border-stone-custom"
          }`}
        >
          <Icon
            icon={idea.saved ? "solar:star-bold" : "solar:star-linear"}
            width={13}
          />
          {idea.saved ? "Sauvee" : "Sauver"}
        </button>
        <button
          onClick={() => onRemix(idea.id)}
          className="remix-btn border border-gold/60 rounded-lg px-3 py-1.5 text-[11px] font-bold text-gold flex items-center gap-1.5"
        >
          <Icon icon="solar:magic-stick-3-linear" width={13} />
          Remixer
        </button>
        <Link
          href={`/ideas/${idea.id}`}
          className="action-btn border border-stone-custom rounded-lg px-3 py-1.5 text-[11px] font-semibold text-muted-rb flex items-center gap-1.5 ml-auto"
        >
          <Icon icon="solar:document-text-linear" width={13} />
          Script
        </Link>
      </div>
    </motion.div>
  );
}
