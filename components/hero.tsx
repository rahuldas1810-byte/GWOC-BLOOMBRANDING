"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Hero() {
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setVideoEnded(true);
    };

    const handleVideoError = () => {
      // If video fails to load, show content after a short delay
      setTimeout(() => {
        setVideoEnded(true);
      }, 500);
    };

    video.addEventListener("ended", handleVideoEnd);
    video.addEventListener("error", handleVideoError);

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
      video.removeEventListener("error", handleVideoError);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden pt-28 md:pt-32">
      {/* ===== Video ===== */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoEnded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        src="/videos/video1.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
      />

      {/* ===== Beige Background (appears after video) ===== */}
      <div
        className={`absolute inset-0 bg-earl-gray transition-opacity duration-1000 ${
          videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ===== Overlay (only during video) ===== */}
      {!videoEnded && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      )}

      {/* ===== Content ===== */}
      <div
        className={`relative z-10 flex h-full items-center justify-center text-center px-6 transition-opacity duration-1000 ${
          videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-3xl">
          <p className="mb-4 text-sm tracking-widest text-dark-choc/70">
            HELPING BRANDS BLOOM
          </p>

          <h1 className="font-serif text-[3.5rem] md:text-[6.5rem] text-dark-choc leading-tight">
            We craft brand identities
            <br />
            that <span className="text-[#892F1A]">resonate</span>.
          </h1>

          <p className="mt-6 text-dark-choc/80 text-base md:text-lg">
            Bringing synergy of aesthetics and expertise to help your brand
            bloom.
          </p>

          <Link
            href="/contact"
            className="inline-block mt-10 px-8 py-3 bg-[#892F1A] text-white tracking-wide hover:opacity-90 transition"
          >
            START YOUR PROJECT
          </Link>
        </div>
      </div>
    </section>
  );
}
