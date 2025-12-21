import { AnimatedTestimonialsDemo } from "./_components/AnimatedTestimonialsDemo";
import { BentoGridThirdDemo } from "./_components/BentoGrid";
import { HeroSectionOne } from "./_components/HeroSectionOne";
import { MacbookScrollDemo } from "./_components/MacbookScrollDemo";

export default function Home() {
  return (
    <div>
      <HeroSectionOne />
      <BentoGridThirdDemo />
      <MacbookScrollDemo />
      <AnimatedTestimonialsDemo />
    </div>
  );
}
