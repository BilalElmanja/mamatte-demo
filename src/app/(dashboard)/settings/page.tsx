"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  slideUpBlur,
  modalIn,
  overlayVariants,
  stagger,
  easing,
} from "@/lib/motion";

/* ═══ TYPES ═══ */

type ApiKeyConfig = {
  name: string;
  icon: string;
  maskedKey: string;
  fullKey: string;
  status: "active" | "inactive";
  lastTest: string;
  description: string;
};

/* ═══ DATA ═══ */

const API_KEYS: ApiKeyConfig[] = [
  {
    name: "OpenAI",
    icon: "simple-icons:openai",
    maskedKey: "sk-proj-****************************4f2g",
    fullKey: "sk-proj-a8fG3kLmN9pQ2rStUvWx7yZ1bCdEfGhI4f2g",
    status: "active",
    lastTest: "Dernier test : il y a 2 heures",
    description: "",
  },
  {
    name: "Apify",
    icon: "solar:bug-linear",
    maskedKey: "apify_api_**********************8j2k",
    fullKey: "",
    status: "active",
    lastTest: "Dernier test : il y a 2 heures",
    description: "",
  },
  {
    name: "RapidAPI",
    icon: "solar:chart-square-linear",
    maskedKey: "****************************3m1n",
    fullKey: "",
    status: "active",
    lastTest: "Dernier test : il y a 2 heures",
    description: "",
  },
  {
    name: "Resend",
    icon: "solar:letter-linear",
    maskedKey: "",
    fullKey: "",
    status: "inactive",
    lastTest: "",
    description: "Optionnel \u2014 uniquement pour les rapports email",
  },
];

const FREQ_MAP: Record<string, string> = {
  "1-2x / semaine": "5",
  "3-4x / semaine": "10",
  "5-7x / semaine": "15",
};

/* ═══ COMPONENT ═══ */

