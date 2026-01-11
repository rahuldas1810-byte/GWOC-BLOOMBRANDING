"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SLICE_COUNT = 6;

export default function SliceReveal() {
  const slicesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.set(slicesRef.current, {
      scaleY: 0,
      transformOrigin: "top",
    });

    gsap.to(slicesRef.current, {
      scaleY: 1,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.06,
    });
  }, []);

  return (
    <div className="absolute inset-0 flex">
      {[...Array(SLICE_COUNT)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) slicesRef.current[i] = el;
          }}
          className="h-full flex-1"
          style={{
            backgroundImage: "url('/testimonials/hero.jpg')",
            backgroundSize: `${SLICE_COUNT * 100}% 100%`,
            backgroundPosition: `${(i / (SLICE_COUNT - 1)) * 100}% center`,
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}
    </div>
  );
}
