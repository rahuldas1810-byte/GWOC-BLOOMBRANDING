"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SmoothScroll() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenisRef = useRef<Lenis | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.5,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // 2. Set scroll restoration to manual to prevent browser from restoring scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Listener for scroll button visibility
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      setShowButton(scroll > 200);
    });

    // 3. RAF loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 4. Initial scroll to top handles
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isMobileBreakpoint = window.matchMedia('(max-width: 768px)').matches;
    const isMobile = isMobileDevice || isMobileBreakpoint;

    const performReset = () => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if (isMobile) {
      // Multiple attempts to ensure we override browser restoration and Lenis initialization
      performReset();

      // More persistent reset for mobile
      const startTime = Date.now();
      const interval = setInterval(() => {
        performReset();
        // Stop after 2 seconds - by then layout is stable
        if (Date.now() - startTime > 2000) {
          clearInterval(interval);
        }
      }, 100);

      const timeouts = [
        setTimeout(performReset, 0),
        setTimeout(performReset, 50),
        setTimeout(performReset, 100),
        setTimeout(performReset, 250),
        setTimeout(performReset, 500),
        setTimeout(performReset, 1000),
        setTimeout(performReset, 1500),
      ];

      return () => {
        clearInterval(interval);
        timeouts.forEach(clearTimeout);
        lenis.destroy();
        lenisRef.current = null;
      };
    } else {
      // Standard desktop behavior: immediate reset
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    }

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 5. Scroll to top on route change
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const performReset = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    performReset();

    if (isMobile) {
      const timeouts = [
        setTimeout(performReset, 50),
        setTimeout(performReset, 150),
      ];
      return () => timeouts.forEach(clearTimeout);
    }
  }, [pathname, searchParams]);

  const scrollToTop = () => {
    lenisRef.current?.scrollTo(0);
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 10 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-[#3E2B26] to-[#5A4238] shadow-xl shadow-[#3E2B26]/40 flex items-center justify-center text-white border border-white/10 overflow-hidden group"
          aria-label="Scroll to top"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10" />
          <ArrowUp className="w-5 h-5 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
