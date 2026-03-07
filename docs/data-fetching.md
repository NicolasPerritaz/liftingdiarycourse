# Data Fetching

## CRITICAL: Server Components Only

ALL data fetching in this app MUST be done via **React Server Components**. There are no exceptions.

- **DO NOT** fetch data in client components (`"use client"`)
- **DO NOT** fetch data in route handlers (`app/api/`)
- **DO NOT** use `useEffect` + `fetch` patterns
- **DO NOT** use SWR, React Query, or any client-side fetching library

Data flows one way: database → server component → (optional) client component via props.

## Database Access: `/data` Directory

All database queries MUST be done via helper functions located in the `/data` directory. These functions:

- Use **Drizzle ORM** exclusively — **DO NOT write raw SQL**
- Are called only from server components
- Are the single source of truth for data access

Example structure:
```
/data
  workouts.ts
  exercises.ts
  sets.ts
```

## Authorization: Users Can Only Access Their Own Data

**Every** data helper function MUST scope queries to the currently authenticated user. A logged-in user must NEVER be able to read or modify another user's data.

Always filter by `userId` derived from the authenticated session — never trust a `userId` passed from the client.

```ts
// CORRECT — always scope to the authenticated user
export async function getWorkouts() {
  const { userId } = await auth(); // get userId from session, not from params/body
  if (!userId) throw new Error("Unauthorized");

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

// WRONG — never trust a userId from the client
export async function getWorkouts(userId: string) { ... }
```

This rule applies to reads, writes, updates, and deletes — every query must be scoped to the authenticated user.
