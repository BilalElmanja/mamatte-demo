"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { FEATURES } from "./data";

export function Features() {
  return (
    <section className="py-28" id="features">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="text-[11px] font-bold text-gold uppercase tracking-[.25em] mb-4">
              Fonctionnalit&eacute;s
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl md:text-[2.8rem] font-extrabold text-ink leading-tight text-balance">
              Tout ce qu&apos;il faut pour
              <br />
              <span className="font-serif italic font-normal gradient-text">
                dominer votre niche
              </span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <ScrollReveal
              key={feature.title}
              delay={i * 0.08}
            >
              <div
                className="group bg-white rounded-2xl border border-stone-custom/30 overflow-hidden transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_30px_80px_rgba(0,0,0,.06)]"
                style={{
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                }}
              >
                {/* Image */}
                <div className="h-40 overflow-hidden relative">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-600 group-hover:scale-[1.08]"
                    style={{
                      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div
                    className="w-11 h-11 bg-beige rounded-xl flex items-center justify-center mb-4 -mt-10 relative z-10 border-2 border-white shadow-md transition-all duration-[450ms] group-hover:scale-[1.18] group-hover:rotate-[-8deg] group-hover:bg-ink"
                    style={{
                      transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    <Icon
                      icon={feature.icon}
                      width={20}
                      className="text-golddark group-hover:text-white transition-colors duration-[450ms]"
                    />
                  </div>
                  <h3 className="text-[15px] font-bold text-ink mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] text-muted-rb leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
