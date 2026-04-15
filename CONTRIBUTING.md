# Contributing to @fanvue/ui

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

- Node.js 24+
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
src/
├── e2e/
│   └── MyComponent.spec.ts        # E2E tests
└── components/
    └── MyComponent/
        ├── MyComponent.tsx         # Component implementation
        ├── MyComponent.test.tsx    # Unit + integration tests
        └── MyComponent.stories.tsx # Storybook stories
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
- Test API contracts (e.g. custom `className` merging, `ref` forwarding via `forwardRef`)

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

```text
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

### Releases (`release-please`)

Pushes to `main` run the [Release workflow](.github/workflows/release.yml) using [release-please](https://github.com/googleapis/release-please). It opens or updates a **Release PR** that bumps `@fanvue/ui` in `package.json`, updates `CHANGELOG.md`, and (after that PR is merged) publishes to npm.

A Release PR appears only when there is a **semver-relevant** conventional commit on `main` since the last release (see `.release-please-manifest.json` and `release-please-config.json`). In practice:

| Commit type | Typical version bump |
|-------------|----------------------|
| `feat` | Minor |
| `fix` | Patch |
| Breaking change (`feat!:` / `fix!:` / `BREAKING CHANGE:` footer) | Major |
| `chore`, `refactor`, `docs`, `ci`, `test`, `style`, … | **None** — no new Release PR by themselves |

So a squash-merge title like `refactor(button): …` or `chore: …` on `main` will **not** trigger a release, even if the code change should ship to npm. Prefer **`feat`** or **`fix`** in the merge commit when the work should produce a version bump (or add a small follow-up commit on `main` with a `fix`/`feat` message if you only realized after merge).

## Pull Request Process

1. **Update tests** - Add/update tests for your changes
2. **Update docs** - Update README/Storybook if needed
3. **Pass CI** - Ensure all checks pass
4. **Request review** - Tag maintainers for review

### PR Title Format

Use the same format as commits:

```text
feat(button): add loading state
```

## Questions?

Open an issue or start a discussion if you have questions!
