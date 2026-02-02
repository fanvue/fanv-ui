# Agent Guidelines

**React 19 component library** with Tailwind CSS, TypeScript, and Storybook.

## AI Agent Workflow (Figma MCP)

**You have Figma MCP tools available** to fetch component data programmatically:

```typescript
// Extract from URL: https://figma.com/design/abc123/FileName?node-id=456-789
// → fileKey: "abc123", nodeId: "456:789" (note: dashes become colons)

// 1. Fetch component properties, variants, and structure
user-Figma-get_design_context({ fileKey, nodeId })

// 2. Get visual reference
user-Figma-get_screenshot({ fileKey, nodeId })

// 3. Fetch design tokens/variables
user-Figma-get_variable_defs({ fileKey, nodeId })
```

**When user provides a Figma URL or asks to implement a component:**

1. Extract `fileKey` and `nodeId` from URL (convert dashes to colons in nodeId)
2. Use `get_design_context` to fetch properties and variants
3. Implement component matching Figma specs
4. Add Figma link to story using `design` parameter (see Figma Integration section)
5. Remind user to link component in Figma using Storybook Connect plugin (manual step)

**If no Figma URL provided:**
→ Ask user for Figma component URL before implementing

## Quick Start

**Setup:**

```bash
# Ensure correct Node.js version (required)
nvm use
```

**Required files for each component:**

- `ComponentName.tsx` - Implementation (named export, TypeScript)
- `ComponentName.test.tsx` - Tests (Vitest + axe accessibility)
- `ComponentName.stories.tsx` - Stories (CSF3 format)

**Critical rules:**

- Use named exports (never default)
- Use `forwardRef` for all components (with `displayName`)
- Use `cn()` utility for className merging
- Prefer Radix UI primitives for complex components (dropdowns, dialogs, etc.)
- Export all components and types in `src/index.ts`
- Use pnpm (not npm/yarn)

**New component workflow:**

```bash
# 1. Fetch component from Figma via MCP (if URL provided)
# 2. Implement component with tests and stories
# 3. Add Figma link to story parameters
# 4. Remind user to link in Figma using Storybook Connect plugin (manual)
```

## Key Files

- `src/index.ts` - Main export file (add all new components here)
- `src/styles/theme.css` - Design tokens
- `src/utils/cn.ts` - className utility
- `.storybook/` - Storybook configuration

## Commands

```bash
# Development
pnpm dev              # Dev server
pnpm storybook        # Storybook (port 6006)

# Testing
pnpm test             # All tests (unit + story tests)
pnpm test:watch       # Watch mode
pnpm test:storybook   # Story tests only (browser mode)
pnpm test:e2e         # Playwright E2E

# Quality
pnpm lint             # Check lints
pnpm lint:fix         # Auto-fix lints
pnpm typecheck        # TypeScript check

# Building
pnpm build            # Build library
pnpm build-storybook  # Build Storybook
```

## Testing Strategy

We use a **two-layer testing approach** to maximize coverage while minimizing duplication:

### 1. **Story Tests** (Storybook + Vitest)

**What they test:**

- ✅ Components render without errors
- ✅ All variant combinations

**How it works:**

- Stories are automatically transformed into Vitest tests
- Run in real Chromium browser via Playwright
- Every exported story becomes a smoke test
- Can add `play` functions for interaction testing

**Example:**

```typescript
// Badge.stories.tsx
export const Default: Story = {
  args: { children: "Badge" },
};
// ✅ Automatically tested: renders without errors
```

### 2. **Unit + Integration Tests** (Vitest + Testing Library)

**What they test:**

- ✅ Accessibility (axe violations)
- ✅ API contracts (className, asChild, props)
- ✅ Complex behavior & edge cases
- ✅ Implementation details not visible in stories

**What NOT to test (avoid duplication):**

- ❌ Variant rendering (covered by stories)
- ❌ Icon/children rendering (covered by stories)
- ❌ Basic prop combinations (covered by stories)

**Example:**

```typescript
// Badge.test.tsx
describe("Badge", () => {
  describe("API", () => {
    it("applies custom className", () => { /* ... */ });
    it("renders as Slot when asChild is true", () => { /* ... */ });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Badge>Test</Badge>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
```

### Testing Workflow

