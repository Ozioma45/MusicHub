"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { testimonials } from "../../lib/data";

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  const nextTestimonial = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[index];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold mb-8">What Our Community Says</h2>

        <div className="relative flex items-center justify-center max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-6 bg-white shadow-md rounded-lg p-6 max-w-3xl"
            >
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={64} // equivalent to w-16
                height={64} // equivalent to h-16
                className="rounded-full object-cover border-2 border-blue-500"
              />
              <div className="text-left">
                <p className="italic text-gray-700 mb-2">
                  “{testimonial.quote}”
                </p>
                <p className="text-blue-600 font-medium">
                  {testimonial.name} - {testimonial.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-2 top-1/2 transform -translate-y-1/2"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 top-1/2 transform -translate-y-1/2"
            onClick={nextTestimonial}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
