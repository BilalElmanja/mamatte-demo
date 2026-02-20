"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { overlayVariants, modalIn, resultIn } from "@/lib/motion";
import { OUTLIER_ANALYSES } from "@/app/(dashboard)/_data/mock-data";
import type { VideoAnalysis } from "@/app/(dashboard)/_data/mock-data";
import type { Outlier } from "./outlier-row";
import { AnalysisSteps } from "@/app/(dashboard)/video-analysis/_components/analysis-steps";
import { FrameExtraction } from "@/app/(dashboard)/video-analysis/_components/frame-extraction";

type OutlierAnalysisModalProps = {
  open: boolean;
  onClose: () => void;
  outlier: Outlier | null;
  onToast: (msg: string) => void;
};

// Gradient mapping based on outlier emoji
const EMOJI_GRADIENTS: Record<string, string> = {
  "\u2615": "from-amber-200 via-orange-100 to-stone-200",
  "\ud83d\udca1": "from-yellow-100 via-amber-50 to-beige",
  "\ud83d\ude33": "from-pink-100 via-rose-50 to-stone-200",
  "\ud83c\udfa7": "from-stone-300 via-amber-100 to-cream",
  "\ud83c\udf5e": "from-orange-100 via-amber-100 to-yellow-50",
  "\ud83d\udcb0": "from-green-100 via-lime-50 to-amber-50",
  "\ud83e\udd50": "from-amber-300 via-yellow-200 to-orange-100",
  "\ud83d\ude02": "from-pink-100 via-rose-50 to-amber-50",
  "\ud83c\udf73": "from-amber-200 via-stone-custom to-beige",
  "\ud83c\udfb2": "from-purple-100 via-pink-50 to-stone-200",
};
const DEFAULT_GRADIENT = "from-amber-200 via-orange-100 to-stone-200";

// Generic fallback analysis
const GENERIC_ANALYSIS: VideoAnalysis = {
  videoId: 0,
  sceneDescription:
    "La vid\u00e9o pr\u00e9sente une s\u00e9quence visuelle soigneusement compos\u00e9e captant l\u2019attention du spectateur d\u00e8s les premi\u00e8res secondes. Le contenu repose sur un hook textuel fort combin\u00e9 \u00e0 une ex\u00e9cution visuelle engageante. Le format est optimis\u00e9 pour les r\u00e9seaux sociaux avec une dur\u00e9e courte et un rythme soutenu.",
  visualTechniques: [
    { name: "Hook textuel fort", confidence: 94 },
    { name: "Montage dynamique", confidence: 89 },
    { name: "Cadrage serr\u00e9", confidence: 86 },
    { name: "\u00c9clairage naturel chaud", confidence: 82 },
    { name: "Format vertical optimis\u00e9", confidence: 78 },
  ],
  whyViral:
    "Le hook cr\u00e9e un curiosity gap imm\u00e9diat qui force le spectateur \u00e0 rester. Le format court maximise le taux de compl\u00e9tion. Le contenu est facilement partageable et g\u00e9n\u00e8re des commentaires. L\u2019authenticit\u00e9 du cadre (vrai caf\u00e9, vrai personnel) cr\u00e9e de la confiance.",
  keyElements: {
    colorPalette:
      "Palette chaude et naturelle : tons bruns, beiges et cr\u00e8me. Couleurs organiques \u00e9voquant l\u2019artisanat.",
    lighting:
      "Lumi\u00e8re naturelle dominante, temp\u00e9rature chaude. Ombres douces cr\u00e9ant du volume.",
    composition:
      "Cadrage serr\u00e9 centr\u00e9 sur le sujet principal. Profondeur de champ r\u00e9duite.",
    rhythm:
      "Rythme soutenu avec transitions fluides. Dur\u00e9e optimale pour les algorithmes.",
  },
  recreationSteps: [
    "Identifiez le concept cl\u00e9 et adaptez-le \u00e0 votre univers de marque.",
    "Pr\u00e9parez un hook d\u2019accroche percutant dans les 2 premi\u00e8res secondes.",
    "Filmez en lumi\u00e8re naturelle avec votre smartphone en mode portrait.",
    "Gardez un rythme dynamique \u2014 chaque plan doit apporter de l\u2019information.",
    "Ajoutez du texte overlay pour renforcer les points cl\u00e9s.",
    "Terminez par un CTA clair (follow, commentaire, partage).",
    "Publiez aux heures de pointe de votre audience.",
  ],
};

