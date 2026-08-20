# @fanvue/ui

React component library built with Tailwind CSS for the Fanvue ecosystem.


[![CI](https://github.com/fanvue/fanv-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/fanvue/fanv-ui/actions/workflows/ci.yml)
[![Chromatic](https://github.com/fanvue/fanv-ui/actions/workflows/chromatic.yml/badge.svg)](https://github.com/fanvue/fanv-ui/actions/workflows/chromatic.yml)
[![npm version](https://img.shields.io/npm/v/@fanvue/ui.svg)](https://www.npmjs.com/package/@fanvue/ui)
[![npm downloads](https://img.shields.io/npm/dm/@fanvue/ui.svg)](https://www.npmjs.com/package/@fanvue/ui)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@fanvue/ui)](https://bundlephobia.com/package/@fanvue/ui)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-ff4785.svg?logo=storybook&logoColor=white)](https://main--697a1b6dd4dad73ee9c0e5f5.chromatic.com/)
[![Showcase](https://img.shields.io/badge/Showcase-GitHub%20Pages-brightgreen.svg?logo=github)](https://fanvue.github.io/fanv-ui/)
[![GitHub](https://img.shields.io/github/stars/fanvue/fanv-ui?style=social)](https://github.com/fanvue/fanv-ui)

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

# Only if using animated icons
npm i motion
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

### Animated icons

`@fanvue/ui/animated-icons` ships animated twins of the icons that have one. Each
is exported under the **same name** as the static icon and renders in **exactly
the same box, at the same stroke weight**, so switching is a one-line change and
nothing in your layout moves:

```tsx
import { HeartIcon } from "@fanvue/ui";                // static
import { HeartIcon } from "@fanvue/ui/animated-icons";  // animates on hover

<HeartIcon size={24} />;
```

They live on their own subpath and depend on the optional `motion` peer, so
`@fanvue/ui` consumers never pay for Motion unless they import from here.

Not every icon has a twin — an icon is only mapped once its animated artwork has
been compared against ours — so a missing export means the pair was rejected or
upstream has no equivalent. `SpinnerIcon` is deliberately absent: a loading
indicator must not wait for a hover. Keep using the static one with
`animate-spin`, or `Loader`.

Nothing animates when the user has asked for reduced motion
(`prefers-reduced-motion: reduce`), including animations you start yourself
through `controlRef`.

By default an icon animates while hovered. To drive it from a parent instead —
an icon inside a button, say — pass a `controlRef`, which also turns the hover
trigger off. Drive it from focus as well as hover: the `<svg>` is not focusable,
so a keyboard user reaching the button gets nothing from hover alone.

```tsx
const icon = useRef<AnimatedIconHandle>(null);

<button
  onMouseEnter={() => icon.current?.startAnimation()}
  onMouseLeave={() => icon.current?.stopAnimation()}
  onFocus={() => icon.current?.startAnimation()}
  onBlur={() => icon.current?.stopAnimation()}
>
  <HeartIcon controlRef={icon} /> Favourite
</button>;
```

The animated artwork is stroke-only, so these icons take no `filled` prop —
passing one is a type error rather than a silent no-op. Browse what is available
in Storybook under **Foundations → Icons** with **animated** switched on: icons
badged `anim` have a twin, and clicking a card copies the right import. Artwork
and animations come from [lucide-animated](https://lucide-animated.com) (MIT),
built on Lucide (ISC) and in part Feather (MIT) — the full licence texts are in
`THIRD-PARTY-NOTICES.md`, which ships with the package.

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
| `pnpm dev:watch`         | Rebuild `dist/` on change (live-reload into apps) |
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
| **Icons**                |                                      |
| `pnpm icons:sync`        | Re-import icons from Figma and regenerate components, tests, stories |
| `pnpm icons:animated`    | Re-import animated icons from the lucide-animated registry and regenerate |
| **Tokens & Build**       |                                      |
| `pnpm build:dictionary`  | Generate styles from design tokens   |
| `pnpm build:showcase`    | Build the showcase site              |
| `pnpm size-limit` | Check bundle size |
| **Publishing** | |
| `pnpm publish:dry-run` | Build and dry-run npm publish |

### Live-reloading into pandora/eden

To iterate on a component and see it live in eden (`local.fanvue.com`) without publishing:

- **Easiest:** from the pandora repo root, run `pnpm dev:local-ui`. It runs this library's watch build automatically and points eden at this checkout's `dist/`. See pandora's README ("Live-reloading `@fanvue/ui`") — the pandora wiring ships in a companion PR.
- **Manual:** run `pnpm dev:watch` here, and start eden with `USE_LOCAL_FANVUE_UI=1` (or `pnpm --filter @pandora/eden start:local-ui`).

Requires this repo checked out beside `pandora` (or `FANVUE_UI_PATH` set in pandora). Component markup and Tailwind classes hot-reload; design **tokens** in `theme.css` are loaded by eden from the installed package, so local `theme.css` edits aren't reflected — test those via a published (pre)release.

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
