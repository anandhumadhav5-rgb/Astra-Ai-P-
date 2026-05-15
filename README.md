# Astra AI

Public-ready repository for the Astra AI web app.

The actual app source code is in:

`Astra-Ai-main/`

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion + GSAP
- Firebase Auth/Firestore
- Groq / OpenAI / OpenRouter (via env configuration)

## Quick Start

```bash
cd Astra-Ai-main
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Update values in `.env` before running:

- `GROQ_API_KEY`
- `GROQ_MODEL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_ELEVENLABS_API_KEY` (optional)
- `NEXT_PUBLIC_ELEVENLABS_VOICE_ID` (optional)
- `NEXT_PUBLIC_ELEVENLABS_MODEL` (optional)

## Scripts

Run these inside `Astra-Ai-main/`:

```bash
npm run dev
npm run dev:server
npm run dev:full
npm run build
npm run start
npm run lint
npm run typecheck
```

## Security Note

Do not commit real secrets. Keep `.env` private and only commit `.env.example`.

