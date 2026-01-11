"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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

  // Scroll-linked background transition
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Updated to Lighter Midnight Blue #13141f
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ["#F2F0E9", "#13141f", "#13141f", "#F2F0E9"]
  );

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
      {/* Animated background layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ backgroundColor }}
      />

      {/* Content */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">

          {/* Header */}
          <div className="mb-12">
            {label && (
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#d9f99d] text-black font-bold text-sm">3</span>
                <p className="font-bold uppercase tracking-wider text-[#d9f99d] text-sm">
                  {label}
                </p>
              </motion.div>
            )}
            <motion.h2
              className="font-sans text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white italic"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {heading}
            </motion.h2>
            <div className="h-px w-full bg-[#d9f99d]/30 mt-10" />
          </div>

          {/* Stacked Card Deck Layout - with entrance animation */}
          <motion.div
            className="relative w-full max-w-[850px] mx-auto h-[320px] md:h-[360px] flex justify-center mb-12"
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
                      <div className="h-[280px] rounded-3xl border border-white/15 bg-[#1a1b26]/60" />
                    ) : (
                      <SpotlightCard className="h-[280px]">
                        <div className="p-8 h-full flex flex-col justify-between">
                          <div>
                            {/* Quote Icon */}
                            <div className="mb-4 text-gray-400">
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                              </svg>
                            </div>

                            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed line-clamp-3">
                              {testimonial.quote}
                            </p>
                          </div>

                          {/* Author - Bottom Right */}
                          <div className="text-right">
                            <p className="font-bold text-white uppercase tracking-wider text-sm">
                              {testimonial.clientName}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5">
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
          <div className="flex justify-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18L15 12L9 6" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
