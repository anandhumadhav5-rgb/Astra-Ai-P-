# ASTRA AI

A futuristic dark-mode AI SaaS landing page built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis, Three.js, and React Three Fiber.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion and GSAP animation utilities
- React Three Fiber and Three.js neural hero scene
- Lenis smooth scrolling
- Dark mode only theme system

## Project Structure

```text
app/              Next.js App Router entrypoints and SEO metadata
components/       Reusable UI, navigation, footer, smooth scroll, 3D canvas
sections/         Landing page sections
animations/       Framer Motion variants
hooks/            Reusable client hooks
lib/              Shared utilities
styles/           Global Tailwind theme styles
public/assets/    Static assets
legacy-src/       Previous Vite frontend kept for reference
server/           Existing Express backend kept intact
```

## Scripts

```bash
npm run dev        # Start the Next.js app
npm run build      # Production build
npm run start      # Start the production Next.js server
npm run typecheck  # TypeScript check
npm run dev:full   # Start existing Express server and Next app together
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
