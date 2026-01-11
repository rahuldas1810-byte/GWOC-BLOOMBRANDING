'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Prata } from 'next/font/google';

const prata = Prata({ subsets: ['latin'], weight: '400' });

export default function PolaroidParallaxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
  });

  /* ---------------- SECTION FADE-IN (NEW) ---------------- */
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.12],
    [0, 1]
  );

  /* ---------------- BACKGROUND ---------------- */
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.35, 0]);

  /* ---------------- CARD PHASES (NO OVERLAP) ---------------- */
  const phase1Opacity = useTransform(
    scrollYProgress,
    [0.18, 0.32],
    [0, 1]
  );

  const phase2Opacity = useTransform(
    scrollYProgress,
    [0.45, 0.6],
    [0, 1]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[150vh] overflow-hidden bg-[#EEEDE8]"
    >
      {mounted && (
        <motion.div
          className="absolute inset-0"
          style={{ opacity: sectionOpacity }}
        >
          {/* BACKGROUND */}
          <motion.div
            className="absolute inset-0 w-full h-[120%] -top-[10%]"
            style={{ y: bgY }}
          >
            <img
              src="/services-page-1.jpg"
              alt="Services background"
              className="w-full h-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          </motion.div>

          {/* POLAROIDS */}
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
    <div className={`w-[210px] bg-white shadow-xl ${className}`}>
      <div className="p-3">
        <div className="aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={img}
            alt={caption}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div
        className={`${prata.className} px-3 pb-6 pt-1 text-center text-[10px] tracking-[0.22em] uppercase text-[#2c2420]/80`}
      >
        {caption}
      </div>
    </div>
  );
}
