"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

const bottomNavItems = [
  {
    label: "Accueil",
    href: "/dashboard",
    icon: "solar:widget-2-linear",
    iconBold: "solar:widget-2-bold",
  },
  {
    label: "Idées",
    href: "/ideas",
    icon: "solar:lightbulb-linear",
    iconBold: "solar:lightbulb-bold",
  },
  {
    label: "Rivaux",
    href: "/competitors",
    icon: "solar:users-group-rounded-linear",
    iconBold: "solar:users-group-rounded-bold",
  },
  {
    label: "Reels",
    href: "/my-reels",
    icon: "solar:reel-linear",
    iconBold: "solar:reel-bold",
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-stone-custom/40 z-40 flex items-center justify-around px-2">
      {bottomNavItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 ${active ? "text-ink" : "text-muted-rb"}`}
          >
            <Icon icon={active ? item.iconBold : item.icon} width={22} />
            <span className={`text-[9px] ${active ? "font-bold" : ""}`}>{item.label}</span>
          </Link>
        );
      })}

      <Sheet>
        <SheetTrigger asChild>
          <button className="flex flex-col items-center gap-0.5 text-muted-rb">
            <Icon icon="solar:menu-dots-bold" width={22} />
            <span className="text-[9px]">Plus</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>
    </nav>
  );
}
