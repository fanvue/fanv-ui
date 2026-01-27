# AI Agent Instructions

This document provides guidance for AI agents working on this codebase.

## Project Overview

`@fanvue/ui` is a React component library built with Tailwind CSS v4. It provides accessible UI primitives for the Fanvue ecosystem.

## Key Technologies

- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling (CSS-first with `@theme`)
- **Radix UI** - Accessible primitives
- **Vite** - Build tool (library mode)
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Storybook** - Component development
- **Biome** - Linting and formatting

## Directory Structure

```
src/
├── components/           # UI components
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── ComponentName.test.tsx
│       └── ComponentName.stories.tsx
├── styles/
│   ├── theme.css        # Tailwind @theme tokens
│   └── globals.css      # CSS variables
├── utils/
│   └── cn.ts            # Class name utility
├── test/
│   └── setup.ts         # Test setup
└── index.ts             # Public exports
```

## Component Patterns

### Creating Components

1. Use `React.forwardRef` for ref forwarding
2. Accept `className` prop for style overrides
3. Use `cn()` utility for class merging
4. Add JSDoc comments for props
5. Export types alongside components

```tsx
import * as React from "react";
import { cn } from "../../utils/cn";

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Description of the variant prop */
  variant?: "default" | "primary";
}

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variant === "primary" && "primary-styles",
          className
        )}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";
```

### Styling Guidelines

- Use Tailwind CSS classes
- Define variants as objects for consistency
- Use CSS variables via `hsl(var(--fanv-*))` pattern
- Ensure color contrast meets WCAG 2.1 AA

### Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes
- Focus management

## Testing Guidelines

### Unit Tests (Vitest)

- Test all props and variants
- Test interactions
- Test accessibility with `vitest-axe`

### E2E Tests (Playwright)

- Test against Storybook stories
- Verify keyboard navigation
- Test across browsers

## Commit Convention

Use Conventional Commits:

```
feat(component): description
fix(component): description
docs: description
test(component): description
```

## Commands Reference

```bash
pnpm dev          # Start dev server
pnpm storybook    # Start Storybook
pnpm test         # Run unit tests
pnpm test:e2e     # Run E2E tests
pnpm lint         # Check linting
pnpm lint:fix     # Fix linting issues
pnpm typecheck    # Type checking
pnpm build        # Build library
```

## Important Notes

1. **No barrel files** - Export directly from component files
2. **No default exports** - Use named exports only (except stories/configs)
3. **Preserve peer deps** - Don't bundle React, ReactDOM, or Tailwind
4. **Tree-shaking** - Keep exports granular for optimal bundling
