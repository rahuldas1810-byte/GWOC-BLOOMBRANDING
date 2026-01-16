'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const clients = [
  {
    id: 1,
    name: "AMBC Gems",
    category: "Luxury Gemstones",
    description: "We partnered with AMBC Gems to showcase their exquisite collection of rare gemstones. Through high-fidelity visuals and a sophisticated digital narrative, we highlighted the precision cuts and timeless elegance that define their brand.",
    stats: [
      { label: "Global Reach", value: "15+ Countries" },
      { label: "Digital Engagement", value: "+150%" }
    ],
    videoSrc: "/videos/client-1.mp4",
  },
  {
    id: 2,
    name: "Thyme & Whisk",
    category: "Culinary Experience",
    description: "Redefining vegetarian dining with global flavors. We crafted a vibrant brand identity that mirrors their innovative culinary approach, blending modern aesthetics with the warmth of their hospitality.",
    stats: [
      { label: "Footfall Increase", value: "+40%" },
      { label: "Brand Loyalty", value: "95%" }
    ],
    videoSrc: "/videos/client-2.mp4",
  },
  {
    id: 3,
    name: "Dhruv Gems",
    category: "Diamond Manufacturing",
    description: "From Surat's diamond hub to the world. Our campaign emphasized Dhruv Gems' legacy of trust and quality, using clean, industrial-chic visuals to represent their state-of-the-art manufacturing processes.",
    stats: [
      { label: "B2B Leads", value: "+300%" },
      { label: "Market Trust", value: "Top Tier" }
    ],
    videoSrc: "/videos/client-3.mp4",
  },
  {
    id: 4,
    name: "Moire Rugs",
    category: "Artisanal Carpets",
    description: "Weaving tradition with contemporary design. For Moire, we developed a visual language that celebrates the textures and artistry of their handcrafted rugs, positioning them as masterpieces for the modern home.",
    stats: [
      { label: "Online Sales", value: "+80%" },
      { label: "Collection Launch", value: "Sold Out" }
    ],
    videoSrc: "/videos/client-4.mp4",
  }
];

const ClientSection = ({ client, index }: { client: any, index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} w-full border-b border-[#3E2723]/20 last:border-0`}>
      
      {/* MEDIA COLUMN: Sticky Video */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-screen sticky top-0 z-10 overflow-hidden bg-black">
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={client.videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-[#3E2723] opacity-10 pointer-events-none mix-blend-multiply"></div>
      </div>

      {/* TEXT COLUMN: Scrolling Content */}
      <div className="w-full md:w-1/2 min-h-[auto] md:min-h-screen bg-[#F4F1EA] text-[#3E2723] flex flex-col justify-center p-8 md:p-20 z-20 relative overflow-hidden">
        
        <motion.div
           initial={{ opacity: 0, x: isEven ? 50 : -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-20%" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative z-10"
        >
          <div className="mb-6">
            <span className="uppercase tracking-[0.2em] text-sm font-bold text-[#2962FF] mb-2 block">
              {client.category}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-light leading-tight mb-6">
              {client.name}
            </h2>
            <div className="w-20 h-1 bg-[#2962FF] mb-8"></div>
          </div>

          <p className="text-lg md:text-xl leading-relaxed opacity-90 mb-12 font-light">
            {client.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-8 border-t border-[#3E2723]/20 pt-8">
            {client.stats.map((stat: any, idx: number) => (
              <div key={idx}>
                <p className="text-3xl md:text-4xl font-bold text-[#2962FF] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-wider opacity-70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default function ClientShowcase() {
  return (
    <section className="w-full bg-[#F4F1EA]">
      {/* Intro Header */}
      <div className="py-20 px-8 text-center border-b border-[#3E2723]/20">
        <h3 className="text-[#2962FF] uppercase tracking-widest font-bold mb-4">Selected Works</h3>
        <h2 className="text-[#3E2723] text-3xl md:text-5xl font-serif">
          Crafting Identity in Motion
        </h2>
      </div>

      {/* Render Clients */}
      <div>
        {clients.map((client, index) => (
          <ClientSection key={client.id} client={client} index={index} />
        ))}
      </div>
    </section>
  );
}