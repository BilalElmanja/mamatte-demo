import { Navbar } from "./_components/landing/navbar";
import { Hero } from "./_components/landing/hero";
import { SocialProofMarquee } from "./_components/landing/social-proof-marquee";
import { BentoGrid } from "./_components/landing/bento-grid";
import { Stats } from "./_components/landing/stats";
import { ProblemSection } from "./_components/landing/problem-section";
import { Features } from "./_components/landing/features";
import { HowItWorks } from "./_components/landing/how-it-works";
import { BeforeAfter } from "./_components/landing/before-after";
import { Testimonials } from "./_components/landing/testimonials";
import { Faq } from "./_components/landing/faq";
import { FinalCta } from "./_components/landing/final-cta";
import { Footer } from "./_components/landing/footer";

export default function LandingPage() {
  return (
    <div className="relative bg-cream overflow-x-hidden">
      {/* Grain overlay */}
      <div className="grain" />

      <Navbar />
      <Hero />
      <SocialProofMarquee />
      <BentoGrid />
      <Stats />
      <ProblemSection />
      <Features />
      <HowItWorks />
      <BeforeAfter />
      <Testimonials />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
