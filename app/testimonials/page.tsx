"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import { getTestimonials } from "@/lib/content";
import type { Testimonial } from "@/types";
import SliceReveal from "@/components/SliceReveal";
import MagneticButton from "@/components/MagneticButton";


export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<BrandCategory>("JEWELLERY");

const brandData = {
  JEWELLERY: [
    { name: "Dhruv Gems", label: "Luxury jewellery brand", image: "/brands/dhruv.jpg" },
    { name: "AMBC Gems", label: "Fine diamond jewellery", image: "/brands/ambc.jpg" },
    { name: "Vardhaman Diam", label: "Diamond brand", image: "/brands/vardhaman.jpg" },
  ],
  FASHION: [
    { name: "The Right Cut", label: "Contemporary fashion label", image: "/brands/the-right-cut.jpg" },
    { name: "Binal Patel", label: "Designer wear brand", image: "/brands/binal-patel.jpg" },
    { name: "Mansi Nagdev", label: "Ethnic fashion brand", image: "/brands/mansi-nagdev.jpg" },
  ],
  "CAFE & RESTAURANTS": [
    { name: "Thyme and Whisk", label: "Cafe & bistro", image: "/brands/thyme.jpg" },
    { name: "KAFFYN", label: "Specialty coffee brand", image: "/brands/kaffyn.jpg" },
    { name: "Amar Fastfood Center", label: "Quick service restaurant", image: "/brands/amar.jpg" },
  ],
  "HOME FURNISHING": [
    { name: "Fine Decor", label: "Home decor brand", image: "/brands/fine-decor.jpg" },
    { name: "Moire Rugs", label: "Handcrafted rugs", image: "/brands/moire-rugs.jpg" },
    { name: "Bafna Marble", label: "Luxury marble & stone", image: "/brands/bafna-marble.jpg" },
  ],
  LIFESTYLE: [
    { name: "Life’s A Beach", label: "Lifestyle brand", image: "/brands/beach.jpg" },
    { name: "ShoP", label: "Concept retail brand", image: "/brands/shop.jpg" },
    { name: "B’there", label: "Innerwear brand", image: "/brands/bthere.jpg" },
  ],
} as const;

type BrandCategory = keyof typeof brandData;

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsData = await getTestimonials();
      setTestimonials(testimonialsData);
    };
    fetchTestimonials();
  }, []);

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
      <section className="relative min-h-[85vh] w-full overflow-hidden mt-20 lg:mt-24">
        <div className="relative h-screen">

          {/* Slice Reveal Background */}
          <SliceReveal />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/55 z-10 pointer-events-none" />

          {/* Text Content */}
          {/* Text Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container-custom px-16 md:px-24">
              <motion.div
                className="max-w-5xl text-left text-white [&_*]:text-white"
                variants={heroContainer}
                initial="hidden"
                animate="show"
              >

      {/* Small label */}
      <motion.p
       variants={heroItem}
       className="text-[11px] tracking-[0.35em] uppercase mb-10 opacity-70 text-white"
       >
        Our Partners
      </motion.p>

                {/* MAIN heading */}
                <motion.h1 variants={heroItem}
                  className="font-serif text-[clamp(4.5rem,8vw,8rem)] leading-[0.98] mb-10 text-white">
                  Testimonials
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={heroItem}
                  className="text-lg md:text-xl max-w-xl opacity-90 mb-14 text-white">
                  Hear from companies who have worked with us to build their brand identity.
                </motion.p>

                {/* Button */}
                <motion.div variants={heroItem}>
                  <MagneticButton
                    className="px-14 py-6 border border-white/60 rounded-full text-[11px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                    Client Stories
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Arrow */}
          <motion.button
            onClick={() => {
              document
                .getElementById("client-reviews")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.8,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
            }}
            className="absolute bottom-20 right-20 z-20 w-20 h-20 rounded-full border border-white/60 flex items-center justify-center text-white hover:border-white hover:scale-105 transition-transform duration-300"
          >
            <span className="text-2xl">↓</span>

          </motion.button>

        </div>
      </section>

      {/* ================= BRAND CATEGORIES ================= */}
<section className="py-24 bg-earl-gray">
  <div className="flex justify-center gap-6 mb-14 -mt-8">
  {(Object.keys(brandData) as BrandCategory[]).map((category) => {
    const isActive = activeCategory === category;

    return (
      <button
        key={category}
        onClick={() => setActiveCategory(category)}
        className={`px-7 py-2.5 rounded-full text-[11px] tracking-[0.25em] uppercase transition-all duration-300
          ${
            isActive
              ? "bg-dark-choc text-white"
              : "border border-dark-choc/30 text-dark-choc hover:border-dark-choc"
          }
        `}
      >
        {category}
      </button>
    );
  })}
</div>


    {/* Brand Cards */}
    <AnimatePresence mode="wait">
  <motion.div
    key={activeCategory}
    variants={cardContainer}
    initial="hidden"
    animate="show"
    exit="hidden"
    className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-7xl xl:max-w-[85rem] mx-auto px-6"
  >

      {brandData[activeCategory].map((brand) => (
        <motion.div
        key={brand.name}
        variants={cardItem}
        className="text-center"
      >

          {/* Image */}
          <div className="relative w-full h-[460px] rounded-xl overflow-hidden bg-dark-choc/10 mb-4">


            <Image
              src={brand.image}
              alt={brand.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

          </div>


          {/* Brand Name (clickable) */}
          <Link
            href="#"
            className="block font-serif text-xl text-dark-choc hover:underline transition-colors"

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
  <div className="h-6 md:h-10" />

</section>

      
      {/* ================= SPLIT TESTIMONIALS ================= */}
      {testimonials.length > 0 && (
        <section id="client-reviews" className="relative bg-white pb-20">
          <div className="flex relative">

            {/* Left Sticky Image */}
            <div className="sticky top-[20vh] w-[55%] h-[60vh] bg-earl-gray/30 flex items-center justify-center p-12 md:p-16 lg:p-20">
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
                          className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
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
                  className="min-h-[60vh] flex items-center px-16 py-20"
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



    </div>
  );
}