// Mock remix results per outlier hook style
const REMIX_RESULTS: Record<string, { hook: string; concept: string; format: string; cta: string }> = {
  default: {
    hook: "\u00ab Chez Mamatte, on fait \u00e7a diff\u00e9remment \u2014 et \u00e7a marche \u00bb",
    concept: "Reprenez le concept viral du concurrent mais avec votre identit\u00e9 Mamatte. Mettez en avant votre savoir-faire unique, votre d\u00e9cor, votre \u00e9quipe. Le spectateur doit sentir l\u2019authenticit\u00e9 de VOTRE version.",
    format: "Reel/TikTok 15-30s \u2022 Vertical 9:16 \u2022 Son naturel ou musique tendance",
    cta: "Venez go\u00fbter la diff\u00e9rence chez Mamatte \u2615 Lien en bio",
  },
};

const GENERATE_RESULTS: Record<string, { hook: string; concept: string; why: string; difficulty: string }> = {
  default: {
    hook: "\u00ab Ce que nos clients ne voient JAMAIS en coulisses \u00bb",
    concept: "Montrez un aspect inattendu de votre quotidien chez Mamatte \u2014 la pr\u00e9paration \u00e0 5h du matin, le rituel de la premi\u00e8re tasse, le rangement m\u00e9ticuleux. Pas de script, pas de mise en sc\u00e8ne. L\u2019authenticit\u00e9 brute.",
    why: "Le contenu BTS (behind-the-scenes) g\u00e9n\u00e8re +67% d\u2019engagement. Le format \u00ab ce que vous ne voyez pas \u00bb cr\u00e9e de l\u2019exclusivit\u00e9 et renforce la connexion avec votre communaut\u00e9.",
    difficulty: "Facile \u2022 1 personne \u2022 ~20 min de tournage",
  },
};

// Specific results keyed by outlier IDs
const REMIX_BY_ID: Record<number, { hook: string; concept: string; format: string; cta: string }> = {
  1: {
    hook: "\u00ab Notre barista r\u00e9v\u00e8le sa technique secr\u00e8te de latte art en 30 secondes \u00bb",
    concept: "Filmez votre barista Mamatte r\u00e9alisant son plus beau latte art en plong\u00e9e. M\u00eame format que le concurrent, mais avec votre tasse, votre comptoir, votre identit\u00e9. Ajoutez un twist : montrez 3 niveaux de difficult\u00e9 (d\u00e9butant \u2192 expert).",
    format: "Reel/TikTok 28s \u2022 Vertical 9:16 \u2022 ASMR (son naturel uniquement)",
    cta: "Quel niveau voulez-vous go\u00fbter ? \u2615 Venez chez Mamatte \u2022 Lien en bio",
  },
  101: {
    hook: "\u00ab POV : tu es barista chez Mamatte et on te demande un \u2018caf\u00e9 simple\u2019 \u00bb",
    concept: "Reprenez le format POV barista mais en version Mamatte. Montrez VOS options de personnalisation, VOS sp\u00e9cialit\u00e9s. Ajoutez une touche d\u2019humour avec votre \u00e9quipe. Terminez en montrant le r\u00e9sultat final impressionnant.",
    format: "TikTok 15-25s \u2022 Selfie mode \u2022 Son tendance + texte overlay",
    cta: "Il n\u2019y a rien de \u00ab simple \u00bb chez Mamatte \ud83d\ude09 #mamatte #barista #POV",
  },
  102: {
    hook: "\u00ab Le son de nos grains fra\u00eechement torr\u00e9fi\u00e9s vers\u00e9s dans le moulin Mamatte \u00bb",
    concept: "Cr\u00e9ez votre propre ASMR caf\u00e9 avec vos grains, votre moulin, votre setup. Filmez en macro ultra-serr\u00e9. Mettez en avant la qualit\u00e9 de vos grains (origine, torr\u00e9faction). Le son EST le contenu.",
    format: "TikTok 19s \u2022 Mode macro \u2022 Slow-motion 120fps \u2022 ASMR pur",
    cta: "Montez le son \ud83d\udd0a et venez sentir l\u2019ar\u00f4me en vrai chez Mamatte",
  },
};

