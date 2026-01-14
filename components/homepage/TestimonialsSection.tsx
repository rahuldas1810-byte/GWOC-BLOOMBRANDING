"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Screen size detection
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth > 0 && windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Handle Next/Prev
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Swipe handlers
  const onDragEnd = (event: any, info: any) => {
    if (info.offset.x < -100) handleNext();
    else if (info.offset.x > 100) handlePrev();

    // Vertical swipe support for mobile/tablet stacking
    if (isMobile || isTablet) {
      if (info.offset.y < -100) handleNext();
      else if (info.offset.y > 100) handlePrev();
    }
  };

  // Auto-play logic
  useEffect(() => {
    if (isHovered || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, testimonials.length, handleNext]);

  if (testimonials.length === 0) return null;

  // We want to show a limited number of cards in the stack for visual clarity
  // but allow them to loop infinitely.
  // The active card is in the center-front.
  // Others are fanned out behind it.

  const getCardStyles = (index: number) => {
    // Distance from active index (taking looping into account)
    let distance = index - activeIndex;

    // Normalize distance for circular logic
    if (distance > testimonials.length / 2) distance -= testimonials.length;
    if (distance < -testimonials.length / 2) distance += testimonials.length;

    const absDistance = Math.abs(distance);
    const isActive = distance === 0;

    // Limits: only show few cards in the fan
    const isVisible = absDistance <= 2;

    if (!isVisible) return { opacity: 0, scale: 0.8, x: 0, y: 0, rotate: 0, zIndex: 0, pointerEvents: "none" as const };

    // Fanning/Stacking Factors
    let rotationFactor = 8;
    let xFactor = 50;
    let yFactor = 10;
    let baseOpacity = 0.7;

    if (isMobile) {
      rotationFactor = 3;
      xFactor = 0;
      yFactor = 40; // More pronounced vertical stack
      baseOpacity = 0.4;
    } else if (isTablet) {
      rotationFactor = 5;
      xFactor = 30; // Mild horizontal fan
      yFactor = 20;
      baseOpacity = 0.5;
    }

    return {
      opacity: isActive ? 1 : Math.max(0, baseOpacity - (absDistance * 0.15)),
      scale: isActive ? 1.05 : 1 - (absDistance * 0.08),
      x: isMobile ? 0 : distance * xFactor,
      y: isMobile ? distance * yFactor : (isTablet ? distance * yFactor : absDistance * yFactor),
      rotate: distance * rotationFactor,
      zIndex: 30 - absDistance,
      filter: isActive ? "blur(0px)" : `blur(${absDistance * 2}px)`,
      pointerEvents: (isActive || absDistance <= 1) ? "auto" as const : "none" as const, // Prevents clicking far cards
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F9F7F2] py-12 sm:py-16 border-y border-[#BDAF62]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">

        {/* Header */}
        <div className="mb-10 md:mb-12 text-center">
          <motion.div
            className="flex items-center justify-center gap-2 sm:gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#BDAF62] text-white font-bold text-[10px]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
            </span>
            <p className="font-bold uppercase tracking-widest text-[#BDAF62] text-[10px] sm:text-xs">
              {label}
            </p>
          </motion.div>
          <motion.h2
            className="font-sans text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter text-[#2A1F1A] italic uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {heading}
          </motion.h2>
        </div>

        {/* Stacked Fan Display */}
        <div className="relative w-full max-w-[900px] mx-auto h-[300px] xs:h-[350px] sm:h-[400px] md:h-[480px] flex justify-center items-center">
          <AnimatePresence initial={false}>
            {testimonials.map((testimonial, index) => {
              const styles = getCardStyles(index);

              if (styles.opacity === 0) return null;

              return (
                <motion.div
                  key={testimonial.id}
                  className="absolute w-full px-4 xs:px-0 max-w-[280px] xs:max-w-[320px] sm:max-w-[450px] md:max-w-[550px] cursor-pointer"
                  style={{
                    zIndex: styles.zIndex,
                    willChange: "transform, opacity, filter"
                  }}
                  drag={isDesktop ? "x" : true}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.15}
                  onDragEnd={onDragEnd}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{
                    opacity: styles.opacity,
                    scale: styles.scale,
                    x: styles.x,
                    y: styles.y,
                    rotate: styles.rotate,
                    filter: styles.filter,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                    mass: 0.8
                  }}
                  onClick={() => setActiveIndex(index)}
                  whileHover={index === activeIndex ? { scale: isMobile ? 1.05 : 1.08 } : { opacity: 0.9 }}
                >
                  <SpotlightCard
                    className="h-[200px] xs:h-[220px] sm:h-[260px] md:h-[300px] shadow-xl border border-[#BDAF62]/10"
                    innerClassName="bg-white"
                  >
                    <div className="p-5 xs:p-6 sm:p-8 md:p-10 h-full flex flex-col justify-between">
                      <div className="relative">
                        <span className="absolute -top-4 -left-4 text-4xl sm:text-5xl text-[#BDAF62]/20 font-serif pointer-events-none italic">"</span>
                        <p className="text-[11px] xs:text-xs sm:text-base md:text-xl text-[#2A1F1A] leading-relaxed font-bold italic relative z-10 px-2 line-clamp-4 xs:line-clamp-none">
                          {testimonial.quote}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#BDAF62]/20 pt-4 sm:pt-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-px h-5 sm:h-7 bg-[#BDAF62]/50" />
                          <div>
                            <p className="font-extrabold text-[#2A1F1A] uppercase tracking-wider text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs">
                              {testimonial.clientName}
                            </p>
                            <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-[#2A1F1A]/70 font-bold">
                              {testimonial.company}
                            </p>
                          </div>
                        </div>

                        <div className={`w-1.5 h-1.5 rounded-full ${index === activeIndex ? "bg-[#BDAF62] shadow-[0_0_8px_#BDAF62]" : "bg-[#2A1F1A]/10"}`} />
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-col items-center gap-6 mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="group w-11 h-11 rounded-full border border-[#BDAF62]/30 flex items-center justify-center text-[#2A1F1A] hover:bg-[#BDAF62] hover:text-white transition-all duration-300 active:scale-95"
              aria-label="Previous Testimonial"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${i === activeIndex ? "w-7 bg-[#BDAF62]" : "w-1.5 bg-[#BDAF62]/20 hover:bg-[#BDAF62]/40"}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="group w-11 h-11 rounded-full border border-[#BDAF62]/30 flex items-center justify-center text-[#2A1F1A] hover:bg-[#BDAF62] hover:text-white transition-all duration-300 active:scale-95"
              aria-label="Next Testimonial"
            >
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18L15 12L9 6" />
              </svg>
            </button>
          </div>

          {/* Accessibility Info */}
          {shouldReduceMotion && (
            <p className="text-[9px] uppercase tracking-widest text-[#BDAF62]/60">Motion reduced for your preference</p>
          )}
        </div>

      </div>

      {/* Decorative background elements consistent with light theme */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#BDAF62]/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2A1F1A]/5 rounded-full blur-[100px]" />
      </div>
    </section>
  );
}
