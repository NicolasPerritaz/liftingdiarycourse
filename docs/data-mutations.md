# Data Mutations

## Helper Functions: `/src/data` Directory

All database mutation calls MUST be wrapped in helper functions located in the `src/data` directory. These functions:

- Use **Drizzle ORM** exclusively — **DO NOT write raw SQL**
- Are the single source of truth for all database writes, updates, and deletes
- Are called only from server actions — never directly from components

Example structure:
```
src/data
  workouts.ts   ← contains both read and mutation helpers
  exercises.ts
  sets.ts
```

Example mutation helper:
```ts
// src/data/workouts.ts
export async function createWorkout(data: { name: string; date: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.insert(workouts).values({ ...data, userId });
}
```

## Server Actions: `actions.ts` Files

All data mutations MUST be performed via **Next.js Server Actions** defined in colocated `actions.ts` files.

- Place `actions.ts` next to the route or component that uses it
- Every file must begin with `"use server"`
- Server actions call `src/data` helpers — they do NOT call the database directly

Example structure:
```
src/app/workouts/
  page.tsx
  actions.ts    ← server actions for this route
```

## Typed Parameters — No `FormData`

All server action parameters MUST be explicitly typed using TypeScript types or interfaces.

- **DO NOT** use `FormData` as a parameter type
- Accept plain typed objects instead

```ts
// CORRECT
export async function createWorkout(data: { name: string; date: Date }) { ... }

// WRONG
export async function createWorkout(formData: FormData) { ... }
```

## Validation: Zod Required

Every server action MUST validate its arguments with **Zod** before doing anything else.

- Define a Zod schema for every action's input
- Parse and validate at the top of the action body
- If validation fails, throw or return an error — never proceed with invalid data

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkoutAction(data: { name: string; date: Date }) {
  const parsed = createWorkoutSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  return createWorkout(parsed.data);
}
```

## Redirects: Client-Side Only

**DO NOT** use Next.js `redirect()` inside server actions. Redirects must be handled client-side after the server action resolves.

```ts
// WRONG
export async function createWorkoutAction(data: { name: string; date: Date }) {
  // ...
  redirect("/dashboard"); // ← never do this
}

// CORRECT — return a result and redirect in the calling component
export async function createWorkoutAction(data: { name: string; date: Date }) {
  // ...
  return { success: true };
}
```

In the component:
```ts
const result = await createWorkoutAction(data);
if (result.success) router.push("/dashboard");
```

## Summary of Rules

| Rule | Requirement |
|---|---|
| Database access | Via `src/data` helper functions using Drizzle ORM only |
| Mutation entry point | Server actions in colocated `actions.ts` files |
| Parameter types | Explicit TypeScript types — no `FormData` |
| Input validation | Zod schema validation at the start of every server action |
| Authorization | Scoped to authenticated user in the `src/data` helper (see `data-fetching.md`) |
| Redirects | Client-side only via `router.push()` — never use `redirect()` in server actions |
