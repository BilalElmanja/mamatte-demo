import type { Metadata } from "next";
import { Manrope, Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ReelBoost",
    template: "%s | ReelBoost",
  },
  description:
    "L'IA qui analyse vos concurrents Instagram & TikTok et génère vos idées de vidéos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${manrope.variable} ${playfairDisplay.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
