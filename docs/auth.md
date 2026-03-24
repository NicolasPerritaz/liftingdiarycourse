# Authentication

## Provider: Clerk

**This app uses [Clerk](https://clerk.com/) for all authentication.** Do NOT implement custom auth, use other auth libraries (NextAuth, Auth.js, Lucia, etc.), or roll your own session management.

## Usage

### Getting the Current User

Always use Clerk's `auth()` helper from `@clerk/nextjs/server` to get the authenticated user's ID in server components and data helpers:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

### Protecting Routes

Use Clerk's `middleware` to protect routes. Configure it in `middleware.ts` at the project root:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

### Sign In / Sign Up Pages

Use Clerk's hosted or embedded components. Place embedded components at the standard routes:

- Sign in: `app/sign-in/[[...sign-in]]/page.tsx`
- Sign up: `app/sign-up/[[...sign-up]]/page.tsx`

```ts
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

## Rules

- **DO NOT** trust a `userId` from request params, query strings, or request body — always derive it from `auth()`
- **DO NOT** store passwords or manage sessions manually
- **DO NOT** use `currentUser()` when only the `userId` is needed — `auth()` is cheaper
- All protected data access must call `auth()` and validate `userId` before querying the database (see `data-fetching.md`)
