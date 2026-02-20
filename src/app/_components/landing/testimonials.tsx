"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { TESTIMONIALS } from "./data";

export function Testimonials() {
  return (
    <section className="py-28 bg-beige/20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="text-[11px] font-bold text-gold uppercase tracking-[.25em] mb-4">
              Temoignages
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl md:text-[2.8rem] font-extrabold text-ink leading-tight text-balance">
              Ils ont transforme
              <br />
              <span className="font-serif italic font-normal gradient-text">
                leur Instagram
              </span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial, i) => (
            <ScrollReveal key={testimonial.name} delay={i * 0.08}>
              <div className="bg-white rounded-2xl border border-stone-custom/30 p-7 transition-all duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,.06)] h-full">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, si) => (
                    <Icon
                      key={si}
                      icon="solar:star-bold"
                      width={14}
                      className="text-gold"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[13px] text-inksoft leading-relaxed mb-6">
                  {testimonial.text}
                </p>

                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-ink">
                      {testimonial.name}
                    </p>
                    <p className="text-[11px] text-muted-rb">
                      {testimonial.handle}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
