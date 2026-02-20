"use client";

import { motion } from "framer-motion";
import { slideUpBlur } from "@/lib/motion";

const WINNING_TOPICS = [
  {
    title: "Coulisses de la pr\u00e9paration matinale",
    reelCount: "7 Reels",
    description:
      "Le contenu brut de cuisine surperforme le contenu produit. Les spectateurs veulent l\u2019authenticit\u00e9 du \u00ab vrai travail \u00bb.",
  },
  {
    title: "Processus latte art en vid\u00e9o",
    reelCount: "5 Reels",
    description:
      "Les vid\u00e9os ASMR de latte art en plong\u00e9e font 3,1x le taux de compl\u00e9tion moyen.",
  },
  {
    title: "R\u00e9actions clients aux nouveaux produits",
    reelCount: "4 Reels",
    description:
      "Les tests de d\u00e9gustation \u00ab dans la rue \u00bb g\u00e9n\u00e8rent +45% d\u2019engagement. Le format r\u00e9action est universellement appr\u00e9ci\u00e9.",
  },
];

export function WinningTopics() {
  return (
    <motion.div
      variants={slideUpBlur}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5 md:p-6 mb-4"
    >
      <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
        <span className="text-base">&#128200;</span>
        Sujets gagnants cette semaine
      </h3>
      <div className="space-y-3">
        {WINNING_TOPICS.map((topic) => (
          <div key={topic.title} className="topic-row rounded-xl px-3 py-3">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[14px] font-semibold text-ink">
                {topic.title}
              </p>
              <span className="text-[10px] font-bold text-muted-rb bg-beige px-2 py-0.5 rounded">
                {topic.reelCount}
              </span>
            </div>
            <p className="text-[12px] text-muted-rb">{topic.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
