import HowItWorks from "@/components/landing/HowItWorks";
import MainLayout from "../components/MainLayout";

import HeroSection from "@/components/landing/HeroSection";
import FeaturedMusicians from "@/components/landing/FeaturedMusicians";
import PopularGenres from "@/components/landing/PopularGenres";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <HowItWorks />
      <FeaturedMusicians />
      <PopularGenres />
    </MainLayout>
  );
}