export default function SettingsPage() {
  // Profile state
  const [name, setName] = useState("Mamatte Longueau-Glisy");
  const [savedName, setSavedName] = useState("Mamatte Longueau-Glisy");
  const [language, setLanguage] = useState("FR");
  const [frequency, setFrequency] = useState("3-4x / semaine");

  // Notification toggles
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [newIdeas, setNewIdeas] = useState(true);
  const [viralAlerts, setViralAlerts] = useState(true);

  // API keys
  const [apiKeyVisible, setApiKeyVisible] = useState<Record<string, boolean>>({
    OpenAI: false,
  });
  const [resendConfigOpen, setResendConfigOpen] = useState(false);
  const [resendKey, setResendKey] = useState("");
  const [testingKey, setTestingKey] = useState<string | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleSaveName = () => {
    setSavedName(name);
    showToast("Nom mis \u00e0 jour");
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    showToast("Langue mise \u00e0 jour : " + value);
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
    showToast("Fr\u00e9quence mise \u00e0 jour");
  };

  const handleTestKey = (keyName: string) => {
    setTestingKey(keyName);
    showToast("Test de la cl\u00e9 " + keyName + " en cours...");
    setTimeout(() => {
      setTestingKey(null);
      showToast("Cl\u00e9 " + keyName + " : Valide");
    }, 1500);
  };

  const handleToggleKeyVisibility = (keyName: string) => {
    setApiKeyVisible((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const handleSaveResend = () => {
    setResendConfigOpen(false);
    setResendKey("");
    showToast("Cl\u00e9 Resend configur\u00e9e");
  };

  const nameChanged = name !== savedName;
  const ideaCount = FREQ_MAP[frequency] || "10";

  return (
    <>
      <motion.div
        variants={stagger(0, 0.05)}
        initial="hidden"
        animate="visible"
      >
        {/* Page title */}
        <motion.h1
          variants={slideUpBlur}
          className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-8"
        >
          Param\u00e8tres
        </motion.h1>

        {/* ═══ 1. PROFILE ═══ */}
        <motion.div
          variants={slideUpBlur}
          className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
        >
          <h2 className="text-sm font-bold text-ink flex items-center gap-2 mb-5">
            <Icon icon="solar:user-circle-linear" width={18} className="text-gold" />
            Profil
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-[11px] font-bold text-faded uppercase tracking-wider mb-1.5 block">
                Nom
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field flex-1 bg-beige/30 border border-stone-custom rounded-xl px-4 py-2.5 text-sm text-ink outline-none"
                />
                {nameChanged && (
                  <button
                    onClick={handleSaveName}
                    className="btn-primary bg-ink text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Sauver
                  </button>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-bold text-faded uppercase tracking-wider mb-1.5 block">
                Email
              </label>
              <input
                type="text"
                value="contact@mamatte-longueau.fr"
                disabled
                className="input-field w-full bg-beige/20 border border-stone-custom/30 rounded-xl px-4 py-2.5 text-sm text-muted-rb outline-none cursor-not-allowed"
              />
              <p className="text-[10px] text-faded mt-1">
                G\u00e9r\u00e9 par Clerk &middot; Non modifiable ici
              </p>
            </div>

            {/* Language + Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-faded uppercase tracking-wider mb-1.5 block">
                  Langue du contenu
                </label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="select-field w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-2.5 text-sm text-ink outline-none"
                >
                  <option value="FR">{"\ud83c\uddeb\ud83c\uddf7 Fran\u00e7ais"}</option>
                  <option value="EN">{"\ud83c\uddec\ud83c\udde7 English"}</option>
                  <option value="ES">{"\ud83c\uddea\ud83c\uddf8 Espa\u00f1ol"}</option>
                </select>
                <p className="text-[10px] text-faded mt-1">
                  Change la langue du contenu IA g\u00e9n\u00e9r\u00e9
                </p>
              </div>
              <div>
                <label className="text-[11px] font-bold text-faded uppercase tracking-wider mb-1.5 block">
                  Fr\u00e9quence de publication
                </label>
                <select
                  value={frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                  className="select-field w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-2.5 text-sm text-ink outline-none"
                >
                  <option>1-2x / semaine</option>
                  <option>3-4x / semaine</option>
                  <option>5-7x / semaine</option>
                </select>
                <p className="text-[10px] text-faded mt-1">
                  &rarr; Vous recevrez{" "}
                  <span className="font-bold text-ink">{ideaCount} id\u00e9es</span>{" "}
                  par semaine
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ 2. INSTAGRAM ═══ */}
        <motion.div
          variants={slideUpBlur}
          className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
        >
          <h2 className="text-sm font-bold text-ink flex items-center gap-2 mb-5">
            <Icon icon="solar:camera-linear" width={18} className="text-gold" />
            Connexion Instagram
          </h2>
          <div className="flex items-center gap-3 bg-green-50/60 border border-green-200/60 rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              M
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink">
                  @mamatte.brunch.cafe
                </span>
                <span
                  className="w-2.5 h-2.5 bg-green-400 rounded-full flex-shrink-0"
                  style={{ animation: "pulseGreen 2s infinite" }}
                />
              </div>
              <p className="text-[11px] text-muted-rb">
                2 412 abonn\u00e9s &middot; 487 posts
              </p>
            </div>
            <button className="btn-outline border border-stone-custom rounded-lg px-3 py-1.5 text-[11px] font-semibold text-muted-rb flex-shrink-0">
              Changer
            </button>
          </div>
        </motion.div>

        {/* ═══ 3. API KEYS ═══ */}
        <motion.div
          variants={slideUpBlur}
          className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
        >
          <h2 className="text-sm font-bold text-ink flex items-center gap-2 mb-2">
            <Icon icon="solar:key-linear" width={18} className="text-gold" />
            Cl\u00e9s API
          </h2>
          <p className="text-[11px] text-muted-rb mb-5">
            Vos cl\u00e9s sont chiffr\u00e9es et stock\u00e9es de mani\u00e8re s\u00e9curis\u00e9e.
          </p>

          <div className="space-y-3">
            {API_KEYS.map((apiKey) => {
              const isActive = apiKey.status === "active";
              const isResend = apiKey.name === "Resend";
              const isOpenAI = apiKey.name === "OpenAI";
              const keyShown = apiKeyVisible[apiKey.name];

              return (
                <div
                  key={apiKey.name}
                  className={`api-card ${
                    isActive ? "api-active" : "api-inactive"
                  } bg-beige/20 border border-stone-custom/40 rounded-xl p-4`}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-white rounded-lg border border-stone-custom/40 flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon={apiKey.icon}
                        width={16}
                        className={isActive ? "text-ink" : "text-faded"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-ink">{apiKey.name}</p>
                      <p className="text-[10px] text-muted-rb">
                        {isResend ? apiKey.description : apiKey.lastTest}
                      </p>
                    </div>
                    {isActive ? (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        Actif
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        Non configur\u00e9
                      </span>
                    )}
                  </div>

                  {/* Key display (active keys only) */}
                  {isActive && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <code className="font-mono text-xs text-muted-rb bg-white border border-stone-custom/30 px-3 py-1.5 rounded-lg flex-1 truncate">
                          {isOpenAI && keyShown
                            ? apiKey.fullKey
                            : apiKey.maskedKey}
                        </code>
                        {isOpenAI && (
                          <button
                            onClick={() => handleToggleKeyVisibility("OpenAI")}
                            className="w-8 h-8 rounded-lg border border-stone-custom flex items-center justify-center text-faded hover:text-ink hover:bg-beige transition-all"
                            title={keyShown ? "Masquer" : "Afficher"}
                          >
                            <Icon
                              icon={
                                keyShown
                                  ? "solar:eye-closed-linear"
                                  : "solar:eye-linear"
                              }
                              width={14}
                            />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleTestKey(apiKey.name)}
                          disabled={testingKey === apiKey.name}
                          className="btn-outline border border-stone-custom rounded-lg px-3 py-1.5 text-[10px] font-bold text-muted-rb flex items-center gap-1 disabled:opacity-50"
                        >
                          {testingKey === apiKey.name ? (
                            <span
                              className="w-3 h-3 border-2 border-muted-rb/30 border-t-muted-rb rounded-full inline-block"
                              style={{ animation: "spin 0.6s linear infinite" }}
                            />
                          ) : (
                            <Icon icon="solar:refresh-linear" width={12} />
                          )}
                          Tester
                        </button>
                        <button className="btn-outline border border-stone-custom rounded-lg px-3 py-1.5 text-[10px] font-bold text-muted-rb flex items-center gap-1">
                          <Icon icon="solar:pen-2-linear" width={12} />
                          Changer
                        </button>
                      </div>
                    </>
                  )}

                  {/* Resend config */}
                  {isResend && (
                    <>
                      {resendConfigOpen && (
                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={resendKey}
                            onChange={(e) => setResendKey(e.target.value)}
                            placeholder="re_xxxxxxxxxxxx"
                            className="input-field flex-1 font-mono text-xs bg-white border border-stone-custom rounded-lg px-3 py-2 outline-none min-w-0"
                          />
                          <button
                            onClick={handleSaveResend}
                            className="btn-primary bg-ink text-white px-4 py-2 rounded-lg text-[10px] font-bold"
                          >
                            Sauver
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => setResendConfigOpen(!resendConfigOpen)}
                        className="text-[11px] font-bold text-gold hover:text-golddark transition-colors flex items-center gap-1 mt-2"
                      >
                        Configurer{" "}
                        <Icon icon="solar:arrow-right-linear" width={10} />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ 4. NOTIFICATIONS ═══ */}
        <motion.div
          variants={slideUpBlur}
          className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
        >
          <h2 className="text-sm font-bold text-ink flex items-center gap-2 mb-5">
            <Icon icon="solar:bell-linear" width={18} className="text-gold" />
            Notifications
          </h2>
          <div className="space-y-4">
            {/* Weekly report toggle */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Rapport hebdomadaire par email
                </p>
                <p className="text-[11px] text-muted-rb">
                  Envoy\u00e9 chaque dimanche apr\u00e8s l&apos;analyse
                </p>
              </div>
              <button
                onClick={() => {
                  setWeeklyReport(!weeklyReport);
                  showToast(
                    !weeklyReport
                      ? "Notification activ\u00e9e"
                      : "Notification d\u00e9sactiv\u00e9e"
                  );
                }}
                className={`toggle-track ${
                  weeklyReport ? "on" : ""
                } w-11 h-6 bg-stone-custom rounded-full p-0.5 flex-shrink-0`}
              >
                <div className="toggle-knob w-5 h-5 bg-white rounded-full shadow-md" />
              </button>
            </div>

            <div className="h-px bg-stone-custom/30" />

            {/* New ideas toggle */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Nouvelles id\u00e9es pr\u00eates
                </p>
                <p className="text-[11px] text-muted-rb">
                  Notification quand les id\u00e9es hebdomadaires sont g\u00e9n\u00e9r\u00e9es
                </p>
              </div>
              <button
                onClick={() => {
                  setNewIdeas(!newIdeas);
                  showToast(
                    !newIdeas
                      ? "Notification activ\u00e9e"
                      : "Notification d\u00e9sactiv\u00e9e"
                  );
                }}
                className={`toggle-track ${
                  newIdeas ? "on" : ""
                } w-11 h-6 bg-stone-custom rounded-full p-0.5 flex-shrink-0`}
              >
                <div className="toggle-knob w-5 h-5 bg-white rounded-full shadow-md" />
              </button>
            </div>

            <div className="h-px bg-stone-custom/30" />

            {/* Viral alerts toggle */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Alertes virales
                </p>
                <p className="text-[11px] text-muted-rb">
                  Alerte quand un Reel concurrent d\u00e9passe 2\u00d7 la moyenne
                </p>
              </div>
              <button
                onClick={() => {
                  setViralAlerts(!viralAlerts);
                  showToast(
                    !viralAlerts
                      ? "Notification activ\u00e9e"
                      : "Notification d\u00e9sactiv\u00e9e"
                  );
                }}
                className={`toggle-track ${
                  viralAlerts ? "on" : ""
                } w-11 h-6 bg-stone-custom rounded-full p-0.5 flex-shrink-0`}
              >
                <div className="toggle-knob w-5 h-5 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </div>

          {/* Resend warning */}
          <div className="mt-4 bg-amber-50/60 border border-amber-200/40 rounded-xl px-4 py-2.5 flex items-start gap-2">
            <Icon
              icon="solar:danger-triangle-linear"
              width={14}
              className="text-amber-500 mt-0.5 flex-shrink-0"
            />
            <p className="text-[11px] text-amber-700">
              Les rapports email n\u00e9cessitent une cl\u00e9 Resend configur\u00e9e.{" "}
              <button
                onClick={() => setResendConfigOpen(true)}
                className="font-bold underline decoration-amber-300 hover:text-amber-900"
              >
                Configurer &uarr;
              </button>
            </p>
          </div>
        </motion.div>

        {/* ═══ 5. DATA & PRIVACY ═══ */}
        <motion.div
          variants={slideUpBlur}
          className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
        >
          <h2 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
            <Icon
              icon="solar:shield-check-linear"
              width={18}
              className="text-gold"
            />
            Donn\u00e9es & confidentialit\u00e9
          </h2>
          <p className="text-[13px] text-muted-rb leading-relaxed mb-5">
            Les donn\u00e9es de Reels sont conserv\u00e9es 90 jours, puis automatiquement
            supprim\u00e9es. Les id\u00e9es et rapports sont conserv\u00e9s ind\u00e9finiment.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                showToast("Export en cours... le fichier sera t\u00e9l\u00e9charg\u00e9.")
              }
              className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-xs font-bold text-muted-rb flex items-center gap-2"
            >
              <Icon icon="solar:file-download-linear" width={14} />
              Exporter mes donn\u00e9es
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="btn-danger border border-red-200 rounded-xl px-4 py-2.5 text-xs font-bold text-red-400 flex items-center gap-2"
            >
              <Icon icon="solar:trash-bin-2-linear" width={14} />
              Supprimer mon compte
            </button>
          </div>
        </motion.div>

        {/* ═══ 6. HELP ═══ */}
        <motion.div
          variants={slideUpBlur}
          className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
        >
          <h2 className="text-sm font-bold text-ink flex items-center gap-2 mb-5">
            <Icon
              icon="solar:question-circle-linear"
              width={18}
              className="text-gold"
            />
            Aide
          </h2>
          <div className="space-y-2">
            <Link
              href="/onboarding"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-beige/50 transition-all"
            >
              <Icon
                icon="solar:restart-linear"
                width={16}
                className="text-muted-rb"
              />
              <span className="text-sm font-medium text-ink">
                Relancer le tutoriel d&apos;onboarding
              </span>
              <Icon
                icon="solar:arrow-right-linear"
                width={12}
                className="text-faded ml-auto"
              />
            </Link>
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-beige/50 transition-all"
            >
              <Icon
                icon="solar:book-minimalistic-linear"
                width={16}
                className="text-muted-rb"
              />
              <span className="text-sm font-medium text-ink">Documentation</span>
              <Icon
                icon="solar:square-top-down-linear"
                width={12}
                className="text-faded ml-auto"
              />
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-beige/50 transition-all"
            >
              <Icon
                icon="solar:bug-linear"
                width={16}
                className="text-muted-rb"
              />
              <span className="text-sm font-medium text-ink">
                Signaler un bug
              </span>
              <Icon
                icon="solar:square-top-down-linear"
                width={12}
                className="text-faded ml-auto"
              />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ DELETE ACCOUNT MODAL ═══ */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setDeleteModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              variants={modalIn}
              className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon
                  icon="solar:danger-triangle-linear"
                  width={28}
                  className="text-red-500"
                />
              </div>
              <h3 className="text-lg font-bold text-ink text-center mb-2">
                Supprimer votre compte ?
              </h3>
              <p className="text-sm text-muted-rb text-center mb-5">
                Cette action supprimera d\u00e9finitivement votre compte et toutes vos
                donn\u00e9es apr\u00e8s un d\u00e9lai de 30 jours. Tapez{" "}
                <span className="font-mono font-bold text-red-500">SUPPRIMER</span>{" "}
                pour confirmer.
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Tapez SUPPRIMER"
                className="input-field w-full bg-red-50/50 border border-red-200 rounded-xl px-4 py-3 text-sm text-ink text-center outline-none font-mono mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setDeleteConfirm("");
                  }}
                  className="flex-1 border border-stone-custom rounded-xl py-2.5 text-sm font-semibold text-muted-rb hover:bg-beige transition-all"
                >
                  Annuler
                </button>
                <button
                  disabled={deleteConfirm !== "SUPPRIMER"}
                  className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Supprimer le compte
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ TOAST ═══ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: easing.smooth }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-ink text-white px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 shadow-2xl shadow-ink/20">
              <Icon icon="solar:check-circle-bold" width={17} />
              <span>{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
