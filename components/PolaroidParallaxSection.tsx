'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Prata } from 'next/font/google';

const prata = Prata({ subsets: ['latin'], weight: '400' });

export default function PolaroidParallaxSection({ backgroundImage }: { backgroundImage?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const displayImage = backgroundImage || "/services-page-1.jpg";

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
  });

  // SMOOTHING: Dampen the scroll input so it feels buttery smooth
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  /* ---------------- SECTION FADE-IN (SCROLL LINKED) ---------------- */
  // We keep the section opacity linked to scroll for the overall entry/exit feel
  const sectionOpacity = useTransform(
    smoothProgress,
    [0, 0.12],
    [0, 1]
  );

  /* ---------------- BACKGROUND ---------------- */
  // Parallax background movement
  const bgY = useTransform(smoothProgress, [0, 1], ['-6%', '6%']);
  
  // Overlay darkening
  const overlayOpacity = useTransform(smoothProgress, [0, 0.3], [0.35, 0]);

  /* ---------------- CARD PHASES (NO OVERLAP) ---------------- */
  // Phase 1 Fade In/Out
  const phase1Opacity = useTransform(
    smoothProgress,
    [0.18, 0.32],
    [0, 1]
  );

  // Phase 2 Fade In/Out
  const phase2Opacity = useTransform(
    smoothProgress,
    [0.45, 0.6],
    [0, 1]
  );
  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100vh] md:h-[150vh] overflow-hidden bg-[#EEEDE8]"
    >
      {mounted && (
        <motion.div
          className="absolute inset-0"
          style={{ opacity: sectionOpacity }}
        >
          {/* BACKGROUND WITH FADE-IN TRANSITION */}
          <motion.div
            className="absolute inset-0 w-full h-[120%] -top-[10%]"
            style={{ y: bgY }}
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="relative w-full h-full"> 
               <Image
                src={displayImage}
                alt="Services background"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
            
            <motion.div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          </motion.div>

          {/* POLAROIDS - DESKTOP */}
          <div className="pointer-events-none hidden md:block relative z-10 w-full h-full">

            {/* PHASE 1 */}
            <motion.div style={{ opacity: phase1Opacity }}>
              <Polaroid
                className="absolute left-[6vw] top-[24%]"
                img="https://images.unsplash.com/photo-1581094794329-c8112a89af12"
                caption="Executed by a team of experts"
              />
              <Polaroid
                className="absolute right-[6vw] top-[30%]"
                img="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
                caption="Highest construction standards"
              />
            </motion.div>

            {/* PHASE 2 */}
            <motion.div style={{ opacity: phase2Opacity }}>
              <Polaroid
                className="absolute left-[6vw] top-[58%]"
                img="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789"
                caption="Precision driven processes"
              />
              <Polaroid
                className="absolute right-[6vw] top-[62%]"
                img="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
                caption="Built with care and craft"
              />
            </motion.div>

          </div>

          {/* POLAROIDS - MOBILE */}
          <div className="pointer-events-none md:hidden relative z-10 w-full h-full">
            <motion.div style={{ opacity: phase1Opacity }} className="absolute inset-0">
              <MobilePolaroid
                className="absolute left-4 top-[20%] -rotate-3"
                img="https://images.unsplash.com/photo-1581094794329-c8112a89af12"
                caption="Expert team"
              />
              <MobilePolaroid
                className="absolute right-4 top-[28%] rotate-2"
                img="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
                caption="High standards"
              />
            </motion.div>

            <motion.div style={{ opacity: phase2Opacity }} className="absolute inset-0">
              <MobilePolaroid
                className="absolute left-4 top-[55%] rotate-2"
                img="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789"
                caption="Precision driven"
              />
              <MobilePolaroid
                className="absolute right-4 top-[60%] -rotate-3"
                img="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
                caption="Built with care"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
}

/* ---------------- POLAROID ---------------- */

function Polaroid({
  img,
  caption,
  className,
}: {
  img: string;
  caption: string;
  className?: string;
}) {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-[210px] bg-white shadow-xl ${className}`}
    >
      <div className="p-3">
        <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
          <Image
            src={img}
            alt={caption}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 210px"
          />
        </div>
      </div>

      <div
        className={`${prata.className} px-3 pb-6 pt-1 text-center text-[10px] tracking-[0.22em] uppercase text-[#2c2420]/80`}
      >
        {caption}
      </div>
    </motion.div>
  );
}

/* ---------------- MOBILE POLAROID ---------------- */

function MobilePolaroid({
  img,
  caption,
  className,
}: {
  img: string;
  caption: string;
  className?: string;
}) {
  return (
    <div className={`w-[120px] bg-white shadow-lg ${className}`}>
      <div className="p-2">
        <div className="aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={img}
            alt={caption}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div
        className={`${prata.className} px-2 pb-3 pt-1 text-center text-[8px] tracking-[0.15em] uppercase text-[#2c2420]/80`}
      >
        {caption}
      </div>
    </div>
  );
}
