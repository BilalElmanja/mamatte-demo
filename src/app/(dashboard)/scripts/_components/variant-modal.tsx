"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { overlayVariants, modalIn } from "@/lib/motion";
import type { Script } from "./script-card";

type VarType = "alt-script" | "new-hooks" | "captions";
type Direction =
  | "same-tone"
  | "humor"
  | "shorter"
  | "narrative"
  | "commercial";

const DIRECTIONS: { key: Direction; label: string }[] = [
  { key: "same-tone", label: "\ud83d\udd04 M\u00eame angle, ton diff\u00e9rent" },
  { key: "humor", label: "\ud83c\udfad Version humour" },
  { key: "shorter", label: "\u2702\ufe0f Plus court (15 sec)" },
  { key: "narrative", label: "\ud83d\udcd6 Plus narratif" },
  { key: "commercial", label: "\ud83c\udfaf Plus commercial" },
];

type VariantModalProps = {
  open: boolean;
  onClose: () => void;
  script: Script | null;
  onToast: (msg: string) => void;
};

export function VariantModal({
  open,
  onClose,
  script,
  onToast,
}: VariantModalProps) {
  const [varType, setVarType] = useState<VarType>("alt-script");
  const [direction, setDirection] = useState<Direction>("same-tone");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  if (!script) return null;

  function handleGenerate() {
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
  }

  function handleClose() {
    setLoading(false);
    setShowResult(false);
    setVarType("alt-script");
    setDirection("same-tone");
    setNotes("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={modalIn}
            className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
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
                    G\u00e9n\u00e9rer une variante
                  </p>
                  <p className="text-[10px] text-muted-rb">
                    Cr\u00e9ez un script alternatif bas\u00e9 sur l&apos;original
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
              {/* Source */}
              <div className="bg-beige/40 rounded-xl p-4 mb-5">
                <p className="text-[10px] font-bold text-faded uppercase tracking-wider mb-1">
                  Script source
                </p>
                <p className="text-[13px] font-semibold text-ink leading-snug line-clamp-2">
                  {script.hook}
                </p>
              </div>

              {/* Type selector */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
                  Type
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        key: "alt-script" as VarType,
                        icon: "solar:document-text-linear",
                        label: "Script alt.",
                      },
                      {
                        key: "new-hooks" as VarType,
                        icon: "solar:text-bold-linear",
                        label: "Nouveaux hooks",
                      },
                      {
                        key: "captions" as VarType,
                        icon: "solar:chat-round-dots-linear",
                        label: "Captions",
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setVarType(item.key)}
                      className={`option-chip border border-stone-custom rounded-xl p-3 text-center ${varType === item.key ? "selected" : "text-muted-rb"}`}
                    >
                      <Icon
                        icon={item.icon}
                        width={18}
                        className="mb-1 block mx-auto"
                      />
                      <span className="text-[11px] font-bold block">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direction chips */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
                  Direction
                </p>
                <div className="flex flex-wrap gap-2">
                  {DIRECTIONS.map((d) => (
                    <button
                      key={d.key}
                      onClick={() => setDirection(d.key)}
                      className={`option-chip border border-stone-custom rounded-lg px-3 py-2 text-[11px] font-semibold ${direction === d.key ? "selected" : "text-muted-rb"}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2">
                  Instructions{" "}
                  <span className="font-normal text-faded">(optionnel)</span>
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Cibler un public jeune, mettre en avant le c\u00f4t\u00e9 \u00e9colo..."
                  className="w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-3 text-sm text-ink placeholder:text-faded outline-none focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,26,26,0.06)] transition-all resize-none h-16"
                />
              </div>

              {/* Generate */}
              {!loading && (
                <button
                  onClick={handleGenerate}
                  className="btn-primary w-full bg-ink text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-ink/10"
                >
                  <Icon
                    icon="solar:stars-minimalistic-bold"
                    width={18}
                    className="sparkle"
                  />
                  G\u00e9n\u00e9rer la variante
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
                      G\u00e9n\u00e9ration en cours...
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
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                          Variante g\u00e9n\u00e9r\u00e9e
                        </span>
                      </div>

                      {/* Alt script result */}
                      {varType === "alt-script" && (
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Accroche
                            </p>
                            <p className="text-[13px] text-ink leading-relaxed">
                              &laquo; Stop. Regarde bien cette tasse. Dans 3 secondes, tout aura disparu. &raquo;
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Contexte
                            </p>
                            <p className="text-[13px] text-ink leading-relaxed">
                              On vit dans un monde de rush. Tout va trop vite. Sauf ici. Sauf chez Mamatte. Chaque matin, notre barista prend 45 secondes pour cr\u00e9er quelque chose de beau.
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Valeur
                            </p>
                            <p className="text-[13px] text-ink leading-relaxed">
                              Ce n&apos;est pas juste du caf\u00e9. C&apos;est de l&apos;attention. Du soin. De la pr\u00e9cision. Et \u00e7a, \u00e7a ne se scrolle pas &mdash; \u00e7a se vit.
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              CTA
                            </p>
                            <p className="text-[13px] text-ink leading-relaxed">
                              Viens prendre le temps d&apos;un vrai caf\u00e9 chez Mamatte \u2615 Lien en bio.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Hooks result */}
                      {varType === "new-hooks" && (
                        <div>
                          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                            5 hooks alternatifs
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-2">
                            1. &laquo; Stop. Regarde cette tasse. Dans 3 secondes, tout dispara\u00eet. &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-2 border-t border-stone-custom/20">
                            2. &laquo; Notre barista cr\u00e9e un chef-d&apos;\u0153uvre \u00e9ph\u00e9m\u00e8re tous les matins &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-2 border-t border-stone-custom/20">
                            3. &laquo; 45 secondes de concentration. 3 secondes de beaut\u00e9. Et puis\u2026 pouf. &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-2 border-t border-stone-custom/20">
                            4. &laquo; Ce latte art va dispara\u00eetre avant la fin de ce Reel &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-2 border-t border-stone-custom/20">
                            5. &laquo; ASMR : le son du latte art en train d&apos;\u00eatre cr\u00e9\u00e9 \ud83c\udfa7 &raquo;
                          </p>
                        </div>
                      )}

                      {/* Captions result */}
                      {varType === "captions" && (
                        <div>
                          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                            5 captions
                          </p>
                          <p className="text-[13px] text-ink py-2">
                            1. L&apos;art \u00e9ph\u00e9m\u00e8re du caf\u00e9 \u2615 Chaque tasse est unique, comme chaque matin chez Mamatte \u2728
                          </p>
                          <p className="text-[13px] text-ink py-2 border-t border-stone-custom/20">
                            2. 45 secondes pour cr\u00e9er, 3 secondes pour dispara\u00eetre. C&apos;est \u00e7a, la magie du latte art \ud83d\udcab
                          </p>
                          <p className="text-[13px] text-ink py-2 border-t border-stone-custom/20">
                            3. POV : tu es le premier client du matin et tu re\u00e7ois ce chef-d&apos;\u0153uvre dans ta tasse \ud83e\udd79
                          </p>
                          <p className="text-[13px] text-ink py-2 border-t border-stone-custom/20">
                            4. On ne vend pas du caf\u00e9. On vend 45 secondes de beaut\u00e9 pure \ud83e\udef6 #mamatte
                          </p>
                          <p className="text-[13px] text-ink py-2 border-t border-stone-custom/20">
                            5. Sound ON \ud83d\udd0a Le bruit du lait qui dessine &gt;&gt;&gt; #asmrcafe #latteart
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gold/20">
                        <button
                          onClick={() => {
                            onToast(
                              "Sauvegard\u00e9 comme nouveau script \ud83d\udcdd"
                            );
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
                          R\u00e9g\u00e9n\u00e9rer
                        </button>
                        <button
                          onClick={() => onToast("Copi\u00e9 \ud83d\udccb")}
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
