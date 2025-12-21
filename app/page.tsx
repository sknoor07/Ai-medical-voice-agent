import HeroSectionOne from "@/components/hero-section-demo-1";
import { AnimatedTestimonialsDemo } from "./_components/AnimatedTestimonialsDemo";
import { BentoGridThirdDemo } from "./_components/BentoGrid";

export default function Home() {
  return (
    <div>
      <HeroSectionOne />
      <BentoGridThirdDemo />
      <AnimatedTestimonialsDemo />
    </div>
  );
}
