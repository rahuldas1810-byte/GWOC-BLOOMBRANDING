# Bloom Branding - GWOC Track 3

A polished, premium branding agency website built for Google Winter of Code - Track 3.

## 🎯 Project Overview

This is a client-ready branding agency website for **Bloom Branding**, built with modern web technologies and following strict design principles: clarity over complexity, polish over flashiness, and stability over experiments.

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (restrained animations)
- **Next.js Server Actions** (form handling)
- **React Hook Form** + **Zod** (form validation)

## 📋 Features

- 6 core pages: Home, Our Story, Services, Clients, Testimonials, Contact
- File-based content management (no database required)
- Contact form with Server Actions
- Fully responsive design
- Restrained, confident animations
- Production-ready codebase

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (required to run this Next.js application)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd bloom-branding-gwoc
```

2. **Install dependencies using Node.js/npm:**
```bash
npm install
```

3. **Customize content (optional):**
   - Edit `/content/testimonials.ts` to update testimonials
   - Edit `/content/clients.ts` to update client list
   - Edit `/content/homepage.ts` to update homepage content
   - All content is stored in TypeScript files for easy version control and updates

## ▶️ Running the Application

This is a **Next.js application** that runs on **Node.js**. Use the following commands:

### Development Mode (Recommended)
```bash
npm run dev
```
This starts the Next.js development server on **http://localhost:3000**

### Production Build
```bash
npm run build
npm start
```
This builds and runs the optimized production version.

### Other Commands
```bash
npm run lint    # Run ESLint to check code quality
```

**Note:** Make sure you have Node.js 18+ installed. You can check your version with:
```bash
node --version
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── our-story/         # Our Story page
│   ├── services/          # Services page
│   ├── clients/           # Clients page
│   ├── testimonials/      # Testimonials page
│   ├── contact/           # Contact page
│   └── actions/           # Server Actions
│       └── contact.ts     # Contact form handler
├── components/            # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── SectionReveal.tsx
├── content/               # Content files (file-based CMS)
│   ├── testimonials.ts   # Testimonials data
│   ├── clients.ts        # Clients data
│   └── homepage.ts       # Homepage content
├── lib/                   # Utility functions
│   └── content.ts         # Content utilities
└── types/                 # TypeScript type definitions
```

## 🎨 Brand Design System

### Color Palette (From Brand Guide)
```css
Earl Gray:       #E8E6D8  /* Background, neutral */
Electric Blue:   #2C4494  /* Primary CTA, accent */
Butter Yellow:   #BDAF62  /* Highlight sections */
Dark Choc:       #624A41  /* Headings, contrast */
Near Black:      #1A1A1A  /* Body text */
```

### Typography
- **Headings**: Playfair Display (serif, editorial)
- **UI/Labels**: Lekton (mono, uppercase tracking)
- **Body**: Arial (clean, readable)

### Design Principles
- **Editorial**: Print-inspired, spacious layouts
- **Clarity > Features**: Focus on clear communication
- **Polish > Complexity**: Refined, not over-engineered
- **Confidence > Flashiness**: Premium, not attention-seeking

### Visual Rules
- No gradients
- No shadows
- Rectangular buttons (no rounding)
- Large section padding (80-120px)
- Restrained animations (opacity + subtle Y movement)

## 📝 Content Management

All content is stored in TypeScript files in the `/content` directory. This approach provides:

- **Version control**: All content changes are tracked in git
- **Type safety**: TypeScript ensures content structure is correct
- **Easy updates**: Edit files directly, no database needed
- **Predictable**: No external dependencies or API calls

### Content Files

- `/content/testimonials.ts` - Client testimonials
- `/content/clients.ts` - Client list
- `/content/homepage.ts` - Homepage text content

### Contact Form

The contact form uses **Next.js Server Actions** to handle submissions. Form data is validated on the server and logged (you can extend this to send emails or store submissions as needed).

## 🚢 Deployment

This project is ready for Vercel deployment:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy (no environment variables needed!)

The project uses only Next.js primitives, so no external services or API keys are required.

## 📄 License

This project is built for Google Winter of Code - Track 3.

## 👥 Credits

Built for Bloom Branding as part of GWOC Track 3 evaluation.