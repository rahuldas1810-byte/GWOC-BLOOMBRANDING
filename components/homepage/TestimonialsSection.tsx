"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  label?: string;
  heading?: string;
}

export default function TestimonialsSection({
  testimonials,
  label = "CLIENTS SAY",
  heading = "WE ALWAYS DELIVER.",
}: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Static brown background - no scroll-based color changes
  const backgroundColor = "#2A1F1A";

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  // Render 3 cards for the stack effect
  const visibleIndices = [
    activeIndex,
    (activeIndex + 1) % testimonials.length,
    (activeIndex + 2) % testimonials.length,
  ];

  // Stack configuration with X and Y offsets for "bottom-right peek" effect
  const stackConfig = [
    { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 30 },                // Active
    { x: 12, y: 12, scale: 0.95, opacity: 0.5, zIndex: 20 },         // Behind 1
    { x: 24, y: 24, scale: 0.90, opacity: 0.25, zIndex: 10 },        // Behind 2
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Static background layer - no scroll transitions */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor }}
      />

      {/* Content */}
      <div className="relative z-10 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">

          {/* Header */}
          <div className="mb-6 sm:mb-10 md:mb-12">
            {label && (
              <motion.div
                className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#BDAF62] text-[#2A1F1A] font-bold text-xs sm:text-sm">3</span>
                <p className="font-bold uppercase tracking-wider text-[#BDAF62] text-xs sm:text-sm">
                  {label}
                </p>
              </motion.div>
            )}
            <motion.h2
              className="font-sans text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white italic"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {heading}
            </motion.h2>
            <div className="h-px w-full bg-[#BDAF62]/30 mt-6 sm:mt-10" />
          </div>

          {/* Stacked Card Deck Layout - with entrance animation */}
          <motion.div
            className="relative w-full max-w-[850px] mx-auto h-[220px] sm:h-[280px] md:h-[360px] flex justify-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <AnimatePresence mode="popLayout">
              {visibleIndices.map((testimonialIndex, stackIndex) => {
                const testimonial = testimonials[testimonialIndex];
                const config = stackConfig[stackIndex];

                return (
                  <motion.div
                    key={testimonial.id}
                    layoutId={testimonial.id}
                    className="absolute w-full top-0 left-0"
                    style={{ zIndex: config.zIndex }}
                    initial={{ opacity: 0, scale: 0.9, x: 60, y: 60 }}
                    animate={{
                      opacity: config.opacity,
                      scale: config.scale,
                      x: config.x,
                      y: config.y,
                    }}
                    exit={{
                      x: -250,
                      y: -100,
                      opacity: 0,
                      scale: 0.8,
                      rotate: -10,
                      transition: { duration: 0.4, ease: "easeInOut" }
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    {/* Ghost border for stacked cards (visible layers) */}
                    {stackIndex > 0 ? (
                      <div className="h-[180px] sm:h-[240px] md:h-[280px] rounded-2xl sm:rounded-3xl border border-[#BDAF62]/20 bg-[#3E2B26]/60" />
                    ) : (
                      <SpotlightCard className="h-[180px] sm:h-[240px] md:h-[280px]">
                        <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col justify-between">
                          <div>
                            {/* Quote Icon */}
                            <div className="mb-2 sm:mb-4 text-[#BDAF62]">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                              </svg>
                            </div>

                            <p className="text-sm sm:text-lg md:text-2xl text-[#F2EDE4] leading-relaxed line-clamp-3">
                              {testimonial.quote}
                            </p>
                          </div>

                          {/* Author - Bottom Right */}
                          <div className="text-right">
                            <p className="font-bold text-white uppercase tracking-wider text-[10px] sm:text-xs md:text-sm">
                              {testimonial.clientName}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-[#BDAF62]/70 mt-0.5">
                              {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-2 sm:gap-3">
            <button
              onClick={handlePrev}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded border border-[#BDAF62]/30 flex items-center justify-center text-[#F2EDE4] hover:bg-[#BDAF62]/10 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded border border-[#BDAF62]/30 flex items-center justify-center text-[#F2EDE4] hover:bg-[#BDAF62]/10 transition-colors"
              aria-label="Next"
            >
              <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18L15 12L9 6" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
