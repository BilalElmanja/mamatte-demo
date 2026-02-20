"use client";

import { Icon } from "@iconify/react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function FinalCta() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-beige/40 to-cream" />

      {/* Ambient blobs */}
      <div className="absolute top-[10%] right-[10%] w-[450px] h-[450px] bg-gradient-to-br from-gold/[.08] to-transparent rounded-full blur-[80px]" />
      <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-gradient-to-tr from-stone-custom/15 to-transparent rounded-full blur-[60px]" />

      <div className="max-w-[660px] mx-auto px-6 text-center relative z-10">
        {/* Logo icon */}
        <ScrollReveal>
          <div className="w-16 h-16 bg-ink rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-ink/[.12] hover:rotate-[-10deg] hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Icon
              icon="solar:cup-hot-bold"
              width={32}
              className="text-white"
            />
          </div>
        </ScrollReveal>

        {/* Heading */}
        <ScrollReveal delay={0.08}>
          <h2 className="text-3xl md:text-[2.8rem] font-extrabold text-ink leading-tight mb-6 text-balance">
            Pret a poster des Reels qui{" "}
            <span className="font-serif italic font-normal gradient-text">
              cartonnent
            </span>{" "}
            ?
          </h2>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal delay={0.16}>
          <p className="text-base text-muted-rb leading-relaxed mb-10 max-w-md mx-auto">
            Configurez en 5 minutes. Recevez vos premieres idees dimanche.
            C&apos;est gratuit, c&apos;est puissant, c&apos;est pour vous.
          </p>
        </ScrollReveal>

        {/* CTA button */}
        <ScrollReveal delay={0.24}>
          <a
            href="/auth"
            className="inline-flex items-center gap-3 bg-ink text-white px-10 py-5 rounded-2xl text-base font-bold shadow-xl shadow-ink/15 relative overflow-hidden transition-all duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-[3px] hover:shadow-[0_24px_60px_rgba(26,26,26,.2)] active:-translate-y-[1px] active:scale-[.98]"
          >
            Commencer gratuitement
            <Icon icon="solar:arrow-right-linear" width={18} />
          </a>
        </ScrollReveal>

        {/* Trust signals */}
        <ScrollReveal delay={0.32}>
          <p className="text-[11px] text-faded mt-7 flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Icon icon="solar:lock-linear" width={12} />
              Aucune carte requise
            </span>
            <span className="w-1 h-1 bg-stone-custom rounded-full" />
            <span>Open-source friendly</span>
            <span className="w-1 h-1 bg-stone-custom rounded-full" />
            <span>Vos cles, vos donnees</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
