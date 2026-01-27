# @fanvue/ui

React component library built with Tailwind CSS for the Fanvue ecosystem.

[![npm version](https://img.shields.io/npm/v/@fanvue/ui.svg)](https://www.npmjs.com/package/@fanvue/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Tailwind CSS v4** - Modern CSS-first theming with design tokens
- ♿ **Accessible** - WCAG 2.1 AA compliant with Radix UI primitives
- 📦 **Tree-shakable** - Import only what you use
- 🌙 **Dark mode** - Built-in light/dark theme support
- 📝 **TypeScript** - Full type definitions included
- 🧪 **Tested** - Unit tests with Vitest, E2E with Playwright

### Getting Started

```bash
npm i @fanvue/ui
```

### Peer Dependencies

```bash
npm i react react-dom tailwindcss
```

## Setup

### 1. Import Styles

Add the fanv-ui styles to your CSS entry point:

```css
@import "@fanvue/ui/styles/theme.css";
@import "@fanvue/ui/styles/globals.css";
```

## Usage

```tsx
import { Button } from "@fanvue/ui";

function App() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}
```

## Theming

Customize the theme by overriding CSS variables:

```css
:root {
  --fanv-primary: 199 89% 48%;
  --fanv-radius: 0.75rem;
  --fanv-font-sans: "Poppins";
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

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Build for production |
| `pnpm storybook` | Start Storybook |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm lint` | Run Biome linting |
| `pnpm typecheck` | Run TypeScript checks |

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

[MIT](./LICENSE) © Fanvue.com
