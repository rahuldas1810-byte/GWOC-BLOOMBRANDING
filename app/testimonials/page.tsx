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

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsData = await getTestimonials();
      setTestimonials(testimonialsData);
    };
    fetchTestimonials();
  }, []);

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
        <section className="relative bg-white">
          <div className="flex min-h-screen">
            {/* Left Side - Sticky Anchor Image Container */}
            <div className="sticky top-0 w-1/2 h-screen bg-earl-gray/30 flex items-center justify-center p-12 md:p-16 lg:p-20">
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

            {/* Right Side - Scrollable Testimonials in Normal Document Flow */}
            <div className="w-1/2 bg-white">
              {testimonials.map((testimonial, index) => (
                <motion.section
                  key={testimonial.id}
                  className="min-h-screen flex items-center justify-center px-12 md:px-16 lg:px-20 py-20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <div className="max-w-2xl w-full">
                    {/* Testimonial Image (Optional) */}
                    {testimonial.image && (
                      <div className="mb-12 md:mb-16">
                        <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden bg-dark-choc/5">
                          <Image
                            src={testimonial.image}
                            alt={`${testimonial.clientName} from ${testimonial.company}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 28rem"
                          />
                        </div>
                      </div>
                    )}

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
                </motion.section>
              ))}
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
