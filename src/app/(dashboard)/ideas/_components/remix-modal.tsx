"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { modalIn, overlayVariants, resultIn } from "@/lib/motion";

type RemixType = "variant" | "hooks" | "script";

type RemixModalProps = {
  open: boolean;
  sourceHook: string;
  onClose: () => void;
  onSave: (msg: string) => void;
};

const DIRECTIONS = [
  { label: "Meme angle, nouveau hook", emoji: "\uD83D\uDD04" },
  { label: "Version humoristique", emoji: "\uD83C\uDFAD" },
  { label: "Plus de storytelling", emoji: "\uD83D\uDCD6" },
  { label: "Plus vendeur", emoji: "\uD83C\uDFAF" },
  { label: "Version ASMR", emoji: "\uD83D\uDD0A" },
];

const TYPE_OPTIONS: { type: RemixType; icon: string; label: string }[] = [
  { type: "variant", icon: "solar:refresh-linear", label: "Variante" },
  { type: "hooks", icon: "solar:text-bold-linear", label: "Nouveaux hooks" },
  {
    type: "script",
    icon: "solar:document-text-linear",
    label: "Script complet",
  },
];

export function RemixModal({
  open,
  sourceHook,
  onClose,
  onSave,
}: RemixModalProps) {
  const [rxType, setRxType] = useState<RemixType>("variant");
  const [direction, setDirection] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setShowResult(false);
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 2200);
  };

  const handleClose = () => {
    setLoading(false);
    setShowResult(false);
    setNotes("");
    setRxType("variant");
    setDirection(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            variants={overlayVariants}
          />
          <motion.div
            className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            variants={modalIn}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-stone-custom/30 flex items-center justify-between z-10 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gold/15 rounded-xl flex items-center justify-center">
                  <Icon
                    icon="solar:magic-stick-3-bold"
                    width={18}
                    className="text-golddark"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">
                    Remixer cette idee
                  </p>
                  <p className="text-[10px] text-muted-rb">
                    Creez une variante ou un nouveau script
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-beige transition-colors text-muted-rb"
              >
                <Icon icon="solar:close-circle-linear" width={18} />
              </button>
            </div>

            <div className="px-6 py-5">
              {/* Source hook */}
              <div className="bg-beige/40 rounded-xl p-4 mb-5">
                <p className="text-[10px] font-bold text-faded uppercase tracking-wider mb-1">
                  Idee source
                </p>
                <p className="text-[13px] font-semibold text-ink leading-snug">
                  {sourceHook}
                </p>
              </div>

              {/* Type selection */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
                  Que voulez-vous ?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => setRxType(opt.type)}
                      className={`option-chip border border-stone-custom rounded-xl p-3 text-center ${
                        rxType === opt.type
                          ? "bg-ink text-white border-ink"
                          : "text-muted-rb"
                      }`}
                    >
                      <Icon
                        icon={opt.icon}
                        width={20}
                        className="mb-1 block mx-auto"
                      />
                      <span className="text-[11px] font-bold block">
                        {opt.label}
                      </span>
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
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
                  Notes{" "}
                  <span className="font-normal text-faded">(optionnel)</span>
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Integrer notre nouvelle carte d'ete..."
                  className="w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-3 text-sm text-ink placeholder:text-faded outline-none focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,26,26,.06)] transition-all resize-none h-16"
                />
              </div>

              {/* Generate button */}
              {!loading && !showResult && (
                <button
                  onClick={handleGenerate}
                  className="btn-primary w-full bg-ink text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-ink/10"
                >
                  <Icon
                    icon="solar:stars-minimalistic-bold"
                    width={18}
                    className="sparkle"
                  />
                  Generer
                </button>
              )}

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
                      Generation en cours...
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="shimmer-block h-4 w-3/4" />
                    <div className="shimmer-block h-4 w-full" />
                    <div className="shimmer-block h-4 w-5/6" />
                  </div>
                </div>
              )}

              {/* Result */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
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
                          Resultat
                        </span>
                      </div>

                      {/* Variant result */}
                      {rxType === "variant" && (
                        <div>
                          <div className="mb-3">
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Nouveau hook
                            </p>
                            <p className="text-[15px] font-semibold text-ink leading-snug">
                              &laquo; Et si on filmait l&apos;impossible : un
                              latte art qui dure plus de 3 secondes ? &raquo;
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Concept adapte
                            </p>
                            <p className="text-[13px] text-inksoft leading-relaxed">
                              Challenge : votre barista essaie de garder le
                              latte art intact le plus longtemps possible.
                              Filmez la tension, les clients qui attendent, le
                              moment ou quelqu&apos;un boit enfin. C&apos;est du
                              storytelling ASMR pur.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Hooks result */}
                      {rxType === "hooks" && (
                        <div>
                          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                            5 hooks alternatifs
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5">
                            1. &laquo; Combien de temps peut survivre un latte
                            art ? On a chronometre &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5 border-t border-stone-custom/20">
                            2. &laquo; Le latte art le plus complexe qu&apos;on
                            ait jamais tente chez Mamatte &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5 border-t border-stone-custom/20">
                            3. &laquo; POV : tu es barista et tu rates ton
                            latte art devant 50 clients &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5 border-t border-stone-custom/20">
                            4. &laquo; On a demande a nos clients de dessiner
                            leur propre latte art &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5 border-t border-stone-custom/20">
                            5. &laquo; ASMR : le son parfait du latte art
                            verse au ralenti &raquo;
                          </p>
                        </div>
                      )}

                      {/* Script result */}
                      {rxType === "script" && (
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Accroche
                            </p>
                            <p className="text-[13px] text-ink">
                              &laquo; Tu vas voir le latte art le plus
                              satisfaisant de ta vie. Et il a ete fait chez
                              Mamatte. &raquo;
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Contexte
                            </p>
                            <p className="text-[13px] text-ink">
                              Chaque matin, notre barista transforme du lait en
                              oeuvre d&apos;art ephemere. Mais aujourd&apos;hui,
                              il tente un motif jamais vu.
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Valeur
                            </p>
                            <p className="text-[13px] text-ink">
                              Regardez la precision du geste. Le versement,
                              l&apos;angle du poignet, la temperature parfaite.
                              C&apos;est 3 ans d&apos;entrainement en 30
                              secondes.
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              CTA
                            </p>
                            <p className="text-[13px] text-ink">
                              Viens voir ca en vrai au Mamatte Longueau et
                              dis-moi en commentaire quel motif tu veux pour la
                              prochaine fois !
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gold/20">
                        <button
                          onClick={() => {
                            onSave("Sauvegarde comme nouvelle idee");
                            handleClose();
                          }}
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
                          Regenerer
                        </button>
                        <button
                          onClick={() => onSave("Copie")}
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
