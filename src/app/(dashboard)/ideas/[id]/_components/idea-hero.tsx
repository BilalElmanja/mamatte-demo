"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";

type IdeaHeroProps = {
  onRemix: () => void;
  onToast: (msg: string) => void;
};

export function IdeaHero({ onRemix, onToast }: IdeaHeroProps) {
  const [saved, setSaved] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const toggleSave = () => {
    setSaved(!saved);
    onToast(saved ? "Retiree" : "Sauvegardee");
  };

  const toggleLike = () => {
    setLiked(!liked);
    setDisliked(false);
    onToast(liked ? "Annule" : "Marquee utile");
  };

  const toggleDislike = () => {
    setDisliked(!disliked);
    setLiked(false);
    onToast(disliked ? "Annule" : "Feedback enregistre");
  };

  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.06 }}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-6 md:p-8 mb-5"
    >
      <h1 className="text-xl md:text-2xl font-bold text-ink leading-tight mb-4">
        &laquo; Tu as 3 secondes avant que ce latte art disparaisse &raquo;
      </h1>

      <p className="text-[14px] text-inksoft leading-relaxed mb-4">
        Filmez le barista versant le latte art en plong&eacute;e. Gros plan.
        Laissez le dessin se former en temps r&eacute;el, sans musique. La
        tension monte naturellement. R&eacute;v&eacute;lez le r&eacute;sultat
        final avec un zoom arri&egrave;re dramatique.
      </p>

      <div className="bg-beige/40 rounded-xl p-4 mb-5">
        <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1.5">
          Pourquoi &ccedil;a marche
        </p>
        <p className="text-[13px] text-muted-rb italic leading-relaxed">
          L&apos;ASMR visuel + vue a&eacute;rienne sont en tendance. Format
          prouv&eacute; avec 2,8x plus de vues. Le silence accroche le
          spectateur et maximise la compl&eacute;tion. Facile &agrave; filmer
          avec un smartphone.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-[10px] font-bold text-muted-rb bg-beige px-2.5 py-1 rounded-md">
          {"\uD83D\uDD0A"} ASMR
        </span>
        <span className="text-[10px] font-bold text-muted-rb bg-beige px-2.5 py-1 rounded-md">
          {"\uD83C\uDFA8"} Plating
        </span>
        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
          {"\uD83D\uDFE2"} Facile
        </span>
        <span className="text-[10px] text-faded bg-beige/50 px-2.5 py-1 rounded-md">
          G&eacute;n&eacute;r&eacute; le 17 F&eacute;v. 2026
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-custom/30">
        <button
          onClick={toggleSave}
          className={`action-btn border rounded-lg px-4 py-2 text-[11px] font-bold flex items-center gap-1.5 ${
            saved
              ? "saved bg-gold text-white border-gold"
              : "text-muted-rb border-stone-custom"
          }`}
        >
          <Icon
            icon={saved ? "solar:star-bold" : "solar:star-linear"}
            width={14}
          />
          {saved ? "Sauvee" : "Sauver"}
        </button>
        <button
          onClick={toggleLike}
          className={`action-btn border rounded-lg px-3 py-2 text-[11px] font-semibold flex items-center gap-1.5 ${
            liked
              ? "liked bg-ink text-white border-ink"
              : "text-muted-rb border-stone-custom"
          }`}
        >
          <Icon icon="solar:like-linear" width={14} />
          Utile
        </button>
        <button
          onClick={toggleDislike}
          className={`action-btn border rounded-lg px-3 py-2 text-[11px] font-semibold flex items-center gap-1.5 ${
            disliked
              ? "liked bg-ink text-white border-ink"
              : "text-muted-rb border-stone-custom"
          }`}
        >
          <Icon icon="solar:dislike-linear" width={14} />
        </button>
        <button
          onClick={onRemix}
          className="remix-btn border border-gold/60 rounded-lg px-4 py-2 text-[11px] font-bold text-gold flex items-center gap-1.5 ml-auto"
        >
          <Icon icon="solar:magic-stick-3-linear" width={14} />
          Remixer cette id&eacute;e
        </button>
      </div>
    </motion.div>
  );
}
