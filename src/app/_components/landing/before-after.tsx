"use client";

import { Icon } from "@iconify/react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const BEFORE_PAIN_POINTS = [
  "Poster au hasard sans strategie",
  "Copier les concurrents sans comprendre",
  "Aucune idee de ce qui marche",
  "Des heures sur la creation de contenu",
] as const;

const AFTER_BENEFITS = [
  "Strategie basee sur les donnees",
  "Contenus viraux identifies automatiquement",
  "ROI mesurable sur chaque post",
  "5 minutes par jour suffisent",
] as const;

export function BeforeAfter() {
  return (
    <section className="py-28 overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <ScrollReveal>
            <p className="text-[11px] font-bold text-gold uppercase tracking-[.25em] mb-4">
              Comparaison
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl md:text-[2.8rem] font-extrabold text-ink leading-tight text-balance">
              Avant / Apres{" "}
              <span className="font-serif italic font-normal gradient-text">
                ReelBoost
              </span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avant card */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-red-200/50 p-8 relative overflow-hidden h-full">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 text-[9px] font-bold px-3 py-1 rounded-full border border-red-100 mb-8">
                <Icon icon="solar:close-circle-bold" width={12} />
                AVANT
              </div>

              {/* Pain points */}
              <div className="space-y-4">
                {BEFORE_PAIN_POINTS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon="solar:close-circle-bold"
                        width={16}
                        className="text-red-400"
                      />
                    </div>
                    <p className="text-[13px] text-ink/60 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom stat */}
              <div className="mt-8 pt-6 border-t border-red-100/50 text-center">
                <p className="text-3xl font-extrabold text-red-400/30">~190</p>
                <p className="text-xs text-muted-rb">
                  vues moyennes / Reel
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Apres card */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-2xl border-2 border-gold/30 p-8 relative overflow-hidden shadow-xl shadow-gold/5 h-full">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gold text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-md mb-8">
                <Icon icon="solar:check-circle-bold" width={12} />
                APRES REELBOOST
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                {AFTER_BENEFITS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon="solar:check-circle-bold"
                        width={16}
                        className="text-green-500"
                      />
                    </div>
                    <p className="text-[13px] text-ink font-medium leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom stat */}
              <div className="mt-8 pt-6 border-t border-gold/20 text-center">
                <p className="text-3xl font-extrabold gradient-text inline-block">
                  ~2,640
                </p>
                <p className="text-xs text-muted-rb">
                  vues moyennes / Reel
                </p>
                <p className="text-[11px] font-bold text-green-500 mt-1">
                  +1,290% d&apos;augmentation
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
