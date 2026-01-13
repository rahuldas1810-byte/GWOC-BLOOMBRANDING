'use client';

import React from 'react';
import Image from 'next/image';

const reviews = [
  {
    quote: "Bloom Branding transformed our vague ideas into a visual identity that speaks volumes. The ROI was immediate and significant.",
    name: "Alex Morgan",
    role: "CEO, Nexus Tech",
    img: "https://i.pravatar.cc/150?img=33",
  },
  {
    quote: "Sleek, fast, and responsive. The team at Bloom knows exactly how to balance aesthetics with high-end performance.",
    name: "Elara Vance",
    role: "Founder, Moda Studios",
    img: "https://i.pravatar.cc/150?img=5",
  },
  {
    quote: "We needed a rebrand in 2 weeks. They delivered in 10 days without compromising a single pixel. Truly incredible work.",
    name: "Mike K.",
    role: "Director, FastTrack",
    img: "https://i.pravatar.cc/150?img=11",
  },
  {
    quote: "The dark mode aesthetic they implemented for our dashboard increased user retention by 40%. Pure magic.",
    name: "Sarah Jenkins",
    role: "CTO, GreenLeaf",
    img: "https://i.pravatar.cc/150?img=9",
  },
  {
    quote: "Professional, creative, and timely. The best agency experience I've had in ten years of doing business online.",
    name: "Marcus Chen",
    role: "VP, Velo City",
    img: "https://i.pravatar.cc/150?img=59",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-24 bg-white overflow-hidden flex flex-col justify-center relative">
      
      {/* Header */}
      <div className="text-center mb-16 px-4">
        <p className="text-black text-sm uppercase tracking-widest mb-3">Testimonials</p>
        <h2 className="text-4xl md:text-5xl font-serif text-black">Brands in Bloom</h2>
      </div>

      {/* Scroll Wrapper with Fade Edges */}
      <div className="relative w-full group">
        
        {/* Left/Right Fade Masks */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Moving Track */}
        <div className="flex gap-8 w-max animate-scroll group-hover:[animation-play-state:paused] px-8">
          
          {/* We render the list TWICE to create the seamless infinite loop */}
          {[...reviews, ...reviews].map((review, index) => (
            <div
              key={index}
              className="relative w-[380px] bg-electric-blue border border-electric-blue-dark/10 rounded-2xl p-8 flex-shrink-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-electric-blue/20 hover:border-transparent overflow-hidden group/card"
            >
              {/* Top Gradient Line (Visible on Hover) */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white to-earl-gray opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

              {/* Quote Icon */}
              <div className="absolute top-6 right-8 text-6xl font-serif text-white/10 leading-none pointer-events-none select-none">
                “
              </div>

              {/* Stars */}
              <div className="text-butter-yellow text-sm tracking-widest mb-6 relative z-10">
                ★★★★★
              </div>

              {/* Text */}
              <p className="text-white/90 font-light text-lg leading-relaxed mb-8 relative z-10">
                {review.quote}
              </p>

              {/* User Profile */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-white/10 relative">
                  <Image 
                    src={review.img} 
                    alt={review.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{review.name}</h4>
                  <p className="text-white/60 text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Keyframe Styles */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
