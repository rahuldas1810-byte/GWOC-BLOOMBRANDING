'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Image from 'next/image';
import SectionReveal from '@/components/SectionReveal';
import { getSiteSettings } from '@/lib/content';

gsap.registerPlugin(ScrollTrigger);

// --- DATA: Mixed Aspect Ratios for "Random" Look ---
const ROW_1 = [
  { url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0", cls: "w-[300px] aspect-[3/4]" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", cls: "w-[450px] aspect-video" },
  { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3", cls: "w-[320px] aspect-square" },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", cls: "w-[280px] aspect-[4/5]" },
  { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc", cls: "w-[400px] aspect-video" },
];

const ROW_2 = [
  { url: "https://images.unsplash.com/photo-1600607687644-c7f32b50b5c2", cls: "w-[400px] aspect-video" },
  { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b", cls: "w-[280px] aspect-[3/4]" },
  { url: "https://images.unsplash.com/photo-1600210491892-db9c35d314f8", cls: "w-[350px] aspect-square" },
  { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6", cls: "w-[420px] aspect-video" },
  { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace", cls: "w-[300px] aspect-[3/4]" },
];

// --- COMPONENT: Text Splitter ---
const SplitText = ({ children, className }: { children: string, className?: string }) => {
  return (
    <h2 className={`reveal-container ${className}`}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="reveal-word inline-block mr-[0.25em] opacity-15">
          {word}
        </span>
      ))}
    </h2>
  );
};

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hero, setHero] = useState<any>(null);

  // 1. DATA FETCHING (Preserved for Hero)
  useEffect(() => {
    const fetchData = async () => {
      const settingsData = await getSiteSettings();
      if (settingsData?.servicesHero) {
        setHero(settingsData.servicesHero);
      }
    }
    fetchData();
    // Refresh interval
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 2. LENIS SETUP (Optimized for Next.js)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. GSAP CONTEXT (React Safe)
    const ctx = gsap.context(() => {
      
      // Text Reveal
      const textContainers = document.querySelectorAll(".reveal-container");
      textContainers.forEach((container) => {
        const words = container.querySelectorAll(".reveal-word");
        gsap.to(words, {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top 80%", 
                end: "top 30%",
                scrub: 1,
            }
        });
      });

      // Gallery Row 1 (Left)
      gsap.to("#row-1", {
        xPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: ".gallery-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
      
      // Gallery Row 2 (Right)
      gsap.to("#row-2", {
        xPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: ".gallery-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <main ref={containerRef} className="bg-[#F2F0E9] min-h-screen text-[#2c2420] overflow-hidden">
      
      {/* --- EXISTING HERO SECTION --- */}
      <section className="py-32 md:py-40 lg:py-48 bg-gradient-to-br from-earl-gray via-white to-butter-yellow/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(44,68,148,0.03),transparent_50%)] pointer-events-none"></div>
        <div className="container-custom relative z-10">
          <SectionReveal>
            <div className="max-w-5xl">
              <p className="font-mono text-electric-blue text-sm md:text-base mb-6 md:mb-8 uppercase tracking-[0.25em] font-semibold">
                {hero?.label || 'What We Do'}
              </p>
              <h1 className="font-serif text-dark-choc font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 md:mb-12 leading-[1.1] tracking-tight">
                {hero?.title || 'Our Services'}
              </h1>
              <p className="text-near-black/90 font-sans text-lg md:text-xl lg:text-2xl max-w-3xl leading-relaxed font-light">
                {hero?.description || 'Strategic branding services designed for companies ready to make an impact.'}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* TEXT SECTION 1 */}
      <section className="px-6 md:px-20 py-12 flex flex-col justify-center">
         <div className="max-w-7xl mx-auto space-y-4">
            <SplitText className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight">
              Effortlessly sustainable.
            </SplitText>
            <SplitText className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight">
              The perfect living space.
            </SplitText>
            <SplitText className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight text-[#8c857b] italic">
              Built just like in your mind.
            </SplitText>
            <SplitText className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight">
              Timelessly modern.
            </SplitText>
         </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery-section py-10 w-full relative">
         {/* Row 1 */}
         <div id="row-1" className="flex gap-6 mb-6 w-[150%] -ml-[10%]">
             {ROW_1.map((img, i) => (
                <div key={i} className={`relative bg-gray-300 flex-shrink-0 overflow-hidden ${img.cls}`}>
                   <img src={`${img.url}?q=80&w=800&auto=format&fit=crop`} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                </div>
             ))}
         </div>
         {/* Row 2 */}
         <div id="row-2" className="flex gap-6 w-[150%] -ml-[25%]">
             {ROW_2.map((img, i) => (
                <div key={i} className={`relative bg-gray-300 flex-shrink-0 overflow-hidden ${img.cls}`}>
                   <img src={`${img.url}?q=80&w=800&auto=format&fit=crop`} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                </div>
             ))}
         </div>
      </section>

      {/* TEXT SECTION 2 */}
      <section className="px-6 md:px-20 py-12 flex flex-col justify-center">
         <div className="max-w-7xl mx-auto space-y-4">
            <SplitText className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight">
              Things are shaping up.
            </SplitText>
            <SplitText className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight">
              Sturdily beautiful.
            </SplitText>
            <SplitText className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight text-[#8c857b]">
              Warm, bright.
            </SplitText>
            <SplitText className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight">
              Naturally comforting.
            </SplitText>
         </div>
      </section>

    </main>
  );
}