1. **Create stories** for all variants (automatic visual/smoke tests)
2. **Add unit tests** for:
   - Accessibility (always required)
   - API features (className, asChild, etc.)
   - Complex behaviors/edge cases
3. **Avoid duplicating** what stories already cover

## Project Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest, Testing Library, Playwright
- **Documentation**: Storybook with Chromatic
- **Design System**: [Figma Library](https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library)
- **Package Manager**: pnpm (required)

## Component Implementation

### 1. Component File (`ComponentName.tsx`)

**Pattern**: Use `forwardRef` → Define variants as objects → Apply with `cn()` in order: base → typography → variants → className override

```typescript
import * as React from "react";
import { cn } from "@/utils/cn";

const componentVariants = {
  variant: {
    default: "bg-neutral-100 text-neutral-400",
    primary: "bg-brand-purple-500 text-body-600",
  },
  size: {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
  },
} as const;

export interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof componentVariants.variant;
  size?: keyof typeof componentVariants.size;
}

export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ variant = "default", size = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center gap-2 rounded",
          // Typography
          "font-semibold leading-none",
          // Variant styles
          componentVariants.variant[variant],
          componentVariants.size[size],
          // Manual CSS overrides
          className,
        )}
        {...props}
      />
    );
  }
);

ComponentName.displayName = "ComponentName";
```

### 2. Test File (`ComponentName.test.tsx`)

**Focus on**: Accessibility + API contracts (avoid duplicating what stories test)

```typescript
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<ComponentName className="custom">Test</ComponentName>);
      const element = screen.getByText("Test");
      expect(element).toHaveClass("custom");
    });

    it("renders as Slot when asChild is true", () => {
      render(
        <ComponentName asChild>
          <a href="/test">Link</a>
        </ComponentName>
      );
      const link = screen.getByRole("link", { name: /Link/i });
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<ComponentName>Test</ComponentName>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
```

### 3. Story File (`ComponentName.stories.tsx`)

