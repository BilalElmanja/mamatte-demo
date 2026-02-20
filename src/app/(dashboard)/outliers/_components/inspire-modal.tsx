"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { overlayVariants, modalIn } from "@/lib/motion";
import type { Outlier } from "./outlier-row";

type GenType = "idea" | "hook" | "script";
type PlatformTarget = "ig" | "tk" | "both";
type Angle =
  | "same"
  | "humor"
  | "storytelling"
  | "asmr"
  | "stitch";
type Tone = "warm" | "motivating" | "fun" | "educational";

const ANGLES: { key: Angle; label: string }[] = [
  { key: "same", label: "\ud83d\udd04 M\u00eame concept, mon style" },
  { key: "humor", label: "\ud83c\udfad Twist humoristique" },
  { key: "storytelling", label: "\ud83d\udcd6 Version storytelling" },
  { key: "asmr", label: "\ud83d\udd0a Version ASMR" },
  { key: "stitch", label: "\ud83e\udea1 Stitch / Duet" },
];

const TONES: { key: Tone; label: string }[] = [
  { key: "warm", label: "\u2615 Chaleureux" },
  { key: "motivating", label: "\ud83d\udcaa Motivant" },
  { key: "fun", label: "\ud83d\ude02 Fun" },
  { key: "educational", label: "\ud83c\udf93 \u00c9ducatif" },
];

type InspireModalProps = {
  open: boolean;
  onClose: () => void;
  outlier: Outlier | null;
  onToast: (msg: string) => void;
};

