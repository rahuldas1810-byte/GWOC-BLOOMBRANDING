'use client'
import { useState } from 'react'

interface HoverCardProps {
  title: string
  description: string
}

export default function HoverCard({ title, description }: HoverCardProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white p-12 md:p-16 transition-all duration-300
                 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                 overflow-hidden"
    >
      {/* Cursor-follow glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
background: `radial-gradient(
  300px circle at ${pos.x}px ${pos.y}px,
  rgba(234, 220, 190, 0.45),
  transparent 60%
)`








,
        }}
      />

      {/* Content */}
      <h3 className="font-serif text-2xl text-dark-choc mb-6 relative z-10">
        {title}
      </h3>
      <p className="body-text text-near-black/60 relative z-10">
        {description}
      </p>
    </div>
  )
}
