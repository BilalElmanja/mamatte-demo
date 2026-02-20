"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur, resultIn } from "@/lib/motion";

type GenType = "variant" | "hooks" | "script" | "caption";

type GeneratePanelProps = {
  onToast: (msg: string) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
};

const TYPE_OPTIONS: { type: GenType; icon: string; label: string }[] = [
  { type: "variant", icon: "solar:refresh-linear", label: "Variante" },
  { type: "hooks", icon: "solar:text-bold-linear", label: "Hooks" },
  { type: "script", icon: "solar:document-text-linear", label: "Script alt." },
  {
    type: "caption",
    icon: "solar:chat-round-dots-linear",
    label: "Caption",
  },
];

const DIRECTIONS = [
  { label: "M\u00eame angle, nouveau hook", emoji: "\uD83D\uDD04" },
  { label: "Version humour", emoji: "\uD83C\uDFAD" },
  { label: "Plus de storytelling", emoji: "\uD83D\uDCD6" },
  { label: "Plus commercial", emoji: "\uD83C\uDFAF" },
  { label: "ASMR pur", emoji: "\uD83D\uDD0A" },
];

export function GeneratePanel({ onToast, panelRef }: GeneratePanelProps) {
  const [genType, setGenType] = useState<GenType>("variant");
  const [direction, setDirection] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setLoading(true);
    setShowResult(false);
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }, 2300);
  };

  return (
    <motion.div
      ref={panelRef}
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.18 }}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-6 md:p-8 mb-5"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 bg-gold/15 rounded-xl flex items-center justify-center">
          <Icon
            icon="solar:magic-stick-3-bold"
            width={18}
            className="text-golddark"
          />
        </div>
        <div>
          <h2 className="text-base font-bold text-ink">
            G&eacute;n&eacute;rer du contenu
          </h2>
          <p className="text-[10px] text-muted-rb">
            Cr&eacute;ez des variantes, nouveaux hooks ou un script alternatif
          </p>
        </div>
      </div>

      {/* Type selector */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
          Type de contenu
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setGenType(opt.type)}
              className={`option-chip border border-stone-custom rounded-xl p-3 text-center ${
                genType === opt.type
                  ? "bg-ink text-white border-ink"
                  : "text-muted-rb"
              }`}
            >
              <Icon
                icon={opt.icon}
                width={18}
                className="mb-1 block mx-auto"
              />
              <span className="text-[11px] font-bold block">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Direction */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
          Direction
        </p>
        <div className="flex flex-wrap gap-2">
          {DIRECTIONS.map((d, i) => (
            <button
              key={i}
              onClick={() => setDirection(i)}
              className={`option-chip border border-stone-custom rounded-lg px-3 py-2 text-[11px] font-semibold ${
                direction === i
                  ? "bg-ink text-white border-ink"
                  : "text-muted-rb"
              }`}
            >
              {d.emoji} {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2">
          Notes{" "}
          <span className="font-normal text-faded">(optionnel)</span>
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Mentionner notre offre du moment, cibler les etudiants..."
          className="w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-3 text-sm text-ink placeholder:text-faded outline-none focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,26,26,.06)] transition-all resize-none h-16"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        className="btn-primary w-full bg-ink text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-ink/10"
      >
        <Icon
          icon="solar:stars-minimalistic-bold"
          width={18}
          className="sparkle"
        />
        G&eacute;n&eacute;rer
      </button>

      {/* Loading */}
      {loading && (
        <div className="mt-5">
          <div className="flex items-center gap-3 mb-4">
            <Icon
              icon="solar:refresh-linear"
              width={16}
              className="text-gold animate-spin"
            />
            <span className="text-sm font-medium text-muted-rb">
              L&apos;IA g&eacute;n&egrave;re votre contenu...
            </span>
          </div>
          <div className="space-y-2">
            <div className="shimmer-block h-4 w-3/4" />
            <div className="shimmer-block h-4 w-full" />
            <div className="shimmer-block h-4 w-5/6" />
            <div className="shimmer-block h-4 w-2/3" />
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            ref={resultRef}
            variants={resultIn}
            initial="hidden"
            animate="visible"
            className="mt-5"
          >
            <div className="border-2 border-gold/30 rounded-2xl p-5 bg-gradient-to-br from-gold/5 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <Icon
                  icon="solar:stars-minimalistic-bold"
                  width={14}
                  className="text-gold"
                />
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                  R&eacute;sultat g&eacute;n&eacute;r&eacute;
                </span>
              </div>

              {/* Variant */}
              {genType === "variant" && (
                <div>
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                      Nouveau hook
                    </p>
                    <p className="text-[15px] font-semibold text-ink leading-snug">
                      &laquo; Et si on filmait l&apos;impossible : un latte art
                      qui dure plus de 3 secondes ? &raquo;
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                      Concept
                    </p>
                    <p className="text-[13px] text-inksoft leading-relaxed">
                      Challenge : votre barista essaie de garder le latte art
                      intact le plus longtemps possible. Filmez la tension, les
                      clients qui attendent, le moment o&ugrave; quelqu&apos;un
                      boit enfin.
                    </p>
                  </div>
                </div>
              )}

              {/* Hooks */}
              {genType === "hooks" && (
                <div>
                  <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                    5 hooks alternatifs
                  </p>
                  <p className="text-[14px] font-semibold text-ink py-2">
                    1. &laquo; Combien de temps peut survivre un latte art ? On
                    a chronom&eacute;tr&eacute; &raquo;
                  </p>
                  <p className="text-[14px] font-semibold text-ink py-2 border-t border-stone-custom/20">
                    2. &laquo; POV : tu es barista et tu rates ton latte art
                    devant 50 clients &raquo;
                  </p>
                  <p className="text-[14px] font-semibold text-ink py-2 border-t border-stone-custom/20">
                    3. &laquo; ASMR : le son parfait du latte art vers&eacute;
                    au ralenti &raquo;
                  </p>
                  <p className="text-[14px] font-semibold text-ink py-2 border-t border-stone-custom/20">
                    4. &laquo; On a demand&eacute; &agrave; nos clients de
                    dessiner leur propre latte art &raquo;
                  </p>
                  <p className="text-[14px] font-semibold text-ink py-2 border-t border-stone-custom/20">
                    5. &laquo; Le latte art le plus complexe qu&apos;on ait
                    jamais tent&eacute; chez Mamatte &raquo;
                  </p>
                </div>
              )}

              {/* Script */}
              {genType === "script" && (
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                      Accroche
                    </p>
                    <p className="text-[13px] text-ink">
                      &laquo; Tu vas voir le latte art le plus satisfaisant de
                      ta vie. Et il a &eacute;t&eacute; fait chez Mamatte.
                      &raquo;
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                      Contexte
                    </p>
                    <p className="text-[13px] text-ink">
                      Chaque matin, notre barista transforme du lait en oeuvre
                      d&apos;art &eacute;ph&eacute;m&egrave;re. Mais
                      aujourd&apos;hui, il tente un motif jamais vu.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                      Valeur
                    </p>
                    <p className="text-[13px] text-ink">
                      Regardez la pr&eacute;cision du geste. Le versement,
                      l&apos;angle du poignet. C&apos;est 3 ans
                      d&apos;entra&icirc;nement en 30 secondes.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                      CTA
                    </p>
                    <p className="text-[13px] text-ink">
                      Viens voir &ccedil;a en vrai au Mamatte Longueau ! Dis-moi
                      en commentaire quel motif tu veux !
                    </p>
                  </div>
                </div>
              )}

              {/* Caption */}
              {genType === "caption" && (
                <div>
                  <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                    5 captions
                  </p>
                  <p className="text-[13px] text-ink py-2">
                    1. L&apos;art du caf&eacute;, version Mamatte {"\u2615\u2728"}{" "}
                    45 secondes de magie pure #latteart
                  </p>
                  <p className="text-[13px] text-ink py-2 border-t border-stone-custom/20">
                    2. On ne sert pas du caf&eacute;. On sert des oeuvres
                    d&apos;art &eacute;ph&eacute;m&egrave;res {"\uD83C\uDFA8"}{" "}
                    #mamatte #barista
                  </p>
                  <p className="text-[13px] text-ink py-2 border-t border-stone-custom/20">
                    3. ASMR : le bruit du lait qui dessine dans la tasse{" "}
                    {"\uD83E\uDD5B\uD83D\uDC9B"} #asmrcafe #coffeelover
                  </p>
                  <p className="text-[13px] text-ink py-2 border-t border-stone-custom/20">
                    4. 3 secondes de beaut&eacute; pure. Pas de filtre. Pas de
                    triche. Just{"\u2615"} #mamatte
                  </p>
                  <p className="text-[13px] text-ink py-2 border-t border-stone-custom/20">
                    5. Tu as d&eacute;j&agrave; vu un latte art aussi propre ?
                    Moi non plus, avant de bosser ici {"\uD83D\uDE02\u2615"}
                  </p>
                </div>
              )}

              {/* Result actions */}
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gold/20">
                <button
                  onClick={() =>
                    onToast("Sauvegard\u00e9 comme nouvelle id\u00e9e")
                  }
                  className="btn-primary bg-ink text-white px-4 py-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
                >
                  <Icon icon="solar:bookmark-linear" width={13} />
                  Sauver
                </button>
                <button
                  onClick={handleGenerate}
                  className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
                >
                  <Icon icon="solar:refresh-linear" width={13} />
                  R&eacute;g&eacute;n&eacute;rer
                </button>
                <button
                  onClick={() => onToast("Copi\u00e9")}
                  className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5 ml-auto"
                >
                  <Icon icon="solar:copy-linear" width={13} />
                  Copier
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
