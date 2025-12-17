import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Bloom Branding (from brand guide)
        'earl-gray': '#E8E6D8',
        'electric-blue': '#2C4494',
        'electric-blue-dark': '#1E3570',
        'butter-yellow': '#BDAF62',
        'dark-choc': '#624A41',
        'near-black': '#1A1A1A',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-lekton)', 'monospace'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      letterSpacing: {
        'editorial': '0.02em',
        'wide-editorial': '0.15em',
      },
      lineHeight: {
        'editorial': '1.6',
        'heading': '1.1',
      },
    },
  },
  plugins: [],
}
export default config
