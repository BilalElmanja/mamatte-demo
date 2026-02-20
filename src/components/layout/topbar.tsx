"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

const pathLabels: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/ideas": "Idées",
  "/competitors": "Concurrents",
  "/my-reels": "Mes Reels",
  "/outliers": "Outliers",
  "/reports": "Rapports",
  "/scripts": "Scripts",
  "/settings": "Paramètres",
};

function getTitle(pathname: string): string {
  for (const [path, label] of Object.entries(pathLabels)) {
    if (pathname.startsWith(path)) return label;
  }
  return "Tableau de bord";
}

export function Topbar() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-lg border-b border-stone-custom/40 z-40 flex items-center justify-between px-4">
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-beige">
            <Icon icon="solar:hamburger-menu-linear" width={20} className="text-ink" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <span className="text-sm font-bold text-ink">{title}</span>

      <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-[10px] font-bold text-white">
        M
      </div>
    </header>
  );
}
