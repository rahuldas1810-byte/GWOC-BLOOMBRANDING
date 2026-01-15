'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface HeroVideoContextType {
  isNavbarHidden: boolean
  hideNavbar: () => void
  showNavbar: () => void
}

const HeroVideoContext = createContext<HeroVideoContextType | undefined>(undefined)

export function HeroVideoProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Default to hidden if on homepage ('/'), visible otherwise
  // This prevents the initial flash on load
  const [isNavbarHidden, setIsNavbarHidden] = useState(() => pathname === '/')

  // Handle route changes
  useEffect(() => {
    if (pathname === '/') {
      // If navigating TO home, we want to hide it (video plays again)
      setIsNavbarHidden(true)
    } else {
      // If navigating AWAY from home, ensure navbar is visible
      setIsNavbarHidden(false)
    }
  }, [pathname])

  const hideNavbar = () => setIsNavbarHidden(true)
  const showNavbar = () => setIsNavbarHidden(false)

  return (
    <HeroVideoContext.Provider value={{ isNavbarHidden, hideNavbar, showNavbar }}>
      {children}
    </HeroVideoContext.Provider>
  )
}

export function useHeroVideo() {
  const context = useContext(HeroVideoContext)
  if (context === undefined) {
    throw new Error('useHeroVideo must be used within a HeroVideoProvider')
  }
  return context
}
