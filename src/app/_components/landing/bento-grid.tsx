"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const BENTO_CELLS = [
  {
    src: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800&h=900&fit=crop",
    alt: "Caf\u00e9 int\u00e9rieur",
    className: "col-span-2 row-span-2",
    delay: 0.08,
    badge: (
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-stone-custom/20">
        <p className="text-[10px] font-bold text-gold uppercase tracking-wider">
          Analyse de niche
        </p>
        <p className="text-[13px] font-bold text-ink">
          Brunch &middot; Coffee &middot; Bakery
        </p>
      </div>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop",
    alt: "Latte art",
    className: "col-span-1 row-span-1",
    delay: 0.16,
    badge: (
      <div className="absolute top-3 right-3 bg-ink/80 backdrop-blur-sm rounded-lg px-2.5 py-1">
        <span className="text-[9px] font-bold text-white">245K vues 🔥</span>
      </div>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=500&h=400&fit=crop",
    alt: "Brunch assiette",
    className: "col-span-1 row-span-1",
    delay: 0.24,
    badge: (
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
        <span className="text-[9px] font-bold text-ink">📝 Script pr&ecirc;t</span>
      </div>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=500&h=400&fit=crop",
    alt: "Barista",
    className: "col-span-1 row-span-1",
    delay: 0.32,
    badge: (
      <div className="absolute top-3 left-3 bg-gold/90 backdrop-blur-sm rounded-lg px-2.5 py-1">
        <span className="text-[9px] font-bold text-white">✨ S&apos;inspirer</span>
      </div>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&h=400&fit=crop",
    alt: "Coffee beans",
    className: "col-span-1 row-span-1",
    delay: 0.4,
    badge: (
      <div className="absolute bottom-3 right-3 bg-[#ff0050]/90 backdrop-blur-sm rounded-lg px-2.5 py-1">
        <span className="text-[9px] font-bold text-white">#CoffeeTok 🔥</span>
      </div>
    ),
  },
];

export function BentoGrid() {
  return (
    <section className="py-24">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal>
            <p className="text-[11px] font-bold text-gold uppercase tracking-[.25em] mb-4">
              Con&ccedil;u pour les caf&eacute;s &amp; restaurants &middot; Instagram + TikTok
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl md:text-[2.8rem] font-extrabold text-ink leading-tight text-balance">
              L&apos;IA qui comprend
              <br />
              <span className="font-serif italic font-normal gradient-text">
                votre niche
              </span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-auto md:h-[480px]">
          {BENTO_CELLS.map((cell, i) => (
            <ScrollReveal key={i} delay={cell.delay}>
              <div
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-600 hover:scale-[1.02] ${cell.className} ${
                  i === 0 ? "h-[300px] md:h-full" : "h-[200px] md:h-full"
                }`}
                style={{
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                }}
              >
                <Image
                  src={cell.src}
                  alt={cell.alt}
                  fill
                  className="object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
                  style={{
                    transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                  }}
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                />
                {cell.badge}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
