"use client";

import { Icon } from "@iconify/react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { STEPS } from "./data";

export function HowItWorks() {
  return (
    <section className="py-28 bg-beige/25" id="how">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="text-[11px] font-bold text-gold uppercase tracking-[.25em] mb-4">
              Comment &ccedil;a marche
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl md:text-[2.8rem] font-extrabold text-ink leading-tight text-balance">
              De z&eacute;ro &agrave; viral en
              <br />
              <span className="font-serif italic font-normal gradient-text">
                3 &eacute;tapes simples
              </span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.08}>
              <div
                className="group bg-white rounded-2xl border border-stone-custom/30 p-8 relative overflow-hidden transition-all duration-[450ms] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,.07)]"
                style={{
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                }}
              >
                {/* Large step number */}
                <p
                  className="absolute top-5 right-6 text-[4rem] font-extrabold text-beige/80 leading-none font-mono select-none transition-all duration-[400ms] group-hover:text-gold group-hover:scale-110"
                  style={{
                    transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  {step.number}
                </p>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 ${step.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
                      step.iconBg === "bg-gold"
                        ? "shadow-gold/20"
                        : "shadow-ink/10 group-hover:shadow-ink/20"
                    } transition-shadow`}
                  >
                    <Icon
                      icon={step.icon}
                      width={24}
                      className="text-white"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-ink mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] text-muted-rb leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Step-specific extras */}
                  {step.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-bold text-muted-rb bg-beige px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Step 2: Avatar stack */}
                  {step.number === "02" && (
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center text-[8px] font-bold text-white border-2 border-white">
                        C
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-[8px] font-bold text-white border-2 border-white">
                        J
                      </div>
                      <div className="w-7 h-7 rounded-full bg-inksoft flex items-center justify-center text-[8px] font-bold text-white border-2 border-white">
                        B
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#ff0050] flex items-center justify-center text-[8px] font-bold text-white border-2 border-white">
                        TK
                      </div>
                      <div className="w-7 h-7 rounded-full bg-stone-custom flex items-center justify-center text-[8px] font-bold text-muted-rb border-2 border-white">
                        +6
                      </div>
                    </div>
                  )}

                  {/* Step 3: Action buttons */}
                  {step.number === "03" && (
                    <div className="flex items-center gap-2">
                      <div className="bg-gold/15 border border-gold/30 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1">
                        <Icon
                          icon="solar:magic-stick-3-linear"
                          width={12}
                          className="text-gold"
                        />
                        <span className="text-[10px] text-gold font-bold">
                          S&apos;inspirer
                        </span>
                      </div>
                      <div className="bg-ink rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1">
                        <span className="text-[10px] text-white font-bold">
                          Script &rarr;
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
