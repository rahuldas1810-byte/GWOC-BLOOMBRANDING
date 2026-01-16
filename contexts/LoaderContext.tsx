'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface LoaderContextType {
    isInitialLoadComplete: boolean
    isHeroVideoReady: boolean
    setHeroVideoReady: (ready: boolean) => void
    setIsInitialLoadComplete: (complete: boolean) => void
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined)

export function LoaderProvider({ children }: { children: ReactNode }) {
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false)
    const [isHeroVideoReady, setIsHeroVideoReady] = useState(false)

    // Reset hero video ready state on route change if needed
    // But usually we only care about initial load for the specific hero video check
    const pathname = usePathname()

    // We can also track route changes here for the progress bar if we wanted to centralize state
    // For now, minimal state is best.

    return (
        <LoaderContext.Provider
            value={{
                isInitialLoadComplete,
                setIsInitialLoadComplete,
                isHeroVideoReady,
                setHeroVideoReady: setIsHeroVideoReady
            }}
        >
            {children}
        </LoaderContext.Provider>
    )
}

export function useLoader() {
    const context = useContext(LoaderContext)
    if (context === undefined) {
        throw new Error('useLoader must be used within a LoaderProvider')
    }
    return context
}
