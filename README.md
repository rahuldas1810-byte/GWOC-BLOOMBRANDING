# Bloom Branding

> **Google Winter of Code 2025 — Track 3 Submission**  
> *Industry: Branding, Creative Strategy, Digital Content & Production*

Bloom Branding is a portfolio-driven agency website designed to capture attention and build trust. This project isn't just a static brochure; it's a high-performance digital experience featuring cinematic scrolling, physics-based interactions, and a strict "Luxury Inversion" design system.

Built to bridge the gap between aesthetic appeal and functional performance, this platform serves as the digital headquarters for **Bloom Branding**, a studio dedicated to strategic storytelling and bold identity design.

---

## 🛠️ The Tech Stack

We chose a stack that prioritizes frontend performance without sacrificing dynamic content capabilities.

*   **Core**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Motion**: [Framer Motion](https://www.framer.com/motion/)
*   **Database**: MongoDB (Client profiles, Enquiries)
*   **Assets**: Cloudinary (High-performance image/video delivery)
*   **Deployment**: Vercel

## ✨ Key Features

### 1. Cinematic User Experience
*   **Immersive Hero Sections**: Massive editorial typography with parallax scrolling effects.
*   **Micro-Interactions**: Physics-based hover states and "dark mode on hover" logic for service lists.
*   **Performance Optimization**: Smooth page transitions and lazy-loaded assets for a jank-free experience.

### 2. Comprehensive Brand Storytelling
The site guides users through the agency's narrative:
*   **Home**: High-energy introduction with a showreel-style aesthetic.
*   **Our Story**: A scroll-triggered narrative explaining the "Why" behind the brand.
*   **Services**: Interactive breakdown of offerings (Strategy, Content, Production) focusing on impact.
*   **Founders**: Personal storytelling that builds leadership trust.

### 3. Dynamic Content Management
Unlike static templates, this application is backed by a robust CMS architecture:
*   **Live Updates**: Manage brand profiles and testimonials via the admin panel.
*   **Media Handling**: Seamless video and image uploads through Cloudinary.
*   **Lead Generation**: Integrated enquiry forms directly connected to the backend.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js 18+
*   MongoDB URI
*   Cloudinary API Keys

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rahuldas1810-byte/website.git
    cd website
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory and add your credentials:
    ```env
    MONGODB_URI=your_mongodb_uri
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    ...
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🎨 Design Philosophy

**"Clarity, Confidence, Craft."**

The design avoids generic trends in favor of a timeless, confident aesthetic. We utilize a "Dark Chocolate" and "Electric Blue" palette to create high contrast and visual interest, ensuring that the agency's work remains the focal point.

---

*Developed by Rahul Das for GWoC 2025.*