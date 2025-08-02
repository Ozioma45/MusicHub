import HowItWorks from "@/components/landing/HowItWorks";
import MainLayout from "../components/MainLayout";

import HeroSection from "@/components/landing/HeroSection";
import FeaturedMusicians from "@/components/landing/FeaturedMusicians";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <HowItWorks />
      <FeaturedMusicians />
    </MainLayout>
  );
}
