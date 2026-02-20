"use client";

import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  unit?: string;
  delay?: number;
}

function StatItem({ value, suffix, label, unit, delay = 0 }: StatItemProps) {
  const { ref, display } = useCounterAnimation(value, suffix);

  return (
    <ScrollReveal delay={delay}>
      <div className="text-center">
        <p className="text-[3rem] md:text-[3.5rem] font-extrabold text-ink leading-none mb-1">
          <span ref={ref as React.RefObject<HTMLSpanElement>}>{display}</span>
          {unit && (
            <span className="text-gold font-serif italic text-[2rem]">
              {unit}
            </span>
          )}
        </p>
        <p className="text-sm text-muted-rb">{label}</p>
      </div>
    </ScrollReveal>
  );
}

export function Stats() {
  return (
    <section className="py-20">
      <div className="max-w-[1080px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatItem
            value={2.8}
            suffix={"\u00d7"}
            label="plus de vues en moyenne"
            delay={0}
          />
          <StatItem
            value={12}
            suffix=""
            label="id\u00e9es g\u00e9n\u00e9r\u00e9es / semaine"
            delay={0.08}
          />
          <StatItem
            value={5}
            suffix=""
            label="pour tout configurer"
            unit="min"
            delay={0.16}
          />
          <StatItem
            value={0}
            suffix={"\u20ac"}
            label="d\u2019abonnement \u00b7 vos API keys"
            delay={0.24}
          />
        </div>
      </div>
    </section>
  );
}
