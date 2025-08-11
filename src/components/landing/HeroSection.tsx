"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero-bg.jpeg')",
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover & Book <br /> Extraordinary Live Musicians
        </h1>
        <p className="text-lg text-gray-200 mb-8">
          Connect with talented artists for your events, weddings, and parties.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-in">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-700 hover:bg-blue-100 cursor-pointer"
            >
              Explore Musicians
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
