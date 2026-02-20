"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "./data";

export function Navbar() {
  const isScrolled = useScrollPosition(60);
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "nav-glass bg-cream/88 border-b border-stone-custom/35"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center shadow-lg shadow-ink/10 transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110">
            <Icon icon="solar:cup-hot-bold" width={17} className="text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-ink">
            Reel<span className="text-gold">Boost</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-[13px] font-semibold text-muted-rb transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: auth buttons + mobile menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden sm:inline-block text-[13px] font-semibold text-muted-rb hover:text-ink transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/sign-up"
            className="btn-cta bg-ink text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-ink/10 inline-flex items-center gap-2"
          >
            Essai gratuit
            <Icon icon="solar:arrow-right-linear" width={14} />
          </Link>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden ml-1 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-beige transition-colors"
                aria-label="Menu"
              >
                <Icon icon="solar:hamburger-menu-linear" width={22} className="text-ink" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-cream w-[280px]">
              <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
              <div className="flex flex-col gap-2 mt-8">
                {/* Logo in mobile menu */}
                <div className="flex items-center gap-2.5 mb-6 px-2">
                  <div className="w-8 h-8 bg-ink rounded-xl flex items-center justify-center">
                    <Icon
                      icon="solar:cup-hot-bold"
                      width={14}
                      className="text-white"
                    />
                  </div>
                  <span className="text-base font-extrabold tracking-tight text-ink">
                    Reel<span className="text-gold">Boost</span>
                  </span>
                </div>

                {/* Nav links */}
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-xl text-[14px] font-semibold text-muted-rb hover:text-ink hover:bg-beige/60 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                {/* Divider */}
                <div className="h-px bg-stone-custom/40 my-4" />

                {/* Auth buttons */}
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-xl text-[14px] font-semibold text-muted-rb hover:text-ink hover:bg-beige/60 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="btn-cta bg-ink text-white px-5 py-3 rounded-xl text-[14px] font-bold shadow-lg shadow-ink/10 flex items-center justify-center gap-2 mt-2"
                >
                  Essai gratuit
                  <Icon icon="solar:arrow-right-linear" width={14} />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
