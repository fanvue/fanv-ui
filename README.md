# @fanvue/ui

React component library built with Tailwind CSS for the Fanvue ecosystem.

[![CI](https://github.com/fanvue/fanv-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/fanvue/fanv-ui/actions/workflows/ci.yml)
[![Chromatic](https://github.com/fanvue/fanv-ui/actions/workflows/chromatic.yml/badge.svg)](https://github.com/fanvue/fanv-ui/actions/workflows/chromatic.yml)
[![npm version](https://img.shields.io/npm/v/@fanvue/ui.svg)](https://www.npmjs.com/package/@fanvue/ui)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-ff4785.svg?logo=storybook&logoColor=white)](https://github.com/fanvue/fanv-ui)

## Features

- 🎨 **Tailwind CSS v4** - Modern CSS-first theming with design tokens
- ♿ **Accessible** - WCAG 2.1 AA compliant with Radix UI primitives
- 📦 **Tree-shakable** - Import only what you use
- 🌙 **Dark mode** - Built-in light/dark theme support
- 📝 **TypeScript** - Full type definitions included
- 🧪 **Tested** - Unit tests with Vitest, E2E with Playwright

## Setup

### 1. Install

```bash
npm i @fanvue/ui
```

### 2. Peer dependencies

```bash
# Required
npm i react react-dom tailwindcss

# Only if using DatePicker
npm i react-day-picker
```

### 3. Configure CSS

Add the following to your CSS entry point (e.g. `app.css`):

```css
@import "tailwindcss";
@source "../node_modules/@fanvue/ui";
@import "@fanvue/ui/styles/theme.css";
```

### 4. Load Inter font

Load the [Inter](https://fonts.google.com/specimen/Inter) typeface via Google Fonts or `@fontsource-variable/inter`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
```

or

```bash
npm i @fontsource-variable/inter
```

## Usage

```tsx
import { Button } from "@fanvue/ui";

function App() {
  return (
    <Button variant="primary" size="40">
      Click me
    </Button>
  );
}
```

## Theming

Customize the theme by overriding CSS variables:

```css
:root {
  --color-primary-500: #00aeef;
  --color-neutral-500: #6b7280;
  --color-background-0: #ffffff;
}
```

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+

## Installation

```bash
pnpm install
pnpm dev
pnpm storybook
```

### Scripts

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| **Development**          |                                      |
| `pnpm dev`               | Start Vite dev server                |
| `pnpm build`             | Build the library for production     |
| `pnpm preview`           | Preview production build             |
| **Testing**              |                                      |
| `pnpm test`              | Run unit tests                       |
| `pnpm test:watch`        | Run tests in watch mode              |
| `pnpm test:coverage`     | Run tests with coverage report       |
| `pnpm test:storybook`    | Run Storybook interaction tests      |
| `pnpm test:e2e`          | Run Playwright E2E tests             |
| `pnpm typecheck`         | Run TypeScript type checking         |
| **Linting & Formatting** |                                      |
| `pnpm lint`              | Check for lint errors (Biome)        |
| `pnpm lint:fix`          | Auto-fix lint errors                 |
| `pnpm format`            | Format code                          |
| **Storybook**            |                                      |
| `pnpm storybook`         | Start Storybook dev server on port 6006 |
| `pnpm build-storybook`   | Build Storybook static site          |
| **Tokens & Build**       |                                      |
| `pnpm build:dictionary`  | Generate styles from design tokens   |
| `pnpm build:showcase`    | Build the showcase site              |
| `pnpm size-limit` | Check bundle size |
| **Publishing** | |
| `pnpm publish:dry-run` | Build and dry-run npm publish |

## Figma + Storybook Integration

This library is integrated with Figma through Chromatic Connect. View the complete documentation in Storybook:

```bash
pnpm storybook
# Navigate to "Documentation > Figma Integration"
```

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are validated by commitlint.

```bash
# Examples
feat(button): add loading state
fix: resolve focus ring issue
docs: update installation guide
```

For guided commit messages, install [Commitizen](https://github.com/commitizen/cz-cli) globally:

```bash
npm i -g commitizen
```

Then use `cz` instead of `git commit`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](./SECURITY.md) for reporting vulnerabilities.

## License

[Apache 2.0](./LICENSE) © Shift Holdings Ltd