export function InspireModal({
  open,
  onClose,
  outlier,
  onToast,
}: InspireModalProps) {
  const [genType, setGenType] = useState<GenType>("idea");
  const [platformTarget, setPlatformTarget] = useState<PlatformTarget>("ig");
  const [angle, setAngle] = useState<Angle>("same");
  const [tone, setTone] = useState<Tone>("warm");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  if (!outlier) return null;

  const isTK = outlier.platform === "tk";

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
    }, 2400);
  }

  function handleClose() {
    setLoading(false);
    setShowResult(false);
    setGenType("idea");
    setPlatformTarget("ig");
    setAngle("same");
    setTone("warm");
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
                    {isTK
                      ? "S\u2019inspirer de ce TikTok"
                      : "S\u2019inspirer de ce Reel"}
                  </p>
                  <p className="text-[10px] text-muted-rb">
                    Cr\u00e9ez votre propre version pour Mamatte
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
              {/* Source reference */}
              <div className="bg-beige/40 rounded-xl p-4 mb-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-beige to-stone-custom flex items-center justify-center shrink-0">
                  <span className="text-lg">{outlier.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon
                      icon={
                        isTK
                          ? "simple-icons:tiktok"
                          : "simple-icons:instagram"
                      }
                      width={10}
                      className={isTK ? "text-tiktok" : "text-[#E1306C]"}
                    />
                    <p className="text-[10px] font-bold text-faded uppercase tracking-wider">
                      {isTK ? "TikTok source" : "Reel source"}
                    </p>
                  </div>
                  <p className="text-[13px] font-semibold text-ink leading-snug line-clamp-2">
                    {outlier.hook}
                  </p>
                  <p className="text-[11px] text-muted-rb mt-1">
                    @{outlier.account} &middot; {outlier.views} vues
                  </p>
                </div>
              </div>

              {/* Gen type */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
                  Que voulez-vous g\u00e9n\u00e9rer ?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        key: "idea" as GenType,
                        icon: "solar:lightbulb-linear",
                        label: "Nouvelle id\u00e9e",
                      },
                      {
                        key: "hook" as GenType,
                        icon: "solar:text-bold-linear",
                        label: "Hooks",
                      },
                      {
                        key: "script" as GenType,
                        icon: "solar:document-text-linear",
                        label: "Script complet",
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setGenType(item.key)}
                      className={`option-chip border border-stone-custom rounded-xl p-3 text-center ${genType === item.key ? "selected" : "text-muted-rb"}`}
                    >
                      <Icon
                        icon={item.icon}
                        width={20}
                        className="mb-1 block mx-auto"
                      />
                      <span className="text-[11px] font-bold block">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform target */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
                  Plateforme cible
                </p>
                <div className="flex gap-2">
                  {(
                    [
                      {
                        key: "ig" as PlatformTarget,
                        icon: "simple-icons:instagram",
                        iconWidth: 12,
                        label: "Instagram Reels",
                      },
                      {
                        key: "tk" as PlatformTarget,
                        icon: "simple-icons:tiktok",
                        iconWidth: 11,
                        label: "TikTok",
                      },
                      {
                        key: "both" as PlatformTarget,
                        icon: "",
                        iconWidth: 0,
                        label: "\ud83d\udcf1 Les deux",
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setPlatformTarget(item.key)}
                      className={`option-chip border border-stone-custom rounded-lg px-4 py-2 text-[11px] font-semibold flex items-center gap-1.5 ${platformTarget === item.key ? "selected" : "text-muted-rb"}`}
                    >
                      {item.icon && (
                        <Icon icon={item.icon} width={item.iconWidth} />
                      )}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Angle */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
                  Angle cr\u00e9atif
                </p>
                <div className="flex flex-wrap gap-2">
                  {ANGLES.map((a) => (
                    <button
                      key={a.key}
                      onClick={() => setAngle(a.key)}
                      className={`option-chip border border-stone-custom rounded-lg px-3 py-2 text-[11px] font-semibold ${angle === a.key ? "selected" : "text-muted-rb"}`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-faded uppercase tracking-wider mb-2.5">
                  Ton
                </p>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTone(t.key)}
                      className={`option-chip border border-stone-custom rounded-lg px-3 py-2 text-[11px] font-semibold ${tone === t.key ? "selected" : "text-muted-rb"}`}
                    >
                      {t.label}
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
                  placeholder="Ex: Mettre en avant notre brunch du dimanche..."
                  className="w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-3 text-sm text-ink placeholder:text-faded outline-none focus:border-ink focus:shadow-[0_0_0_3px_rgba(26,26,26,0.06)] transition-all resize-none h-16"
                />
              </div>

              {/* Generate button */}
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
                  G\u00e9n\u00e9rer mon contenu
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
                      L&apos;IA cr\u00e9e votre contenu...
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
                          Contenu g\u00e9n\u00e9r\u00e9
                        </span>
                      </div>

                      {/* Idea result */}
                      {genType === "idea" && (
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Hook
                            </p>
                            <p className="text-[15px] font-semibold text-ink leading-snug">
                              &laquo; Notre barista r\u00e9v\u00e8le sa technique secr\u00e8te de latte art en 45 secondes &raquo;
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Concept
                            </p>
                            <p className="text-[13px] text-inksoft leading-relaxed">
                              Filmez en plong\u00e9e pendant que votre barista r\u00e9alise un motif complexe. Pas de musique, juste le son naturel. R\u00e9v\u00e9lez le r\u00e9sultat avec un zoom arri\u00e8re.
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Pourquoi \u00e7a marchera
                            </p>
                            <p className="text-[12px] text-muted-rb italic leading-relaxed">
                              Le format prouve votre savoir-faire. Le &laquo; pas de musique &raquo; maximise la compl\u00e9tion (+3,1x). Fonctionne aussi bien sur IG que TikTok.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Hooks result */}
                      {genType === "hook" && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                            5 variations de hooks
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5">
                            1. &laquo; Notre barista cache un secret dans chaque tasse \u2615 &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5 border-t border-stone-custom/20">
                            2. &laquo; 45 secondes. C&apos;est le temps pour cr\u00e9er un chef-d&apos;\u0153uvre &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5 border-t border-stone-custom/20">
                            3. &laquo; POV : tu es barista et c&apos;est le rush du matin &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5 border-t border-stone-custom/20">
                            4. &laquo; Ce son ASMR de latte art &gt;&gt; \ud83c\udfa7 &raquo;
                          </p>
                          <p className="text-[14px] font-semibold text-ink py-1.5 border-t border-stone-custom/20">
                            5. &laquo; Technique que 99% des caf\u00e9s ne ma\u00eetrisent pas &raquo;
                          </p>
                        </div>
                      )}

                      {/* Script result */}
                      {genType === "script" && (
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Accroche
                            </p>
                            <p className="text-[13px] text-ink">
                              &laquo; Personne ne vous montre cette technique. Chez Mamatte, on change \u00e7a aujourd&apos;hui. &raquo;
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Contexte
                            </p>
                            <p className="text-[13px] text-ink">
                              Chaque matin, notre barista passe 45 secondes sur chaque tasse. Ce que vous voyez en 15 secondes, c&apos;est des heures de pratique.
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              CTA
                            </p>
                            <p className="text-[13px] text-ink">
                              Venez le voir en vrai chez Mamatte. Enregistrez cette vid\u00e9o pour votre prochain caf\u00e9 \u2615
                            </p>
                          </div>
                          <div className="pt-2 border-t border-gold/20">
                            <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">
                              Caption + Hashtags
                            </p>
                            <p className="text-[12px] text-muted-rb">
                              L&apos;art du latte, 45 secondes de pure pr\u00e9cision \u2615\u2728 #mamatte #latteart #barista #coffeeshop #asmrcafe #CoffeeTok #fyp
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gold/20">
                        <button
                          onClick={() => {
                            onToast("Id\u00e9e sauvegard\u00e9e \u2b50");
                            handleClose();
                          }}
                          className="btn-primary bg-ink text-white px-4 py-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
                        >
                          <Icon icon="solar:bookmark-linear" width={13} />
                          Sauver
                        </button>
                        {genType !== "script" && (
                          <button
                            onClick={() =>
                              onToast("Script g\u00e9n\u00e9r\u00e9 \ud83d\udcdd")
                            }
                            className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
                          >
                            <Icon
                              icon="solar:document-add-linear"
                              width={13}
                            />
                            Script
                          </button>
                        )}
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
