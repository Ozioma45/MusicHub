import HowItWorks from "@/components/landing/HowItWorks";
import MainLayout from "../components/MainLayout";

import HeroSection from "@/components/landing/HeroSection";
import FeaturedMusicians from "@/components/landing/FeaturedMusicians";
import PopularGenres from "@/components/landing/PopularGenres";
import TestimonialsCarousel from "@/components/landing/Testimonials";
import WhyChooseSection from "@/components/landing/WhyMusiconnect";
import SubscribeSection from "@/components/landing/SubscribeSection";
import CallToActionSection from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <HowItWorks />
      <FeaturedMusicians />
      <PopularGenres />
      <TestimonialsCarousel />
      <WhyChooseSection />
      <CallToActionSection />
      <SubscribeSection />
    </MainLayout>
  );
}
