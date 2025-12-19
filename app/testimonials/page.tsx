"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import { getTestimonials } from "@/lib/content";
import type { Testimonial } from "@/types";

// Maximum number of testimonials to support (prevents hook order issues)
const MAX_TESTIMONIALS = 10;

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsData = await getTestimonials();
      setTestimonials(testimonialsData);
    };
    fetchTestimonials();
  }, []);

  // Smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Precompute all motion values at the top level
  // Always create MAX_TESTIMONIALS hooks to maintain hook order
  // Call hooks unconditionally - they will adapt to testimonials.length dynamically
  const imageOpacities = [
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 0;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 1;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 2;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 3;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 4;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 5;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 6;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 7;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 8;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 9;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      if (sectionProgress < 0.2) return sectionProgress / 0.2;
      if (sectionProgress > 0.8) return 1 - (sectionProgress - 0.8) / 0.2;
      return 1;
    }),
  ];

  const imageScales = [
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 0;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 1;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 2;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 3;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 4;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 5;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 6;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 7;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 8;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0.98;
      const index = 9;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0.98;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return 0.98 + Math.sin(sectionProgress * Math.PI) * 0.02;
    }),
  ];

  const testimonialYs = [
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 0;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 1;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 2;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 3;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 4;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 5;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 6;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 7;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 8;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 9;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Move inactive testimonials further out of view
        return latest < sectionStart ? 100 : -100;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Subtle upward motion when active
      return -Math.sin(sectionProgress * Math.PI) * 10;
    }),
  ];

  const testimonialOpacities = [
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 0;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 1;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 2;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 3;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 4;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 5;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 6;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 7;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 8;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 9;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) {
        // Completely hide inactive testimonials
        return 0;
      }
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      // Smooth fade in/out at edges
      if (sectionProgress < 0.2) {
        return sectionProgress / 0.2;
      }
      if (sectionProgress > 0.8) {
        return 1 - (sectionProgress - 0.8) / 0.2;
      }
      return 1;
    }),
  ];

  const quoteYs = [
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 0;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 1;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 2;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 3;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 4;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 5;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 6;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 7;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 8;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
    useTransform(smoothProgress, (latest) => {
      if (testimonials.length === 0) return 0;
      const index = 9;
      const sectionStart = index / testimonials.length;
      const sectionEnd = (index + 1) / testimonials.length;
      if (latest < sectionStart || latest > sectionEnd) return 0;
      const sectionProgress =
        (latest - sectionStart) / (sectionEnd - sectionStart);
      return -Math.sin(sectionProgress * Math.PI) * 8;
    }),
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-32 md:py-40 lg:py-48 bg-earl-gray">
        <div className="container-custom">
          <SectionReveal>
            <div className="max-w-4xl">
              <p className="label-text mb-8">Client Stories</p>
              <h1 className="heading-1 mb-10">Testimonials</h1>
              <p className="body-text max-w-2xl">
                Hear from companies who&apos;ve worked with us to build their
                brand identity.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Split-Screen Testimonials Section */}
      {testimonials.length > 0 && (
        <section
          ref={containerRef}
          className="relative bg-white"
          style={{ height: `${testimonials.length * 100}vh` }}
        >
          <div className="sticky top-0 h-screen flex overflow-hidden">
            {/* Left Side - Sticky Anchor Image Container */}
            <div className="w-1/2 h-full bg-earl-gray/30 flex items-center justify-center p-12 md:p-16 lg:p-20">
              <div className="relative w-full h-full max-w-2xl">
                {/* Static Anchor Image */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg bg-dark-choc/5">
                  <Image
                    src="/testimonials/anchor.jpg"
                    alt="Testimonials anchor image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Scrollable Testimonials */}
            <div className="w-1/2 h-full bg-white overflow-y-auto">
              <div className="relative">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    className="min-h-screen flex items-center justify-center px-12 md:px-16 lg:px-20 py-20"
                    style={{
                      y: testimonialYs[index],
                      opacity: testimonialOpacities[index],
                    }}
                  >
                    <div className="max-w-2xl w-full">
                      {/* Quote */}
                      <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark-choc mb-12 md:mb-16 leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>

                      {/* Author Block */}
                      <div className="mt-8 md:mt-12">
                        <p className="font-serif text-xl md:text-2xl text-dark-choc mb-1 font-medium">
                          {testimonial.clientName}
                        </p>
                        <p className="font-sans text-sm md:text-base text-dark-choc/60">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <SectionReveal>
        <section className="py-32 md:py-40 lg:py-48 bg-electric-blue">
          <div className="container-custom">
            <div className="max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-8">
                Your Story Next
              </p>
              <h2
                className="font-serif text-white font-normal mb-12"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  lineHeight: 1.05,
                }}
              >
                Ready to build
                <br />
                your brand?
              </h2>
              <Link
                href="/contact"
                className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-electric-blue bg-white px-10 py-5 hover:bg-earl-gray transition-colors duration-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}
