"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { overlayVariants, modalIn } from "@/lib/motion";
import { VIDEO_ANALYSES } from "@/app/(dashboard)/_data/mock-data";
import type { ScrapedVideo, VideoAnalysis } from "@/app/(dashboard)/_data/mock-data";
import { AnalysisSteps } from "./analysis-steps";
import { FrameExtraction } from "./frame-extraction";
import { AnalysisResult } from "./analysis-result";

type AnalysisModalProps = {
  open: boolean;
  onClose: () => void;
  video: ScrapedVideo | null;
  onToast: (msg: string) => void;
};

// Generic fallback analysis for unanalyzed videos
const GENERIC_ANALYSIS: VideoAnalysis = {
  videoId: 0,
  sceneDescription:
    "La vid\u00e9o pr\u00e9sente une s\u00e9quence visuelle soigneusement compos\u00e9e, sans narration ni script. Le contenu repose enti\u00e8rement sur la force de l\u2019image, avec des plans rapproch\u00e9s qui capturent le processus de pr\u00e9paration en d\u00e9tail. L\u2019absence de parole cr\u00e9e une ambiance intimiste et immersive.",
  visualTechniques: [
    { name: "Gros plan / Macro", confidence: 94 },
    { name: "Slow-motion", confidence: 89 },
    { name: "ASMR (son naturel)", confidence: 86 },
    { name: "\u00c9clairage naturel chaud", confidence: 82 },
    { name: "Plan fixe (stabilis\u00e9)", confidence: 78 },
  ],
  whyViral:
    "Le format sans script \u00e9limine la barri\u00e8re linguistique et maximise la port\u00e9e internationale. Les sons naturels d\u00e9clenchent une r\u00e9ponse ASMR chez les spectateurs. La composition visuelle soign\u00e9e communique l\u2019expertise sans explication. La bri\u00e8vet\u00e9 du format encourage le re-visionnage en boucle, augmentant le taux de compl\u00e9tion.",
  keyElements: {
    colorPalette:
      "Palette chaude et naturelle : tons bruns, beiges et cr\u00e8me. Couleurs organiques qui \u00e9voquent l\u2019artisanat et l\u2019authenticit\u00e9.",
    lighting:
      "Lumi\u00e8re naturelle dominante, temp\u00e9rature chaude (3200-4000K). Ombres douces cr\u00e9ant du volume sans contraste excessif.",
    composition:
      "Cadrage serr\u00e9 centr\u00e9 sur le sujet principal. Profondeur de champ r\u00e9duite (bokeh naturel). Le sujet occupe 70-80% du frame.",
    rhythm:
      "Rythme organique dict\u00e9 par l\u2019action. Pas de montage rapide \u2014 les plans sont longs et contemplatifs. La lenteur cr\u00e9e du suspense.",
  },
  recreationSteps: [
    "Identifiez le geste ou le processus cl\u00e9 \u00e0 filmer. Choisissez un moment visuellement satisfaisant.",
    "Pr\u00e9parez votre setup : tr\u00e9pied, \u00e9clairage naturel (fen\u00eatre lat\u00e9rale), surface propre.",
    "Filmez en mode vid\u00e9o 1080p/60fps minimum. Activez la stabilisation.",
    "Capturez le son naturel \u2014 c\u2019est un \u00e9l\u00e9ment cl\u00e9 du format sans script.",
    "Gardez le plan serr\u00e9 et centr\u00e9. \u00c9vitez les mouvements de cam\u00e9ra inutiles.",
    "En post-production : ajustez la chaleur des couleurs (+10-15%). N\u2019ajoutez PAS de musique.",
    "Publiez avec un hook visuel fort dans les 2 premi\u00e8res secondes.",
  ],
};

export function AnalysisModal({ open, onClose, video, onToast }: AnalysisModalProps) {
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (open && video && !video.analyzed) {
      setProcessing(true);
      setCurrentStep(0);
      setShowResult(false);

      const timers = [
        setTimeout(() => setCurrentStep(1), 1000),
        setTimeout(() => setCurrentStep(2), 2500),
        setTimeout(() => setCurrentStep(3), 3500),
        setTimeout(() => {
          setProcessing(false);
          setShowResult(true);
        }, 4300),
      ];
      return () => timers.forEach(clearTimeout);
    } else if (open && video?.analyzed) {
      setProcessing(false);
      setShowResult(true);
    }
  }, [open, video]);

  if (!video) return null;

  const isTK = video.platform === "tk";
  const analysisData = video.analyzed && VIDEO_ANALYSES[video.id]
    ? VIDEO_ANALYSES[video.id]
    : { ...GENERIC_ANALYSIS, videoId: video.id };

  function handleClose() {
    setProcessing(false);
    setShowResult(false);
    setCurrentStep(0);
    onClose();
  }

  function handleRegenerate() {
    setShowResult(false);
    setProcessing(true);
    setCurrentStep(0);

    const timers = [
      setTimeout(() => setCurrentStep(1), 1000),
      setTimeout(() => setCurrentStep(2), 2500),
      setTimeout(() => setCurrentStep(3), 3500),
      setTimeout(() => {
        setProcessing(false);
        setShowResult(true);
      }, 4300),
    ];
    // We won't clean up these on unmount since handleRegenerate is user-initiated
    // and the modal should stay open
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
            className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-stone-custom/30 flex items-center justify-between z-10 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gold/15 rounded-xl flex items-center justify-center">
                  <span className="text-base">{"\ud83c\udfac"}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">Analyse vid&eacute;o par IA</p>
                  <p className="text-[10px] text-muted-rb">
                    Compr&eacute;hension visuelle du contenu
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
              {/* Source video reference card */}
              <div className="bg-beige/40 rounded-xl p-4 mb-5 flex items-start gap-3">
                <div
                  className={`w-14 h-10 rounded-lg bg-gradient-to-br ${video.thumbnailGradient} flex items-center justify-center shrink-0 overflow-hidden`}
                >
                  <span className="text-lg opacity-40">{video.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon
                      icon={isTK ? "simple-icons:tiktok" : "simple-icons:instagram"}
                      width={10}
                      className={isTK ? "text-tiktok" : "text-[#E1306C]"}
                    />
                    <p className="text-[10px] font-bold text-faded uppercase tracking-wider">
                      Vid&eacute;o source
                    </p>
                  </div>
                  <p className="text-[13px] font-semibold text-ink leading-snug line-clamp-2">
                    {video.hook}
                  </p>
                  <p className="text-[11px] text-muted-rb mt-1">
                    @{video.account} &middot; {video.views} vues
                  </p>
                </div>
              </div>

              {/* Processing section */}
              {processing && (
                <div className="mb-5">
                  <div className="mb-5">
                    <AnalysisSteps currentStep={currentStep} />
                  </div>
                  <FrameExtraction
                    currentStep={currentStep}
                    videoGradient={video.thumbnailGradient}
                  />
                </div>
              )}

              {/* Result section */}
              <AnimatePresence>
                {showResult && (
                  <AnalysisResult
                    analysis={analysisData}
                    onToast={onToast}
                    onRegenerate={handleRegenerate}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