const GENERATE_BY_ID: Record<number, { hook: string; concept: string; why: string; difficulty: string }> = {
  1: {
    hook: "\u00ab 3 niveaux de latte art : lequel m\u00e9ritez-vous ? \u00bb",
    concept: "Montrez 3 latte arts de difficult\u00e9 croissante (c\u0153ur simple \u2192 rosetta \u2192 motif libre). Demandez aux spectateurs de voter en commentaire. Terminez par : \u00ab Le niveau 4, c\u2019est vous qui venez le cr\u00e9er chez Mamatte \u00bb.",
    why: "Le format \u00ab niveaux \u00bb g\u00e9n\u00e8re 2,4x plus de commentaires. La gamification cr\u00e9e de l\u2019engagement et du d\u00e9bat. Le CTA final convertit les spectateurs en clients.",
    difficulty: "Facile \u2022 1 barista \u2022 ~15 min de tournage",
  },
  101: {
    hook: "\u00ab Les 5 commandes les plus bizarres qu\u2019on a re\u00e7ues chez Mamatte \u00bb",
    concept: "Listicle humoristique : montrez 5 commandes improbables avec la r\u00e9action du barista pour chacune. Format jump cuts rapides. Terminez par \u00ab Et vous, c\u2019est quoi votre commande bizarre ? \u00bb",
    why: "Le format listicle + humour = combo viral prouv\u00e9. Encourage les commentaires (partage de commandes). Renforce l\u2019image fun et accessible de Mamatte.",
    difficulty: "Facile \u2022 1-2 personnes \u2022 ~20 min",
  },
  102: {
    hook: "\u00ab Fermez les yeux. \u00c9coutez. Devinez ce qu\u2019on pr\u00e9pare chez Mamatte \u00bb",
    concept: "ASMR blind test : commencez par un \u00e9cran noir avec juste le son (moulin, extraction, vapeur). R\u00e9v\u00e9lez progressivement l\u2019image. Le spectateur doit deviner. Format interactif qui booste les commentaires.",
    why: "L\u2019ASMR + le myst\u00e8re cr\u00e9ent une exp\u00e9rience immersive unique. Le blind test encourage les commentaires de devinettes. Le format est facilement d\u00e9clinable chaque semaine.",
    difficulty: "Facile \u2022 1 personne \u2022 ~10 min",
  },
};

const KEY_ELEMENTS_META = [
  { key: "colorPalette" as const, emoji: "\ud83c\udfa8", label: "Palette de couleurs" },
  { key: "lighting" as const, emoji: "\ud83d\udca1", label: "\u00c9clairage" },
  { key: "composition" as const, emoji: "\ud83d\udcd0", label: "Composition" },
  { key: "rhythm" as const, emoji: "\ud83c\udfb5", label: "Rythme" },
];

