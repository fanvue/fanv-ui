# @fanvue/ui-internal

Private component library for Fanvue. Built on `@fanvue/ui` (public design system).

## Architecture

- Components compose primitives from `@fanvue/ui` (Card, Button, etc.)
- Uses `cn` utility from `@fanvue/ui` for class merging
- Imports theme via `@fanvue/ui/styles/theme.css`
- No duplicated utilities — everything comes through the peer dependency

## Conventions

- Same tooling as `fanv-ui`: Biome, Vitest, Playwright, Storybook, Chromatic
- Storybook runs on port 6007 (fanv-ui uses 6006)
- Published to GitHub Packages only (not npm)
- License: UNLICENSED (proprietary)
