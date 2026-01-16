'use client';

import { useRef, useEffect } from 'react';
import { motion, stagger } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Manrope, Prata } from 'next/font/google';

gsap.registerPlugin(ScrollTrigger);

const manrope = Manrope({ subsets: ['latin'], weight: ['300', '400', '500'] });
const prata = Prata({ subsets: ['latin'], weight: '400' });

export default function Hero({ text, videoUrl }: { text?: string; videoUrl?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitLayerRef = useRef<HTMLDivElement>(null);
  const patternLayerRef = useRef<HTMLSpanElement>(null);
  const leftDetailRef = useRef<HTMLDivElement>(null);
  const rightDetailRef = useRef<HTMLDivElement>(null);

  // Default Fallbacks
  const defaultText = `Bloom
Branding
manages projects
from preparation
to site for compact
homes to custom
superstructures.`;
  const displayText = text || defaultText;
  const defaultVideo = "https://videos.pexels.com/video-files/3205626/3205626-hd_1920_1080_25fps.mp4";
  const displayVideo = videoUrl || defaultVideo;

  // 1. NAVBAR FIX: Force white text IMMEDIATELY on load
  useEffect(() => {
    // Add class immediately when component mounts
    document.body.classList.add('nav-white');

    // Cleanup: remove class when user leaves this page
    return () => {
      document.body.classList.remove('nav-white');
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%', // Reduced from 250% for faster scroll (1-2 scrolls)
        // SCROLL LAG FIX: Set to 1 for smoother, interpolated response
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Animation Sequence
    tl.to(splitLayerRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 1,
      ease: 'none', // Linear ease prevents "fast then slow" feeling
    }, 0);

    tl.to(patternLayerRef.current, {
      opacity: 1,
      duration: 1,
      ease: 'none',
    }, 0);

    tl.to([leftDetailRef.current, rightDetailRef.current], {
      opacity: 0.6,
      duration: 1,
      ease: 'none'
    }, 0);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#4A3B32]">



      {/* Split Layer */}
      <div
        ref={splitLayerRef}
        className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row z-10 bg-[#4A3B32] will-change-[transform,opacity]"
      >
        {/* Left Side: Content */}
        {/* Mobile: w-full h-[55%] px-6 | Desktop: w-[45%] h-full pl-[5vw] */}
        <div className="w-full h-[55%] md:w-[45%] md:h-full flex flex-col justify-center px-6 md:px-0 md:pl-[5vw] relative z-20">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${manrope.className} text-[#E8E6DD] text-3xl sm:text-4xl md:text-[clamp(2rem,3.2vw,4rem)] leading-[1.2] sm:leading-[1.15] font-normal tracking-tight`}
          >
           {/* Handle new lines if text is passed as a string with \n */}
            {displayText.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
            ))}
          </motion.h1>

          <div className={`${prata.className} mt-4 sm:mt-6 md:mt-10 flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#E8E6DD] opacity-70`}>
            <svg className="w-5 h-2.5 sm:w-6 sm:h-3 stroke-current stroke-[1] fill-none" viewBox="0 0 24 24">
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
            <span>Gujarat, India</span>
          </div>
        </div>

        {/* Right Side Video */}
        {/* Mobile: w-full h-[45%] | Desktop: w-[55%] h-full */}
        <div className="w-full h-[45%] md:w-[55%] md:h-full relative overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-90 sepia-[0.15] will-change-contents"
            key={displayVideo} // Force re-render if video changes
          >
            <source src={displayVideo} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Aesthetic Details */}
      {/* Hidden on Mobile */}
      <div ref={leftDetailRef} className={`hidden md:block absolute left-[2vw] top-1/2 -translate-y-1/2 z-20 opacity-0 translate-y-8 writing-vertical-lr rotate-180 ${manrope.className} text-[#E8E6DD] text-[10px] tracking-[0.3em] uppercase`}>
        Est. 2024 — Strategic Living
      </div>
      {/* Mobile: Safe Padding */}
      <div ref={rightDetailRef} className={`absolute right-6 bottom-8 md:right-[3vw] md:bottom-[5vh] z-20 opacity-0 translate-y-8 text-right ${manrope.className} text-[#E8E6DD] text-xs leading-relaxed tracking-widest uppercase`}>
        <p>Global Reach.</p>
        <p>Local Roots.</p>
      </div>

      {/* Giant B */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full h-full flex items-center justify-center pointer-events-none will-change-transform">
        {/* Mobile: 80vw | Desktop: 33vw */}
        <div className={`${prata.className} relative text-[80vw] md:text-[33vw] leading-none text-[#F2F0E9]`}>
          <span className="relative z-10">B</span>
          <span
            ref={patternLayerRef}
            className="absolute top-0 left-0 w-full h-full z-20 text-transparent bg-cover bg-center opacity-0 will-change-[opacity]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1500&auto=format&fit=crop')",
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            }}
          >
            B
          </span>
        </div>
      </div>

    </section>
  );
}
