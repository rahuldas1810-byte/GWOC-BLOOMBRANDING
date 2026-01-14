"use client";

import { useState, useRef, ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  innerClassName = "bg-[#3E2B26]",
}: SpotlightCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    // Wrapper Div (The "Glow") - Intensified gradient
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl ${className}`}
      style={{
        // Warm brown gradient border (premium organic glow)
        background: 'linear-gradient(to bottom, rgba(189,175,98,0.40), rgba(189,175,98,0.10))',
      }}
    >
      {/* Radial Gradient Spotlight (follows cursor) - More intense */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(189, 175, 98, 0.25), transparent 40%)`,
        }}
      />

      {/* Inner Div - 5px inset for thick border */}
      <div
        className={`absolute inset-[5px] rounded-[19px] z-10 overflow-hidden ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
