"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import { getTestimonials } from "@/lib/content";
import type { Testimonial } from "@/types";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsData = await getTestimonials();
      setTestimonials(testimonialsData);
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] w-full overflow-hidden">
        <div className="relative h-screen">

          {/* Background Image */}
          <Image
            src="/testimonials/hero.jpg"
            alt="Client workspace"
            fill
            priority
            className="object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom w-full px-10">
              <div className="max-w-5xl text-left text-white [&_*]:test-white">

                <p className="text-sm font-semibold tracking-[0.3em] uppercase mb-6 text-white">
                  Testimonials
                </p>

                <h1 className="font-serif font-medium text-[clamp(3.2rem,5.5vw,4.2rem)] leading-[1.15] mb-6 text-white">
                  Hear from companies who have worked with us to build their brand identity.
                </h1>

                <p className="text-base md:text-lg max-w-xl opacity-80 mb-10 text-white">
                  Hear from companies who have worked with us to build their brand identity.
                </p>

                <button className="px-12 py-5 border border-white/70 rounded-full text-sm font-medium tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                  Client Stories
                </button>

              </div>
            </div>
          </div>

          {/* Scroll Arrow */}
          <motion.button
            onClick={() => {
              document
                .getElementById("client-reviews")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            animate={{y:[0,8,0]}}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="absolute bottom-20 right-20 w-20 h-20 rounded-full border border-white/60 flex items-center justify-center text-white hover:border-white hover:scale-105 transition-transform duration-300"
          >
            <span className="text-2xl">↓</span>

          </motion.button>

        </div>
      </section>

      {/* ================= SPLIT TESTIMONIALS ================= */}
      {testimonials.length > 0 && (
        <section id="client-reviews" className="relative bg-white">
          <div className="flex min-h-screen">

            {/* Left Sticky Image */}
            <div className="sticky top-0 w-[55%] h-screen bg-earl-gray/30 flex items-center justify-center p-12 md:p-16 lg:p-20">
              <div className="relative w-full h-full pr-24">

                {testimonials.map((testimonial, index) => {
                  if (!testimonial.image) return null;

                  return (
                    <motion.div
                      key={testimonial.id}
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
                      initial={{ opacity: index === 0 ? 1 : 0 }}
                      animate={{ opacity: index === activeIndex ? 1 : 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="group relative w-full h-full">
                        <Image
                          src={testimonial.image}
                          alt={`${testimonial.clientName} from ${testimonial.company}`}
                          fill
                          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0}
                        />
                      </div>
                    </motion.div>
                  );
                })}

              </div>
            </div>

            {/* Right Scroll Content */}
            <div className="w-1/2 bg-white">
              {testimonials.map((testimonial, index) => (
                <motion.section
                  key={testimonial.id}
                  className="min-h-screen flex items-center px-16 py-20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  onViewportEnter={() => setActiveIndex(index)}
                  viewport={{ amount: 0.6 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="w-full">
                    <p className="font-serif text-xl md:text-2xl lg:text-3xl text-dark-choc mb-12 leading-tight">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    <div>
                      <p className="font-serif text-xl md:text-2xl text-dark-choc mb-2">
                        {testimonial.clientName}
                      </p>
                      <p className="font-mono text-xs uppercase tracking-[0.15em] text-dark-choc/50">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ================= FINAL CTA ================= */}
      <SectionReveal>
        <section className="py-32 md:py-40 lg:py-48 bg-electric-blue">
          <div className="container-custom">
            <div className="max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-8">
                Your Story Next
              </p>
              <h2 className="font-serif text-white mb-12 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05]">
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
