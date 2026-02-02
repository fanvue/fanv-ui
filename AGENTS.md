# Agent Guidelines

**React 19 component library** with Tailwind CSS, TypeScript, Figma Code Connect, and Storybook.

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
4. Create `.figma.tsx` mapping with exact property names (case-sensitive!)
5. Run `pnpm figma:publish`

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
- `ComponentName.figma.tsx` - Code Connect mapping

**Critical rules:**

- Use named exports (never default)
- Use `forwardRef` for all components (with `displayName`)
- Use `cn()` utility for className merging
- Prefer Radix UI primitives for complex components (dropdowns, dialogs, etc.)
- Export all components and types in `src/index.ts`
- Figma property names are case-sensitive and must match exactly
- Use pnpm (not npm/yarn)

**New component workflow:**

```bash
# 1. Fetch component from Figma via MCP (if URL provided)
# 2. Create ComponentName.figma.tsx with fetched properties
# 3. Publish to Figma
pnpm figma:publish
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
pnpm test             # Unit tests
pnpm test:watch       # Watch mode
pnpm test:e2e         # Playwright E2E

# Quality
pnpm lint             # Check lints
pnpm lint:fix         # Auto-fix lints
pnpm typecheck        # TypeScript check

# Building
pnpm build            # Build library
pnpm build-storybook  # Build Storybook

# Figma
pnpm figma:connect   # Auth (first time only)
pnpm figma:publish   # Publish Code Connect
pnpm figma:validate  # Verify Code Connect files
pnpm figma:list      # List all Code Connect mappings
```

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

**Required**: Test all variants + accessibility (vitest-axe)

```typescript
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName />);
    expect(screen.getByRole("...")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ComponentName />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

### 3. Story File (`ComponentName.stories.tsx`)

**Format**: CSF3 with `tags: ["autodocs"]`, include all variants

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta = {
  title: "Components/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
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

### 4. Figma Code Connect File (`ComponentName.figma.tsx`)

**CRITICAL**: Property names are **case-sensitive** and must match Figma exactly

```typescript
import { figma } from "@figma/code-connect";
import { ComponentName } from "./ComponentName";

figma.connect(
  ComponentName,
  "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=XXX-YYY",
  {
    props: {
      // Keys must match Figma property values exactly (case-sensitive!)
      variant: figma.enum("variant", {
        default: "default",
        primary: "primary",
      }),
      disabled: figma.boolean("disabled"),
      children: figma.string("label"),  // Figma layer must be named "label"
    },
    example: (props) => <ComponentName {...props} />,
  }
);
```

> **AI workflow**: Use `user-Figma-get_design_context` to fetch properties and variants from Figma URL
> **Detailed setup**: Run `pnpm storybook` → "Documentation > Figma Integration"

## Figma Integration Workflow

**AI workflow (with Figma MCP):**

1. **User provides Figma URL** → Extract `fileKey` and `nodeId` from URL
2. **Fetch component data**: Use `user-Figma-get_design_context` to get properties, variants, and structure
3. **Create `ComponentName.figma.tsx`**: Map Figma properties to React props (case-sensitive!)
4. **Publish**: Run `pnpm figma:publish` to push Code Connect
5. **Verify**: CI automatically publishes Storybook; user links via Chromatic Connect plugin

**If user doesn't provide Figma URL:**
→ Ask them to provide the Figma component URL (from "Copy link" in Figma)

> **Detailed setup**: Run `pnpm storybook` → "Documentation > Figma Integration"

## Conventions

**Naming**: PascalCase components, `ComponentNameProps` interfaces, "Components/ComponentName" story titles

**Architecture**: Prefer [Radix UI primitives](https://www.radix-ui.com/primitives) when available (Dialog, Dropdown, Tooltip, etc.) - they provide accessibility, keyboard navigation, and focus management out of the box

**Styling**: Tailwind CSS with `cn()` utility, always support `className` prop, follow `src/styles/theme.css` tokens

**Props**: Export TypeScript interfaces, provide defaults, support `children` when appropriate, extend HTML element attributes

**Refs**: Always use `forwardRef` with proper typing and set `displayName`

**Testing**: All variants + interactions + accessibility (axe) + edge cases

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
- [ ] `ComponentName.figma.tsx` - Figma Code Connect

### Figma Integration

- [ ] Create `ComponentName.figma.tsx` (see template in Component Implementation section)
- [ ] Use Figma MCP to fetch component properties from Figma URL (or ask user for URL)
- [ ] Map Figma properties to React props in `.figma.tsx` (case-sensitive!)
- [ ] Publish to Figma: `pnpm figma:publish`
- [ ] Remind user to link in Chromatic Connect plugin (after CI publishes Storybook)

### Quality Checks

- [ ] Component uses `forwardRef` with `displayName`
- [ ] Component implements all required props
- [ ] All variants tested with unit tests
- [ ] No accessibility violations (axe)
- [ ] All variants documented in Storybook
- [ ] Component exported in `src/index.ts`
- [ ] Props interface exported and documented
- [ ] TypeScript has no errors (`pnpm typecheck`)
- [ ] Linter passes (`pnpm lint`)
- [ ] Responsive design considered

### Common Issues to Avoid

- ❌ Not using `forwardRef` or missing `displayName`
- ❌ Figma property names don't match (case-sensitive!)
- ❌ Forgot to export in `src/index.ts`
- ❌ Using default exports (use named exports)
- ❌ Missing accessibility tests
- ❌ Component not linked in Chromatic Connect plugin

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
- Figma property names are case-sensitive and must match exactly
- Use Figma MCP to fetch component data when Figma URL is provided
- Chromatic publishes Storybook automatically on PR/main

## Troubleshooting

**Figma Issues:**

- Component → "--default": Not linked in Chromatic Connect plugin
- Props mismatch: Check case-sensitive property names
- Code not in Dev Mode: Run `pnpm figma:publish`

**Build Issues:** `pnpm typecheck` → `pnpm lint:fix` → Check `src/index.ts` exports

**Full documentation**: `pnpm storybook` → "Documentation > Figma Integration"

## Resources

- [Figma Design Library](https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library)
- Detailed setup: `pnpm storybook` → "Documentation > Figma Integration"
