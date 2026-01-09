'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/SectionReveal';
import { getSiteSettings } from '@/lib/content';
import Hero from '@/components/Hero-services';

gsap.registerPlugin(ScrollTrigger);

// --- STRICT PATTERN: Vertical -> Horizontal -> Vertical (PRESERVED) ---
const BASE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92", cls: "aspect-[3/4] w-[300px] md:w-[350px]" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", cls: "aspect-[16/9] w-[500px] md:w-[600px]" },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", cls: "aspect-[3/4] w-[300px] md:w-[350px]" },
  { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc", cls: "aspect-[16/9] w-[500px] md:w-[600px]" },
  { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace", cls: "aspect-[3/4] w-[300px] md:w-[350px]" },
  { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6", cls: "aspect-[16/9] w-[500px] md:w-[600px]" },
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
  const [hero, setHero] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const settingsData = await getSiteSettings();
      if (settingsData?.servicesHero) {
        setHero(settingsData.servicesHero);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
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
  }, []);

  return (
    <div ref={containerRef} className="bg-[#F2F0E9] min-h-screen text-[#2c2420] overflow-x-hidden">

      {/* HERO SECTION */}
      <Hero />

      {/* TEXT SECTION 1 - FIX: Reduced Padding to close gap */}
      <section className="px-6 md:px-20 pt-10 pb-20 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto space-y-6">
          <SplitText className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05]">
            Effortlessly sustainable.
          </SplitText>
          <SplitText className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05]">
            The perfect living space.
          </SplitText>
          <SplitText className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05] italic">
            Built just like in your mind.
          </SplitText>
          <SplitText className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05]">
            Timelessly modern.
          </SplitText>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery-section py-16 w-full relative flex flex-col gap-8">
        <div id="row-1" className="flex gap-8 w-[600%]">
          {ROW_DATA.map((img, i) => (
            <div key={`r1-${i}`} className={`relative bg-gray-300 flex-shrink-0 overflow-hidden ${img.cls}`}>
              <img src={`${img.url}?q=80&w=800&auto=format&fit=crop`} alt="" className="w-full h-full object-cover transition duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
        <div id="row-2" className="flex gap-8 w-[600%] -ml-[250%]">
          {ROW_DATA.map((img, i) => (
            <div key={`r2-${i}`} className={`relative bg-gray-300 flex-shrink-0 overflow-hidden ${img.cls}`}>
              <img src={`${img.url}?q=80&w=800&auto=format&fit=crop`} alt="" className="w-full h-full object-cover transition duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* TEXT SECTION 2 - FIX: Updated Copy & CTA */}
      <section className="px-6 md:px-20 pt-20 pb-10 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto space-y-6 mb-20">
          {/* UPDATED BRANDING COPY */}
          <SplitText className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05]">
            Your narrative is unfolding.
          </SplitText>
          <SplitText className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05]">
            Strategic clarity.
          </SplitText>
          <SplitText className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05] italic">
            Bold, authentic.
          </SplitText>
          <SplitText className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05]">
            Let’s turn your vision into reality.
          </SplitText>
        </div>

        <div className="max-w-7xl mx-auto w-full border-t border-[#2c2420]/20 pt-8 flex justify-between items-center">
          <span className="uppercase tracking-[0.2em] text-sm font-medium">About Us</span>
          <Link href="/contact" className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#2c2420]/30 bg-transparent transition-all duration-300 hover:w-32 hover:bg-[#2c2420] hover:text-[#F2F0E9]">
            <div className="absolute flex w-full items-center justify-center transition-all duration-300 group-hover:translate-x-[150%]">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div className="absolute translate-x-[-150%] flex w-full items-center justify-center gap-2 transition-all duration-300 group-hover:translate-x-0">
              <span className="text-sm font-medium whitespace-nowrap pl-2">Contact</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </section>

      {/* FIX: Increased Bottom Spacer to 50vh to ensure text scrolls into view */}
      <div className="h-[50vh]"></div>

    </div>
  );
}
