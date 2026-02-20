"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { slideUpBlur } from "@/lib/motion";

const actions = [
  { label: "Voir les idées", href: "/ideas", icon: "solar:lightbulb-linear", iconColor: "text-gold" },
  { label: "Outliers", href: "/outliers", icon: "solar:fire-linear", iconColor: "text-orange-500" },
  { label: "Scripts", href: "/scripts", icon: "solar:document-text-linear", iconColor: "text-muted-rb" },
  { label: "Rapports", href: "/reports", icon: "solar:chart-2-linear", iconColor: "text-muted-rb" },
];

export function QuickActions() {
  return (
    <motion.div
      variants={slideUpBlur}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 }}
      className="section-card bg-white rounded-2xl border border-stone-custom/40 p-5"
    >
      <h2 className="text-sm font-bold text-ink mb-3">Actions rapides</h2>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="btn-outline border border-stone-custom rounded-xl p-3 text-center hover:border-faded"
          >
            <Icon
              icon={action.icon}
              width={18}
              className={`${action.iconColor} mb-1 block mx-auto`}
            />
            <span className="text-[11px] font-bold text-ink block">{action.label}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
