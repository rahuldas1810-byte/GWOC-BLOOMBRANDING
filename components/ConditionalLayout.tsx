'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import Chatbot from '@/components/Chatbot'
import { HeroVideoProvider, useHeroVideo } from '@/contexts/HeroVideoContext'
import { motion, AnimatePresence } from 'framer-motion'

function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const { isNavbarHidden } = useHeroVideo()

  // Don't show Navbar/Footer for admin routes
  if (isAdminRoute) {
    return <>{children}</>
  }

  // Show Navbar/Footer for public routes
  return (
    <>
      <AnimatePresence>
        {!isNavbarHidden && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>
      <main>{children}</main>
      <Footer />

      <AnimatePresence>
        {!isNavbarHidden && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Chatbot />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HeroVideoProvider>
      <InnerLayout>{children}</InnerLayout>
    </HeroVideoProvider>
  )
}

