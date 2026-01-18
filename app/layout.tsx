import type { Metadata } from 'next'
import { Playfair_Display, Lekton } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lekton = Lekton({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lekton',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bloom Branding | Strategic Brand Identity',
  description: 'We help startups, D2C brands, and creators build confident, strategic brand identities that resonate.',
  icons: {
    icon: '/favicon-blue.png',
  },
}

import SmoothScroll from '@/components/SmoothScroll'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lekton.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                  if ('scrollRestoration' in window.history) {
                    window.history.scrollRestoration = 'manual';
                  }
                  window.scrollTo(0, 0);
                  setTimeout(function() { window.scrollTo(0, 0); }, 0);
                  setTimeout(function() { window.scrollTo(0, 0); }, 50);
                  setTimeout(function() { window.scrollTo(0, 0); }, 100);
                  setTimeout(function() { window.scrollTo(0, 0); }, 500);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-earl-gray text-near-black">
        <SmoothScroll />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
