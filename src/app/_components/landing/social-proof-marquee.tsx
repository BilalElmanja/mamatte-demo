"use client";

import { MARQUEE_BRANDS } from "./data";

export function SocialProofMarquee() {
  // Duplicate brand list for seamless infinite loop
  const brands = [...MARQUEE_BRANDS, ...MARQUEE_BRANDS];

  return (
    <section className="py-10 border-y border-stone-custom/30 bg-white/40">
      <div className="overflow-hidden">
        <div className="marquee-track">
          {brands.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="text-lg font-extrabold text-stone-custom/50 tracking-tight flex items-center gap-3 shrink-0"
            >
              {brand}
              <span className="text-gold/40 text-base">&#x2022;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
