import { CTASection } from "./_components/CTASection";
import { DemoSection } from "./_components/DemoSection";
import { FeaturesSection } from "./_components/FeaturesSection";
import { Footer } from "./_components/Footer";
import { HeroSection } from "./_components/HeroSection";
import { HowItWorks } from "./_components/HowItWorks";
import { Navbar } from "./_components/Navbar";
import { StatsSection } from "./_components/StatsSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { ThreeBackground } from "./_components/ThreeBackground";


export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">
      <ThreeBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorks />
        <DemoSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}