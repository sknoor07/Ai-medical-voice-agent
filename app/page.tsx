import HeroSectionOne from "@/components/hero-section-demo-1";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FeatureBentoGrid } from "./_components/Fetaure_BentoGrid";

export default function Home() {
  return (
    <div>
      <HeroSectionOne />
      <FeatureBentoGrid />
    </div>
  );
}
