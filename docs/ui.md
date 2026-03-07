# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, dialogs, etc.)
- Do NOT use other component libraries (MUI, Chakra, Mantine, etc.)
- All UI must be composed from [shadcn/ui](https://ui.shadcn.com/) components only
- Install new shadcn/ui components via: `npx shadcn@latest add <component>`

## Date Formatting

Use [date-fns](https://date-fns.org/) for all date formatting. Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

This format uses an ordinal day suffix, a 3-letter abbreviated month, and a 4-digit year.

### Implementation

```ts
import { format } from "date-fns";

function formatDate(date: Date): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}
```
