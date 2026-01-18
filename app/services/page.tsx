'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/SectionReveal';
import { getSiteSettings } from '@/lib/content';
import { api } from '@/lib/api';

import Hero from '@/components/Hero-services';
import ArchesServicesSection from '@/components/ArchesServicesSection';
import NewsletterSection from '@/components/NewsletterSection';

gsap.registerPlugin(ScrollTrigger);

// --- STRICT PATTERN: Vertical -> Horizontal -> Vertical (PRESERVED) ---
const BASE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92", cls: "aspect-[3/4] w-[180px] sm:w-[250px] md:w-[350px]" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", cls: "aspect-[16/9] w-[280px] sm:w-[400px] md:w-[600px]" },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", cls: "aspect-[3/4] w-[180px] sm:w-[250px] md:w-[350px]" },
  { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc", cls: "aspect-[16/9] w-[280px] sm:w-[400px] md:w-[600px]" },
  { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace", cls: "aspect-[3/4] w-[180px] sm:w-[250px] md:w-[350px]" },
  { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6", cls: "aspect-[16/9] w-[280px] sm:w-[400px] md:w-[600px]" },
];

const ROW_DATA = [...BASE_IMAGES, ...BASE_IMAGES, ...BASE_IMAGES];

const SplitText = ({ children, className }: { children: string, className?: string }) => (
  <h2 className={`reveal-container ${className}`}>
    {children.split(" ").map((word, i) => (
      <span key={i} className="reveal-word inline-block mr-[0.25em] opacity-15">
        {word}
      </span>
    ))}
  </h2>
);

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getServicesPage();
        if (response.success && response.data) {
          setContent(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch services page content:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // TEXT REVEAL LOGIC
      const allRevealWords = document.querySelectorAll(".reveal-word");
      allRevealWords.forEach((word) => {
        gsap.to(word, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: word,
            start: "top 90%", // FIX: Triggers earlier
            end: "top 60%",   // FIX: Finishes earlier
            scrub: 1,
          }
        });
      });

      // GALLERY MOVEMENT
      gsap.to("#row-1", {
        xPercent: -15,
        ease: "none",
        scrollTrigger: { trigger: ".gallery-section", scrub: 1.5 }
      });

      gsap.to("#row-2", {
        xPercent: 15,
        ease: "none",
        scrollTrigger: { trigger: ".gallery-section", scrub: 1.5 }
      });

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [content]); // Re-run GSAP when content loads

  // Default fallbacks for text sections
  const defaultStatementA = `Effortlessly sustainable.
The perfect living space.
Built just like in your mind.
Timelessly modern.`;

  const defaultStatementB = `Your narrative is unfolding.
Strategic clarity.
Bold, authentic.
Let's turn your vision into reality.`;

  const statementAText = content?.statementA?.text || defaultStatementA;
  const statementBText = content?.statementB?.text || defaultStatementB;

  return (
    <div className="w-full bg-[#F2F0E9] overflow-x-hidden">
      {/* HERO SECTION - Isolated from motion wrapper to fix GSAP Pinning */}
      <Hero
        text={content?.hero?.text}
        videoUrl={content?.hero?.video?.url}
      />

      <motion.div
        ref={containerRef}
        className="w-full h-auto text-[#2c2420]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >

        {/* NEW MARCHES TRIO SECTION */}
        <ArchesServicesSection />

        {/* TEXT SECTION 1 - FIX: Reduced Padding to close gap */}
        <section className="px-4 sm:px-6 md:px-20 pt-8 sm:pt-10 pb-12 sm:pb-20 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto">
            {/* Desktop/Tablet - 4 Lines */}
            <div className="hidden sm:block space-y-3 sm:space-y-6">
              {statementAText.split('\n').map((line: string, index: number) => (
                <SplitText key={index} className={`text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.05] ${index === 2 ? 'italic' : ''}`}>
                  {line}
                </SplitText>
              ))}
            </div>

            {/* Mobile - 2 Lines */}
            <div className="block sm:hidden space-y-6">
              <SplitText className="text-lg font-serif leading-[1.2]">
                {statementAText.split('\n').slice(0, 2).join(' ')}
              </SplitText>
              <SplitText className="text-lg font-serif leading-[1.2] italic">
                {statementAText.split('\n').slice(2, 4).join(' ')}
              </SplitText>
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className="gallery-section py-8 sm:py-16 w-full relative flex flex-col gap-4 sm:gap-8">
          <div id="row-1" className="flex gap-4 sm:gap-8 w-[800%] sm:w-[600%]">
            {ROW_DATA.map((img, i) => (
              <div key={`r1-${i}`} className={`relative bg-gray-300 flex-shrink-0 overflow-hidden ${img.cls}`}>
                <img src={`${img.url}?q=80&w=800&auto=format&fit=crop`} alt="" className="w-full h-full object-cover transition duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
          <div id="row-2" className="flex gap-4 sm:gap-8 w-[800%] sm:w-[600%] -ml-[350%] sm:-ml-[250%]">
            {ROW_DATA.map((img, i) => (
              <div key={`r2-${i}`} className={`relative bg-gray-300 flex-shrink-0 overflow-hidden ${img.cls}`}>
                <img src={`${img.url}?q=80&w=800&auto=format&fit=crop`} alt="" className="w-full h-full object-cover transition duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </section>

        {/* TEXT SECTION 2 - FIX: Updated Copy & CTA */}
        <section className="px-4 sm:px-6 md:px-20 pt-12 sm:pt-20 pb-6 sm:pb-10 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto mb-10 sm:mb-20">
            {/* Desktop/Tablet - 4 Lines */}
            <div className="hidden sm:block space-y-3 sm:space-y-6">
              {statementBText.split('\n').map((line: string, index: number) => (
                <SplitText key={index} className={`text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.05] ${index === 2 ? 'italic' : ''}`}>
                  {line}
                </SplitText>
              ))}
            </div>

            {/* Mobile - 2 Lines */}
            <div className="block sm:hidden space-y-6">
              <SplitText className="text-lg font-serif leading-[1.2]">
                {statementBText.split('\n').slice(0, 2).join(' ')}
              </SplitText>
              <SplitText className="text-lg font-serif leading-[1.2] italic">
                {statementBText.split('\n').slice(2, 4).join(' ')}
              </SplitText>
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full border-t border-[#2c2420]/20 pt-6 sm:pt-8 flex justify-between items-center">
            <span className="uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm font-medium">About Us</span>
            <Link href="/contact" className="group relative inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center overflow-hidden rounded-full border border-[#2c2420]/30 bg-transparent transition-all duration-300 sm:hover:w-32 hover:bg-[#2c2420] hover:text-[#F2F0E9]">
              <div className="absolute flex w-full items-center justify-center transition-all duration-300 sm:group-hover:translate-x-[150%]">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="absolute translate-x-[-150%] hidden sm:flex w-full items-center justify-center gap-2 transition-all duration-300 group-hover:translate-x-0">
                <span className="text-sm font-medium whitespace-nowrap pl-2">Contact</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </section>

        {/* NEW NEWSLETTER SECTION */}
        <NewsletterSection
          title={content?.newsletter?.title}
          description={content?.newsletter?.description}
        />

      </motion.div>
    </div>
  );
}
