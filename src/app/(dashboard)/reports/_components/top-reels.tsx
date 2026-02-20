"use client";

import { motion } from "framer-motion";
import { slideUpBlur } from "@/lib/motion";

const TOP_REELS = [
  {
    rank: 1,
    account: "@columbus_cafe_fr",
    views: "245K",
    hook: "\u00ab Personne ne parle de cette technique de latte art \u00bb",
    analysis: "Curiosity gap + d\u00e9monstration de comp\u00e9tence professionnelle",
  },
  {
    rank: 2,
    account: "@cafe_joyeux",
    views: "89K",
    hook: "\u00ab 3 choses que j\u2019aurais voulu savoir avant d\u2019ouvrir mon caf\u00e9 \u00bb",
    analysis: "Format listicle + vuln\u00e9rabilit\u00e9 personnelle",
  },
  {
    rank: 3,
    account: "@columbus_cafe_fr",
    views: "67K",
    hook: "\u00ab Ce client a command\u00e9 LE truc le plus bizarre \u00bb",
    analysis: "Curiosit\u00e9 + transgression sociale",
  },
];

export function TopReels() {
  return (
    <motion.div
      variants={slideUpBlur}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
    >
      <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
        <span className="text-base">&#127942;</span>
        Top Reels concurrents
      </h3>
      <div className="space-y-3">
        {TOP_REELS.map((reel) => (
          <div
            key={reel.rank}
            className="topic-row rounded-xl px-3 py-3 flex items-start gap-3"
          >
            <span
              className={`w-6 h-6 ${
                reel.rank === 1 ? "bg-gold/15" : "bg-beige"
              } rounded-full flex items-center justify-center text-[10px] font-bold ${
                reel.rank === 1 ? "text-golddark" : "text-inksoft"
              } flex-shrink-0 mt-0.5`}
            >
              {reel.rank}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-ink">
                  {reel.account}
                </span>
                <span className="text-xs text-muted-rb">
                  &mdash; {reel.views} vues
                </span>
              </div>
              <p className="text-[13px] font-semibold text-ink">{reel.hook}</p>
              <p className="text-[12px] text-muted-rb italic mt-0.5">
                &rarr; {reel.analysis}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