export function OutlierAnalysisModal({ open, onClose, outlier, onToast }: OutlierAnalysisModalProps) {
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Remix / Generate
  const [remixLoading, setRemixLoading] = useState(false);
  const [showRemix, setShowRemix] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);

  const remixRef = useRef<HTMLDivElement>(null);
  const generateRef = useRef<HTMLDivElement>(null);

  // Start processing when modal opens
  useEffect(() => {
    if (open && outlier) {
      setProcessing(true);
      setCurrentStep(0);
      setShowResult(false);
      setShowRemix(false);
      setShowGenerate(false);
      setRemixLoading(false);
      setGenerateLoading(false);

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
    }
  }, [open, outlier]);

  if (!outlier) return null;

  const isTK = outlier.platform === "tk";
  const gradient = EMOJI_GRADIENTS[outlier.emoji] || DEFAULT_GRADIENT;
  const analysisData = OUTLIER_ANALYSES[outlier.id]
    ? OUTLIER_ANALYSES[outlier.id]
    : { ...GENERIC_ANALYSIS, videoId: outlier.id };

  function handleClose() {
    setProcessing(false);
    setShowResult(false);
    setCurrentStep(0);
    setShowRemix(false);
    setShowGenerate(false);
    setRemixLoading(false);
    setGenerateLoading(false);
    onClose();
  }

  function handleRegenerate() {
    setShowResult(false);
    setShowRemix(false);
    setShowGenerate(false);
    setProcessing(true);
    setCurrentStep(0);

    setTimeout(() => setCurrentStep(1), 1000);
    setTimeout(() => setCurrentStep(2), 2500);
    setTimeout(() => setCurrentStep(3), 3500);
    setTimeout(() => {
      setProcessing(false);
      setShowResult(true);
    }, 4300);
  }

  function handleRemix() {
    setRemixLoading(true);
    setShowRemix(false);
    setTimeout(() => {
      setRemixLoading(false);
      setShowRemix(true);
      setTimeout(() => {
        remixRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }, 2200);
  }

  function handleGenerate() {
    setGenerateLoading(true);
    setShowGenerate(false);
    setTimeout(() => {
      setGenerateLoading(false);
      setShowGenerate(true);
      setTimeout(() => {
        generateRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }, 2200);
  }

  const remixData = REMIX_BY_ID[outlier.id] || REMIX_RESULTS.default;
  const generateData = GENERATE_BY_ID[outlier.id] || GENERATE_RESULTS.default;

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
                    Compr&eacute;hension visuelle &amp; strat&eacute;gie de contenu
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
              {/* Source outlier reference card */}
              <div className="bg-beige/40 rounded-xl p-4 mb-5 flex items-start gap-3">
                <div
                  className={`w-14 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 overflow-hidden relative`}
                >
                  <span className="text-lg opacity-40">{outlier.emoji}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white/50 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon
                      icon={isTK ? "simple-icons:tiktok" : "simple-icons:instagram"}
                      width={10}
                      className={isTK ? "text-tiktok" : "text-[#E1306C]"}
                    />
                    <p className="text-[10px] font-bold text-faded uppercase tracking-wider">
                      {isTK ? "TikTok source" : "Reel source"}
                    </p>
                    {outlier.viral && (
                      <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md ml-1">
                        VIRAL {"\ud83d\udd25"}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-semibold text-ink leading-snug line-clamp-2">
                    {outlier.hook}
                  </p>
                  <p className="text-[11px] text-muted-rb mt-1">
                    @{outlier.account} &middot; {outlier.views} vues &middot; {outlier.likes} likes
                  </p>
                </div>
              </div>

              {/* Processing section */}
              {processing && (
                <div className="mb-5">
                  <div className="mb-5">
                    <AnalysisSteps currentStep={currentStep} />
                  </div>
                  <FrameExtraction currentStep={currentStep} videoGradient={gradient} />
                </div>
              )}

              {/* Analysis Result */}
              <AnimatePresence>
                {showResult && (
                  <motion.div variants={resultIn} initial="hidden" animate="visible">
                    <div className="border-2 border-gold/30 rounded-2xl p-5 bg-gradient-to-br from-gold/5 to-transparent mb-5">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-4">
                        <Icon icon="solar:stars-minimalistic-bold" width={14} className="text-gold" />
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                          R&eacute;sultat de l&apos;analyse
                        </span>
                      </div>

                      {/* Scene description */}
                      <div className="mb-5">
                        <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1.5">
                          Description de la sc&egrave;ne
                        </p>
                        <p className="text-[13px] text-inksoft leading-relaxed">
                          {analysisData.sceneDescription}
                        </p>
                      </div>

                      {/* Visual techniques */}
                      <div className="mb-5">
                        <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                          Techniques visuelles
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {analysisData.visualTechniques.map((tech) => (
                            <div
                              key={tech.name}
                              className="confidence-badge bg-beige px-3 py-1.5 rounded-lg text-[11px] font-semibold text-ink flex items-center gap-2"
                            >
                              {tech.name}
                              <span className="bg-gold/20 text-golddark text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                {tech.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Why viral */}
                      <div className="mb-5">
                        <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1.5">
                          Pourquoi c&apos;est viral
                        </p>
                        <p className="text-[13px] text-inksoft leading-relaxed">
                          {analysisData.whyViral}
                        </p>
                      </div>

                      {/* Key elements */}
                      <div className="mb-5">
                        <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                          &Eacute;l&eacute;ments cl&eacute;s
                        </p>
                        <div>
                          {KEY_ELEMENTS_META.map((elem) => (
                            <div
                              key={elem.key}
                              className="flex gap-3 py-2.5 border-b border-stone-custom/20 last:border-0"
                            >
                              <span className="text-base shrink-0">{elem.emoji}</span>
                              <div className="min-w-0">
                                <p className="text-[12px] font-bold text-ink mb-0.5">{elem.label}</p>
                                <p className="text-[12px] text-muted-rb leading-relaxed">
                                  {analysisData.keyElements[elem.key]}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recreation steps */}
                      <div className="mb-5">
                        <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-2">
                          Guide de recr&eacute;ation
                        </p>
                        <div>
                          {analysisData.recreationSteps.map((step, i) => (
                            <div key={i} className="flex gap-3 py-2">
                              <div className="w-6 h-6 rounded-full bg-gold/15 text-golddark text-[10px] font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                              </div>
                              <p className="text-[12px] text-inksoft leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Utility action buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gold/20">
                        <button
                          onClick={() => onToast("Analyse sauvegard\u00e9e \u2b50")}
                          className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
                        >
                          <Icon icon="solar:bookmark-linear" width={13} />
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleRegenerate}
                          className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
                        >
                          <Icon icon="solar:refresh-linear" width={13} />
                          R&eacute;g&eacute;n&eacute;rer
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

                    {/* ═══ REMIX & GENERATE CTAs ═══ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      <button
                        onClick={handleRemix}
                        disabled={remixLoading}
                        className="group border-2 border-ink/10 hover:border-ink rounded-2xl p-4 text-left transition-all hover:shadow-lg hover:shadow-ink/5"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center shrink-0">
                            <Icon icon="solar:magic-stick-3-bold" width={16} className="text-white" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-ink">Remixer pour Mamatte</p>
                            <p className="text-[10px] text-muted-rb">Adapter ce concept viral</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-rb leading-relaxed">
                          L&apos;IA adapte ce contenu viral pour votre marque, votre d&eacute;cor et votre &eacute;quipe.
                        </p>
                      </button>

                      <button
                        onClick={handleGenerate}
                        disabled={generateLoading}
                        className="group border-2 border-gold/20 hover:border-gold rounded-2xl p-4 text-left transition-all hover:shadow-lg hover:shadow-gold/10"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-9 h-9 bg-gold/15 rounded-xl flex items-center justify-center shrink-0">
                            <Icon icon="solar:lightbulb-bolt-bold" width={16} className="text-golddark" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-ink">G&eacute;n&eacute;rer id&eacute;e similaire</p>
                            <p className="text-[10px] text-muted-rb">Cr&eacute;er un contenu original</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-rb leading-relaxed">
                          L&apos;IA cr&eacute;e une nouvelle id&eacute;e inspir&eacute;e de ce format, taill&eacute;e pour Mamatte.
                        </p>
                      </button>
                    </div>

                    {/* Remix loading */}
                    {remixLoading && (
                      <div className="mb-5">
                        <div className="flex items-center gap-3 mb-4">
                          <Icon icon="solar:refresh-linear" width={16} className="text-ink animate-spin" />
                          <span className="text-sm font-medium text-muted-rb">
                            L&apos;IA remixe ce contenu pour Mamatte...
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="shimmer-block h-4 w-3/4" />
                          <div className="shimmer-block h-4 w-full" />
                          <div className="shimmer-block h-4 w-5/6" />
                        </div>
                      </div>
                    )}

                    {/* Remix result */}
                    <AnimatePresence>
                      {showRemix && (
                        <motion.div
                          ref={remixRef}
                          initial={{ opacity: 0, y: 12, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.97 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="mb-5"
                        >
                          <div className="border-2 border-ink/20 rounded-2xl p-5 bg-gradient-to-br from-ink/[0.02] to-transparent">
                            <div className="flex items-center gap-2 mb-4">
                              <Icon icon="solar:magic-stick-3-bold" width={14} className="text-ink" />
                              <span className="text-[10px] font-bold text-ink uppercase tracking-wider">
                                Version Mamatte
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-bold text-faded uppercase tracking-wider mb-1">Hook</p>
                                <p className="text-[15px] font-semibold text-ink leading-snug">
                                  {remixData.hook}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-faded uppercase tracking-wider mb-1">Concept</p>
                                <p className="text-[13px] text-inksoft leading-relaxed">
                                  {remixData.concept}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-faded uppercase tracking-wider mb-1">Format</p>
                                <p className="text-[12px] text-muted-rb">{remixData.format}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-faded uppercase tracking-wider mb-1">CTA sugg&eacute;r&eacute;</p>
                                <p className="text-[12px] text-muted-rb italic">{remixData.cta}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-ink/10">
                              <button
                                onClick={() => onToast("Script cr\u00e9\u00e9 \ud83d\udcdd")}
                                className="btn-primary bg-ink text-white px-4 py-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
                              >
                                <Icon icon="solar:document-add-linear" width={13} />
                                Cr&eacute;er le script
                              </button>
                              <button
                                onClick={() => {
                                  onToast("Id\u00e9e sauvegard\u00e9e \u2b50");
                                }}
                                className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
                              >
                                <Icon icon="solar:bookmark-linear" width={13} />
                                Sauvegarder
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

                    {/* Generate loading */}
                    {generateLoading && (
                      <div className="mb-5">
                        <div className="flex items-center gap-3 mb-4">
                          <Icon icon="solar:refresh-linear" width={16} className="text-gold animate-spin" />
                          <span className="text-sm font-medium text-muted-rb">
                            L&apos;IA g&eacute;n&egrave;re une nouvelle id&eacute;e pour Mamatte...
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="shimmer-block h-4 w-3/4" />
                          <div className="shimmer-block h-4 w-full" />
                          <div className="shimmer-block h-4 w-5/6" />
                        </div>
                      </div>
                    )}

                    {/* Generate result */}
                    <AnimatePresence>
                      {showGenerate && (
                        <motion.div
                          ref={generateRef}
                          initial={{ opacity: 0, y: 12, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.97 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="mb-5"
                        >
                          <div className="border-2 border-gold/30 rounded-2xl p-5 bg-gradient-to-br from-gold/5 to-transparent">
                            <div className="flex items-center gap-2 mb-4">
                              <Icon icon="solar:lightbulb-bolt-bold" width={14} className="text-gold" />
                              <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                                Nouvelle id&eacute;e inspir&eacute;e
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">Hook</p>
                                <p className="text-[15px] font-semibold text-ink leading-snug">
                                  {generateData.hook}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">Concept</p>
                                <p className="text-[13px] text-inksoft leading-relaxed">
                                  {generateData.concept}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-golddark uppercase tracking-wider mb-1">Pourquoi &ccedil;a marchera</p>
                                <p className="text-[13px] text-muted-rb italic leading-relaxed">
                                  {generateData.why}
                                </p>
                              </div>
                              <div className="bg-beige/50 rounded-lg px-3 py-2">
                                <p className="text-[11px] font-semibold text-ink">
                                  {generateData.difficulty}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gold/20">
                              <button
                                onClick={() => onToast("Script cr\u00e9\u00e9 \ud83d\udcdd")}
                                className="btn-primary bg-ink text-white px-4 py-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
                              >
                                <Icon icon="solar:document-add-linear" width={13} />
                                Cr&eacute;er le script
                              </button>
                              <button
                                onClick={() => {
                                  onToast("Id\u00e9e sauvegard\u00e9e \u2b50");
                                }}
                                className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
                              >
                                <Icon icon="solar:bookmark-linear" width={13} />
                                Sauvegarder
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
