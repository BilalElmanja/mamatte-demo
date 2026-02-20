"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";

type ScriptPanelProps = {
  onToast: (msg: string) => void;
};

const SCRIPT_SECTIONS = [
  {
    label: "Accroche",
    viewText:
      "\u00AB Tu as 3 secondes avant que ce latte art disparaisse\u2026 Regarde bien. \u00BB",
    rows: 2,
  },
  {
    label: "Contexte",
    viewText:
      "Tu scrolles tous les jours des vid\u00e9os de caf\u00e9. Mais celle-l\u00e0, tu n\u2019en as jamais vu une comme \u00e7a. Notre barista met 45 secondes de concentration pure pour cr\u00e9er ce dessin \u00e9ph\u00e9m\u00e8re dans ta tasse.",
    rows: 3,
  },
  {
    label: "Valeur",
    viewText:
      "Le secret ? La hauteur du versement \u2014 entre 5 et 7 cm, pas plus. La temp\u00e9rature du lait \u2014 65\u00B0C exactement. Et surtout, des heures et des heures de pratique. Ce que tu vois en 15 secondes, c\u2019est 3 ans de travail.",
    rows: 4,
  },
  {
    label: "CTA",
    viewText:
      "Enregistre cette vid\u00e9o et montre-moi ton essai en story \uD83D\uDCAA Tag @mamatte.brunch.cafe \u2014 les meilleurs sont repost\u00e9s !",
    rows: 2,
  },
];

const CAPTION = {
  label: "Caption",
  viewText:
    "L\u2019art du latte, 45 secondes de pure pr\u00e9cision \u2615\u2728 Oui, c\u2019est fait \u00e0 la main. Chaque. Matin. \uD83D\uDC9B #mamatte #latteart #barista #coffeeshop #asmrcafe #cafefrancais",
  rows: 3,
};

export function ScriptPanel({ onToast }: ScriptPanelProps) {
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(
    SCRIPT_SECTIONS.map((s) => s.viewText)
  );
  const [caption, setCaption] = useState(CAPTION.viewText);
  const [originalSections] = useState(
    SCRIPT_SECTIONS.map((s) => s.viewText)
  );
  const [originalCaption] = useState(CAPTION.viewText);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const saveEdit = () => {
    setEditing(false);
    onToast("Script sauvegard\u00e9");
  };

  const revertScript = () => {
    setSections([...originalSections]);
    setCaption(originalCaption);
    onToast("Script restaur\u00e9 \u00e0 l\u2019original");
  };

  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.12 }}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-6 md:p-8 mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gold/15 rounded-xl flex items-center justify-center">
            <Icon
              icon="solar:document-text-bold"
              width={18}
              className="text-golddark"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Script</h2>
            <p className="text-[10px] text-muted-rb">
              147 mots &middot; ~60 sec &middot; {"\u270F\uFE0F"} Modifi&eacute;
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEdit}
            className="btn-outline border border-stone-custom rounded-lg px-3 py-1.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
          >
            <Icon
              icon={
                editing
                  ? "solar:close-circle-linear"
                  : "solar:pen-2-linear"
              }
              width={13}
            />
            {editing ? "Annuler" : "Modifier"}
          </button>
          <button
            onClick={() => onToast("Script copi\u00e9")}
            className="btn-outline border border-stone-custom rounded-lg px-3 py-1.5 text-[11px] font-bold text-muted-rb flex items-center gap-1.5"
          >
            <Icon icon="solar:copy-linear" width={13} />
            Copier
          </button>
        </div>
      </div>

      {/* View mode */}
      {!editing && (
        <div className="space-y-4">
          {SCRIPT_SECTIONS.map((section, i) => (
            <div key={section.label}>
              <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1.5">
                {section.label}
              </p>
              <p
                className={`text-[14px] ${i === 0 ? "font-semibold text-ink" : "text-inksoft"} leading-relaxed`}
              >
                {sections[i]}
              </p>
            </div>
          ))}
          <div className="pt-4 border-t border-stone-custom/30">
            <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1.5">
              {CAPTION.label}
            </p>
            <p className="text-[13px] text-muted-rb leading-relaxed">
              {caption}
            </p>
          </div>
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="space-y-4">
          {SCRIPT_SECTIONS.map((section, i) => (
            <div key={section.label}>
              <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1.5">
                {section.label}
              </p>
              <textarea
                value={sections[i]}
                onChange={(e) => {
                  const updated = [...sections];
                  updated[i] = e.target.value;
                  setSections(updated);
                }}
                rows={section.rows}
                className="edit-area w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-3 text-[14px] text-ink outline-none resize-none"
              />
            </div>
          ))}
          <div className="pt-4 border-t border-stone-custom/30">
            <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1.5">
              {CAPTION.label}
            </p>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={CAPTION.rows}
              className="edit-area w-full bg-beige/30 border border-stone-custom rounded-xl px-4 py-3 text-[13px] text-ink outline-none resize-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={saveEdit}
              className="btn-primary bg-ink text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Icon icon="solar:check-read-linear" width={14} />
              Sauver les modifications
            </button>
            <button
              onClick={toggleEdit}
              className="btn-outline border border-stone-custom rounded-xl px-4 py-2.5 text-xs font-semibold text-muted-rb"
            >
              Annuler
            </button>
            <button
              onClick={revertScript}
              className="btn-ghost text-xs font-semibold text-faded ml-auto flex items-center gap-1"
            >
              <Icon icon="solar:restart-linear" width={13} />
              Revenir &agrave; l&apos;original
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
