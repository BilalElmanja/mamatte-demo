import { Icon } from "@iconify/react";
import { FOOTER_LINKS, SOCIAL_LINKS } from "./data";

const footerSections = [
  FOOTER_LINKS.produit,
  FOOTER_LINKS.application,
  FOOTER_LINKS.legal,
] as const;

export function Footer() {
  return (
    <footer className="py-16 bg-ink">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Logo + description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                <Icon
                  icon="solar:cup-hot-bold"
                  width={16}
                  className="text-gold"
                />
              </div>
              <span className="text-base font-extrabold text-white">
                Reel<span className="text-gold">Boost</span>
              </span>
            </div>
            <p className="text-[12px] text-white/25 leading-relaxed max-w-[220px]">
              L&apos;IA qui analyse vos concurrents Instagram &amp; TikTok et
              genere vos idees de videos. Pour les cafes et restaurants qui
              veulent gagner les reseaux.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-bold text-gold uppercase tracking-[.2em] mb-5">
                {section.title}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[12px] text-white/30 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/15">
            &copy; 2026 ReelBoost &mdash; Fait avec &#9749; et &#10084;&#65039;
            en France
          </p>
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-white/15 hover:text-gold transition-colors"
              >
                <Icon icon={social.icon} width={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
