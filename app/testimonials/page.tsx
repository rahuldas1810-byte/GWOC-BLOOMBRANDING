"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import { getTestimonials, getBrands, getSiteSettings } from "@/lib/content";
import type { Testimonial } from "@/types";
import SliceReveal from "@/components/SliceReveal";
import MagneticButton from "@/components/MagneticButton";
import TestimonialsCTA from "@/components/TestimonialsCTA";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsData, brandsData, settings] = await Promise.all([
          getTestimonials(),
          getBrands(),
          getSiteSettings(),
        ]);
        setTestimonials(testimonialsData || []);
        setBrands(brandsData || []);
        setSiteSettings(settings);

        // Set first category if brands exist
        if (brandsData && brandsData.length > 0) {
          const categories = Array.from(
            new Set(brandsData.map((b: any) => b.category).filter(Boolean))
          ) as string[];
          if (categories.length > 0) {
            setActiveCategory(categories[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching testimonials page data:', error);
      }
    };
    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Group brands by category
  const brandData = (brands || []).reduce((acc: any, brand: any) => {
    if (!brand) return acc;
    const category = brand.category || 'OTHER';
    if (!acc[category]) {
      acc[category] = [];
    }
    const imageUrl = brand.image?.url || brand.logo?.url || brand.image || brand.logo || '/brands/default.jpg';
    acc[category].push({
      name: brand.name || 'Unknown Brand',
      label: brand.description || brand.name || 'Brand',
      image: imageUrl,
    });
    return acc;
  }, {} as Record<string, any[]>);

  const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const heroContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.25,
      },
    },
  };

  const cardContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[60vh] md:min-h-[85vh] w-full overflow-hidden">
        <div className="relative h-[60vh] md:h-screen min-h-[400px]">
          {/* Slice Reveal Background */}
          <SliceReveal />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/55 z-10 pointer-events-none" />

          {/* Text Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container-custom px-4 sm:px-6 md:px-16 lg:px-24">
              <motion.div
                className="max-w-5xl text-left text-white [&_*]:text-white"
                variants={heroContainer}
                initial="hidden"
                animate="show"
              >
                {/* Small label */}
                <motion.p
                  variants={heroItem}
                  className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.35em] uppercase mb-6 md:mb-10 opacity-70 text-white"
                >
                  {siteSettings?.testimonialsHero?.label || 'Our Partners'}
                </motion.p>

                {/* MAIN heading */}
                <motion.h1
                  variants={heroItem}
                  className="font-serif text-[clamp(2.5rem,8vw,8rem)] leading-[0.98] mb-6 md:mb-10 text-white px-2 sm:px-0"
                >
                  {siteSettings?.testimonialsHero?.title || 'Testimonials'}
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={heroItem}
                  className="text-base sm:text-lg md:text-xl max-w-xl opacity-90 mb-8 md:mb-14 text-white px-2 sm:px-0"
                >
                  {siteSettings?.testimonialsHero?.description || 'Hear from companies who have worked with us to build their brand identity.'}
                </motion.p>

                {/* Button */}
                <motion.div variants={heroItem} className="px-2 sm:px-0">
                  <MagneticButton className="px-8 sm:px-10 md:px-14 py-4 sm:py-5 md:py-6 border border-white/60 rounded-full text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                    {siteSettings?.testimonialsHero?.buttonText || 'Client Stories'}
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </div>
          </div>


        </div>
      </section>

      {/* ================= BRAND CATEGORIES ================= */}
      {Object.keys(brandData).length > 0 && (
        <section className="py-12 md:py-24 bg-earl-gray overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar justify-start sm:justify-center gap-3 sm:gap-4 md:gap-6 mb-10 md:mb-14 -mt-4 md:-mt-8 px-4 sm:px-6">
            {Object.keys(brandData).map((category) => {
              const categoryKey = category as string;
              const isActive = activeCategory === categoryKey;

              return (
                <motion.button
                  key={categoryKey}
                  onClick={() => setActiveCategory(categoryKey)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all duration-300 font-medium
                    ${isActive
                      ? "bg-dark-choc text-white shadow-md"
                      : "border border-dark-choc/30 text-dark-choc hover:border-dark-choc hover:bg-dark-choc/5"
                    }
                  `}
                >
                  {categoryKey}
                </motion.button>
              );
            })}
          </div>

          {/* Brand Cards */}
          {activeCategory && brandData[activeCategory] && brandData[activeCategory].length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                variants={cardContainer}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 md:gap-14 max-w-7xl xl:max-w-[85rem] mx-auto px-4 sm:px-6"
              >
                {brandData[activeCategory].map((brand: any) => (
                  <motion.div
                    key={brand.name}
                    variants={cardItem}
                    className="text-center group"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {/* Image */}
                    <div className="relative w-full h-[220px] sm:h-[300px] md:h-[460px] rounded-xl overflow-hidden bg-dark-choc/10 mb-3 md:mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      {brand.image && (
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                          unoptimized={typeof brand.image === 'string' && brand.image.startsWith('http') || false}
                          onError={(e) => {
                            console.error('Error loading brand image:', brand.image);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}

                      {/* Soft overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>

                    {/* Brand Name (clickable) */}
                    <Link
                      href="#"
                      className="block font-serif text-xl text-dark-choc hover:text-electric-blue transition-colors duration-300 group-hover:translate-y-[-2px] inline-block"
                    >
                      {brand.name}
                    </Link>

                    {/* Small Label */}
                    <p className="mt-2 text-sm tracking-wide text-dark-choc/60">
                      {brand.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          <div className="h-6 md:h-10" />
        </section>
      )}

      {/* ================= SPLIT TESTIMONIALS ================= */}
      {testimonials.length > 0 && (
        <section id="client-reviews" className="relative bg-white pb-0">
          <div className="flex flex-col lg:flex-row relative">
            {/* Left Sticky Image - Sticky on both mobile (Top) and desktop (Left) */}
            <div className="flex sticky top-0 lg:top-[20vh] w-full lg:w-[55%] h-[45vh] sm:h-[50vh] lg:h-[60vh] bg-earl-gray items-center justify-center p-4 sm:p-6 md:p-16 lg:p-20 z-20 lg:z-auto shadow-sm lg:shadow-none">
              <div className="relative w-full h-full lg:pr-24">
                {testimonials.map((testimonial, index) => {
                  if (!testimonial || !testimonial.image) return null;

                  const imageUrl = typeof testimonial.image === 'string'
                    ? testimonial.image
                    : (testimonial.image as any)?.url || '';

                  if (!imageUrl) return null;

                  return (
                    <motion.div
                      key={testimonial.id || index}
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
                      initial={{ opacity: index === 0 ? 1 : 0 }}
                      animate={{ opacity: index === activeIndex ? 1 : 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="group relative w-full h-full">
                        <Image
                          src={imageUrl}
                          alt={`${testimonial.clientName || 'Client'} from ${testimonial.company || 'Company'}`}
                          fill
                          className="object-contain object-center transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0}
                          unoptimized={imageUrl.startsWith('http') || false}
                          onError={(e) => {
                            console.error('Error loading testimonial image:', imageUrl);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Scroll Content */}
            <div className="w-full lg:w-1/2 bg-transparent lg:bg-white relative z-10">
              {testimonials.map((testimonial, index) => {
                if (!testimonial) return null;
                return (
                  <motion.section
                    key={testimonial.id || index}
                    className="min-h-[50vh] lg:min-h-[60vh] flex items-center px-6 sm:px-8 md:px-16 py-12 sm:py-16 lg:py-20 scroll-mt-24 bg-white lg:bg-transparent rounded-t-[2.5rem] lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-none mb-12 lg:mb-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    onViewportEnter={() => setActiveIndex(index)}
                    viewport={{ amount: 0.5, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="w-full">

                      <p className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-dark-choc mb-6 sm:mb-8 lg:mb-12 leading-tight">
                        &ldquo;{testimonial.quote || 'No quote available'}&rdquo;
                      </p>

                      <div>
                        <p className="font-serif text-base sm:text-lg md:text-2xl text-dark-choc mb-1 sm:mb-2">
                          {testimonial.clientName || 'Anonymous'}
                        </p>
                        <p className="font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em] text-dark-choc/50">
                          {testimonial.company || 'Company'}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= NEW CTA SECTION ================= */}
      <TestimonialsCTA />
    </div>
  );
}