**Format**: CSF3 with `tags: ["autodocs"]`, include all variants, and add Figma link

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta = {
  title: "Components/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=123-456",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary"],
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
```

**Figma Link**: Add the `design` parameter with the Figma URL (including node-id if linking to specific component). This creates a "Design" tab in Storybook showing the Figma design.

## Figma Integration Workflow

**AI workflow (with Figma MCP):**

1. **User provides Figma URL** → Extract `fileKey` and `nodeId` from URL
2. **Fetch component data**: Use `user-Figma-get_design_context` to get properties, variants, and structure
3. **Implement component**: Create `.tsx`, `.test.tsx`, and `.stories.tsx` files matching Figma specs
4. **Add Figma link**: Include `design` parameter in story with Figma URL (shows Figma in Storybook)
5. **Remind user**: After CI publishes Storybook, user links component via Storybook Connect plugin in Figma (shows Storybook in Figma)

**If user doesn't provide Figma URL:**
→ Ask them to provide the Figma component URL (from "Copy link" in Figma)

### Two-Way Integration

**Step 1: Design Tab (Automatic) - Shows Figma IN Storybook**

We use `@storybook/addon-designs` to embed Figma links directly in Storybook. Add the `design` parameter to your story metadata:

```typescript
const meta = {
  title: "Components/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=123-456",
    },
  },
} satisfies Meta<typeof ComponentName>;
```

This creates a "Design" tab in Storybook that embeds the Figma design inline.

**Step 2: Storybook Connect (Manual) - Shows Storybook IN Figma**

After implementation, remind the user to:

1. **Get Storybook URL** from CI/PR comments (Chromatic publishes automatically)
2. **Open Figma** and select the component
3. **Use Storybook Connect plugin** (`Shift+I` in Figma)
4. **Link the story** by pasting the Storybook URL

> **Free plugin**: https://www.figma.com/community/plugin/1056265616080331589
> **Detailed setup**: Run `pnpm storybook` → "Documentation > Figma Integration"

## Conventions

**Naming**: PascalCase components, `ComponentNameProps` interfaces, "Components/ComponentName" story titles

**Architecture**: Prefer [Radix UI primitives](https://www.radix-ui.com/primitives) when available (Dialog, Dropdown, Tooltip, etc.) - they provide accessibility, keyboard navigation, and focus management out of the box

**Styling**: Tailwind CSS with `cn()` utility, always support `className` prop, follow `src/styles/theme.css` tokens

**Props**: Export TypeScript interfaces, provide defaults, support `children` when appropriate, extend HTML element attributes

**Refs**: Always use `forwardRef` with proper typing and set `displayName`

**Testing**: Stories for variants (smoke tests), unit tests for accessibility + API + edge cases (avoid duplication)

**Documentation**: JSDoc comments, Storybook stories, export in `src/index.ts`

## Export Pattern

**Always add to `src/index.ts`:**

```typescript
export { ComponentName } from "./components/ComponentName/ComponentName";
export type { ComponentNameProps } from "./components/ComponentName/ComponentName";
```

## New Component Checklist

Use this checklist when adding a new component:

### Required Files

- [ ] `ComponentName.tsx` - Component implementation
- [ ] `ComponentName.test.tsx` - Unit tests (with accessibility tests)
- [ ] `ComponentName.stories.tsx` - Storybook stories

### Figma Integration

- [ ] Use Figma MCP to fetch component properties from Figma URL (if provided)
- [ ] Implement component matching Figma specs
- [ ] Add Figma link to story using `design` parameter (Design tab)
- [ ] Remind user to link via Storybook Connect plugin after CI publishes (manual step)

### Quality Checks

- [ ] Component uses `forwardRef` with `displayName`
- [ ] Component implements all required props
- [ ] All variants have stories (automatic smoke tests)
- [ ] Accessibility tests pass (axe in unit tests)
- [ ] API contracts tested (className, asChild, etc.)
- [ ] Component exported in `src/index.ts`
- [ ] Props interface exported and documented
- [ ] TypeScript has no errors (`pnpm typecheck`)
- [ ] Linter passes (`pnpm lint`)
- [ ] Responsive design considered

### Common Issues to Avoid

- ❌ Not using `forwardRef` or missing `displayName`
- ❌ Forgot to export in `src/index.ts`
- ❌ Using default exports (use named exports)
- ❌ Missing accessibility tests
- ❌ Missing Figma link in story `design` parameter
- ❌ Forgot to remind user about Storybook Connect plugin (manual linking)

## Common Patterns

**Variant Props**: Use `as const` + `keyof typeof` (see Component example above)

**Polymorphic Components**: Use `@radix-ui/react-slot` for `asChild` pattern (see `Button.tsx`):

```typescript
import { Slot } from "@radix-ui/react-slot";

if (asChild) {
  return <Slot ref={ref} className={className} {...props}>{children}</Slot>;
}
return <button ref={ref} className={className} {...props}>{children}</button>;
// Usage: <Button asChild><a href="/">Link</a></Button>
```

**Complex Components**: Use Radix primitives (Dialog, Dropdown, Tooltip) for accessibility and interactions

**Forwarding Refs**: Use `forwardRef<HTMLElement, Props>` with `displayName`

**Compound Components**: Export subcomponents as properties (e.g., `Card.Header`)

## Critical Rules

- Named exports only (never default)
- Export all prop types in `src/index.ts`
- Use Figma MCP to fetch component data when Figma URL is provided
- Add Figma links to stories using `design` parameter (Design tab)
- Remind users to link components via Storybook Connect plugin (manual step)
- Chromatic publishes Storybook automatically on PR/main

## Troubleshooting

**Figma Issues:**

- Figma not showing in Storybook: Check `design` parameter is added to story metadata
- Design tab not appearing: Ensure `@storybook/addon-designs` is in `.storybook/main.ts` addons
- Storybook not showing in Figma: Use Storybook Connect plugin to manually link
- Can't find story: Check story title matches format "Components/ComponentName"
- Storybook URL not working: Get latest URL from CI/PR comments or Chromatic dashboard

**Build Issues:** `pnpm typecheck` → `pnpm lint:fix` → Check `src/index.ts` exports

**Full documentation**: `pnpm storybook` → "Documentation > Figma Integration"

## Resources

- [Figma Design Library](https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library)
- [Storybook Addon Designs](https://storybook.js.org/addons/@storybook/addon-designs) - Design tab in Storybook
- [Storybook Connect Plugin](https://www.figma.com/community/plugin/1056265616080331589) - Link stories in Figma
- Detailed setup: `pnpm storybook` → "Documentation > Figma Integration"
