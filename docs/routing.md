# Routing

## Route Structure

All application routes must be nested under `/dashboard`. There are no feature routes outside of this prefix.

```
/                        → public landing page
/sign-in                 → Clerk sign-in (public)
/sign-up                 → Clerk sign-up (public)
/dashboard               → protected app root
/dashboard/[feature]     → protected feature pages
```

## Protected Routes

All `/dashboard` routes are protected — they require an authenticated user. Route protection is handled exclusively via **Next.js middleware** using Clerk. Do NOT implement per-page auth guards or redirect logic inside page components.

### middleware.ts

Place `middleware.ts` at the project root (alongside `src/`):

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## Rules

- **All** user-facing app pages must live under `src/app/dashboard/`
- **DO NOT** add auth redirect logic inside page or layout components — the middleware handles this
- Public routes must be explicitly listed in `createRouteMatcher`; everything else is protected by default
- Sign-in and sign-up pages follow the Clerk catch-all convention (see `auth.md`)
