Bloom Branding — GWOC Track 3

A clean, client-ready branding agency website built as part of Google Winter of Code (GWOC) – Track 3.

The project focuses on strong fundamentals: clear layouts, consistent design, and a maintainable codebase, rather than unnecessary visual or technical complexity.

Project Overview

Bloom Branding represents a premium branding agency.
The objective was to build a realistic agency website that prioritizes clarity, readability, and long-term maintainability.

Design and development decisions were guided by simplicity, structure, and production readiness.

Tech Stack

Next.js 14 (App Router)

TypeScript

Tailwind CSS

Framer Motion (minimal usage)

Next.js Server Actions

React Hook Form + Zod

Features

Core pages: Home, Our Story, Services, Clients, Testimonials, Contact

Fully responsive layout

File-based content management

Server-side contact form handling

Clean and scalable project structure

Getting Started
Requirements

Node.js 18+

npm or yarn

Setup
git clone <repository-url>
cd bloom-branding-gwoc
npm install

Run Locally
npm run dev


The app runs at http://localhost:3000.

Project Structure
app/        Next.js pages and routes
components/ Reusable UI components
content/    File-based content (TypeScript)
lib/        Utilities
types/      Type definitions

Content Management

All website content is stored in TypeScript files under the content/ directory.
This approach ensures type safety, version control, and easy updates without using a database.

Deployment

The project can be deployed directly on Vercel with no additional configuration.

License

Built for Google Winter of Code — Track 3.

Credits

Developed for the Bloom Branding project as part of GWOC Track 3 evaluation.