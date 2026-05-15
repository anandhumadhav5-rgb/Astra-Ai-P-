import { Footer } from "@/components/footer";
import { CinematicBackground } from "@/components/cinematic-background";
import { Navigation } from "@/components/navigation";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { CtaSection } from "@/sections/cta-section";
import { FeaturesSection } from "@/sections/features-section";
import { HeroSection } from "@/sections/hero-section";
import { IntelligenceSection } from "@/sections/intelligence-section";
import { MetricsSection } from "@/sections/metrics-section";
import { SecuritySection } from "@/sections/security-section";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen overflow-hidden bg-ink text-white">
        <CinematicBackground />
        <Navigation />
        <HeroSection />
        <MetricsSection />
        <FeaturesSection />
        <IntelligenceSection />
        <SecuritySection />
        <CtaSection />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
