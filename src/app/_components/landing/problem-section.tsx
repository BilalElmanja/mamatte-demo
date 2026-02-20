"use client";

import { Icon } from "@iconify/react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const PAIN_POINTS = [
  {
    icon: "solar:clock-circle-linear",
    title: "Heures perdues",
    description:
      "Vous passez des heures \u00e0 scroller Instagram et TikTok pour trouver l\u2019inspiration. Du temps pr\u00e9cieux que vous pourriez investir dans votre caf\u00e9.",
  },
  {
    icon: "solar:target-linear",
    title: "Strat\u00e9gie \u00e0 l\u2019aveugle",
    description:
      "Vous postez au feeling, sans donn\u00e9es sur ce qui fonctionne vraiment dans votre niche. Pas de data, pas de r\u00e9sultats.",
  },
  {
    icon: "solar:chart-2-linear",
    title: "R\u00e9sultats invisibles",
    description:
      "Impossible de savoir ce qui marche, ce qui ne marche pas. Pas de suivi, pas de rapports, pas d\u2019am\u00e9lioration.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-28 bg-ink relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(200,169,126,.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-[880px] mx-auto px-6 lg:px-10 text-center relative z-10">
        {/* Tag */}
        <ScrollReveal>
          <p className="text-[11px] font-bold text-gold uppercase tracking-[.25em] mb-6">
            Le probl&egrave;me
          </p>
        </ScrollReveal>

        {/* Title */}
        <ScrollReveal delay={0.08}>
          <h2 className="text-3xl md:text-[2.75rem] font-extrabold text-white leading-tight mb-8 text-balance">
            Vous passez des heures &agrave; chercher des id&eacute;es de Reels.
            <span className="block font-serif italic font-normal text-gold/70 mt-2">
              Vos concurrents, eux, postent d&eacute;j&agrave;.
            </span>
          </h2>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal delay={0.16}>
          <p className="text-base text-white/40 leading-relaxed max-w-xl mx-auto mb-16">
            Scroller Instagram et TikTok. Copier ce que font les autres.
            Improviser des scripts &agrave; la derni&egrave;re minute. R&eacute;sultat ? Des
            vid&eacute;os &agrave; 200 vues et un sentiment de frustration permanent.
          </p>
        </ScrollReveal>

        {/* Pain-point cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {PAIN_POINTS.map((card, i) => (
            <ScrollReveal key={card.title} delay={0.16 + i * 0.08}>
              <div className="bg-white/[.04] backdrop-blur-sm border border-white/[.06] rounded-2xl p-7 hover:bg-white/[.06] transition-all duration-300 hover:border-white/10">
                <div className="w-12 h-12 bg-white/[.06] rounded-xl flex items-center justify-center mb-5">
                  <Icon
                    icon={card.icon}
                    width={24}
                    className="text-gold"
                  />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-[13px] text-white/35 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
