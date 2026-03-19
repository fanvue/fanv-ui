# @fanvue/ui-internal

Private React component library built on top of [@fanvue/ui](https://github.com/fanvue/fanv-ui) for the Fanvue ecosystem.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm storybook    # Component development (port 6007)
pnpm dev          # Vite dev server
pnpm test         # Run unit tests
pnpm build        # Build library
pnpm lint         # Lint with Biome
pnpm typecheck    # TypeScript check
```

## Publishing

This package is published exclusively to [GitHub Packages](https://github.com/fanvue/fanv-ui-internal/packages). Releases are automated via release-please on push to `main`.

### Consuming in other projects

```
@fanvue:registry=https://npm.pkg.github.com
```

```bash
pnpm add @fanvue/ui-internal
```
