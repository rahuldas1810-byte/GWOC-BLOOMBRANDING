# Bloom Branding - GWOC '25 Track 3

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)

**Creative Agency Portfolio & Dynamic CMS System**

> **Purpose**: A high-performance, cinematic digital experience designed to showcase branding excellence, backed by a fully dynamic content management system and AI-powered interaction.

---

## 🚀 Project Overview

**Bloom Branding** bridges the gap between static agency portfolios and dynamic content needs. It combines an immersive "luxury inversion" frontend design with a powerful Admin Dashboard, allowing non-technical team members to manage content in real-time without touching code.

**Key Audience:**
*   **Prospective Clients**: Seeking premium branding services and visual proof of expertise.
*   **Agency Admins**: Managing portfolios, testimonials, and services effortlessly.

---

## ✨ Core Features

*   **Cinematic Landing Page**: Parallax scrolling, smooth reveals, and physics-based interactions powered by Framer Motion & GSAP.
*   **AI-Powered "BloomBot"**: Intelligent, context-aware chatbot using Google Gemini API to answer service queries 24/7.
*   **Dynamic Client Showcase**: Real-time filtering and display of projects fetched directly from the database.
*   **Admin Dashboard**: comprehensive control panel for text, images, SEO, and lead management.

---

## 🛠️ Tech Stack

### **Frontend**
*   **Next.js 14 (App Router)**: Server-side rendering and routing.
*   **React 18**: Component-based UI architecture.
*   **Tailwind CSS**: Utility-first styling.
*   **Framer Motion & GSAP**: High-fidelity animations.
*   **Lenis**: Smooth inertial scrolling.

### **Backend**
*   **Next.js API Routes**: Serverless endpoints.
*   **Google Gemini AI**: Chatbot intelligence.
*   **Resend**: Transactional emails.
*   **JWT & Bcrypt**: Secure authentication.

### **Data & Infrastructure**
*   **MongoDB (Atlas)**: NoSQL database.
*   **Cloudinary**: Media asset optimization and CDN.
*   **Vercel**: Edge deployment and hosting.

---

## 🏃‍♂️ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env.local` file in the root directory with the following keys:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_random_secret_string

# Cloudinary (Media)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI & Email
GEMINI_API_KEY=your_google_gemini_key
RESEND_API_KEY=your_resend_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

| Folder | Description |
| :--- | :--- |
| **`app/`** | Main application routes (App Router) and API endpoints. |
| **`app/(admin)`** | Protected Admin panel pages. |
| **`components/`** | Reusable UI components (Navbar, Hero, etc.). |
| **`models/`** | Mongoose database schemas. |
| **`backend/`** | Core utility logic (DB connection, Auth, Email). |
| **`scripts/`** | Automation scripts for seeding and setup. |

---

## 🔒 Security

*   **JWT Authentication**: Stateless, secure token-based access for admins.
*   **Zod Validation**: Strict schema validation for all API inputs.
*   **HTTP-Only Cookies**: Prevents XSS attacks.

---

## 🚀 Deployment

The project is optimized for deployment on **Vercel**.
1.  Push code to GitHub.
2.  Import project to Vercel.
3.  Add environment variables in Vercel settings.
4.  Deploy!

---
*Built for GWOC '25 Track 3*