# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via `postcss.config.mjs`)

## IMPORTANT: Documentation First

Before generating any code, ALWAYS check the `/docs` directory for relevant documentation files. These docs define the project's design decisions, conventions, and specifications — all generated code must align with them:

- /docs/ui.md
- /docs/data-fetching.md

## Architecture

This is a fresh Next.js App Router project — the lifting diary app is yet to be built. Current structure:

- `src/app/layout.tsx` — root layout with font and metadata
- `src/app/page.tsx` — home page (currently the default create-next-app template)
- `src/app/globals.css` — global styles with Tailwind imports
