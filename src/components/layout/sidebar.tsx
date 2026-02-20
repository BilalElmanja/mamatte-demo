"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const navItems = [
  { label: "Tableau de bord", href: "/dashboard", icon: "solar:widget-2-linear" },
  { label: "Idées", href: "/ideas", icon: "solar:lightbulb-linear" },
  { label: "Concurrents", href: "/competitors", icon: "solar:users-group-rounded-linear" },
  { label: "Mes Reels", href: "/my-reels", icon: "solar:reel-linear" },
  { label: "Outliers", href: "/outliers", icon: "solar:fire-linear" },
  { label: "Rapports", href: "/reports", icon: "solar:chart-2-linear" },
  { label: "Scripts", href: "/scripts", icon: "solar:document-text-linear" },
];

const bottomItems = [
  { label: "Paramètres", href: "/settings", icon: "solar:settings-linear" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] md:max-lg:w-[72px] bg-white border-r border-stone-custom/50 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-stone-custom/40">
        <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-ink/10">
          <Icon icon="solar:cup-hot-bold" width={16} className="text-white" />
        </div>
        <div className="min-w-0 md:max-lg:hidden">
          <p className="text-sm font-bold tracking-tight text-ink leading-none">ReelBoost</p>
          <p className="text-[11px] text-muted-rb truncate mt-0.5">@mamatte.brunch.cafe</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item rounded-lg px-3 py-2.5 flex items-center gap-3 text-sm text-muted-rb md:max-lg:justify-center md:max-lg:px-0 ${active ? "active" : ""}`}
            >
              <Icon icon={item.icon} width={20} />
              <span className="md:max-lg:hidden">{item.label}</span>
            </Link>
          );
        })}

        <div className="my-2 mx-3 h-px bg-stone-custom/40" />

        {bottomItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item rounded-lg px-3 py-2.5 flex items-center gap-3 text-sm text-muted-rb md:max-lg:justify-center md:max-lg:px-0 ${active ? "active" : ""}`}
            >
              <Icon icon={item.icon} width={20} />
              <span className="md:max-lg:hidden">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-stone-custom/40 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          M
        </div>
        <div className="min-w-0 md:max-lg:hidden">
          <p className="text-xs font-semibold text-ink truncate">Mamatte Longueau</p>
        </div>
      </div>
    </aside>
  );
}
