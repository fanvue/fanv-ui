# Contributing to @fanvue/ui

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/fanv-ui.git
   cd fanv-ui
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Create a branch:

   ```bash
   git checkout -b feat/your-feature
   ```

## Development Workflow

### Running Locally

```bash
# Start dev server (demo app)
pnpm dev

# Start Storybook
pnpm storybook
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Run type checking
pnpm typecheck
```

### Linting

```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

## Creating a Component

### File Structure

```
src/components/MyComponent/
├── MyComponent.tsx       # Component implementation
├── MyComponent.test.tsx  # Unit tests
├── MyComponent.stories.tsx # Storybook stories
└── index.ts             # Re-exports (optional, avoid barrel files)
```

### Component Guidelines

1. **Use forwardRef** - All components should forward refs:

   ```tsx
   export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
     (props, ref) => { ... }
   );
   ```

2. **Accept className** - Allow style overrides:

   ```tsx
   interface MyComponentProps {
     className?: string;
   }
   ```

3. **Use cn utility** - Merge Tailwind classes properly:

   ```tsx
   import { cn } from "../../utils/cn";

   <div className={cn("base-classes", className)} />
   ```

4. **Document props** - Add JSDoc comments:

   ```tsx
   interface MyComponentProps {
     /** Description of the prop */
     variant?: "primary" | "secondary";
   }
   ```

5. **Accessibility** - Ensure WCAG 2.1 AA compliance:
   - Proper ARIA attributes
   - Keyboard navigation
   - Focus management
   - Color contrast

### Writing Tests

- Test component rendering
- Test all props/variants
- Test interactions (clicks, keyboard)
- Test accessibility with `vitest-axe`

Example:

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent>Content</MyComponent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<MyComponent>Content</MyComponent>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

### Writing Stories

- Create stories for all variants/states
- Add descriptions and documentation
- Use the `autodocs` tag

Example:

```tsx
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: { children: "Default" },
};
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting) |
| `refactor` | Code change (not fix/feat) |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `build` | Build system changes |
| `ci` | CI/CD changes |
| `chore` | Other changes |
| `revert` | Revert a commit |

### Examples

```bash
feat(button): add loading spinner animation
fix(input): resolve focus outline in Safari
docs: add theming guide
test(button): add accessibility tests
```

## Pull Request Process

1. **Update tests** - Add/update tests for your changes
2. **Update docs** - Update README/Storybook if needed
3. **Pass CI** - Ensure all checks pass
4. **Request review** - Tag maintainers for review

### PR Title Format

Use the same format as commits:

```
feat(button): add loading state
```

## Questions?

Open an issue or start a discussion if you have questions!
