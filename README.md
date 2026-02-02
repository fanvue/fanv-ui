# FanvUI

Open source component library

## Commands

```bash
# Development
pnpm dev             # Start development server
pnpm build           # Build the library
pnpm preview         # Preview production build

# Testing
pnpm test            # Run unit tests
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Run tests with coverage report
pnpm test:e2e        # Run Playwright e2e tests

# Linting & Formatting
pnpm lint            # Check for lint errors
pnpm lint:fix        # Fix lint errors
pnpm format          # Format code

# Storybook
pnpm storybook       # Start Storybook dev server on port 6006
pnpm build-storybook # Build Storybook static site

# Figma Integration
pnpm figma:connect   # Authenticate with Figma (first time setup)
pnpm figma:publish   # Publish Code Connect mappings to Figma
pnpm figma:validate  # Verify Code Connect files are correctly formatted
pnpm figma:list      # List all Code Connect mappings in the project

# Tokens
pnpm build:dictionary # Generate styles from style dictionary tokens
```

## Figma + Storybook Integration

This library is integrated with Figma through Chromatic Connect and Figma Code Connect. **View Complete Documentation in Storybook**: `pnpm storybook # Navigate to "Documentation > Figma Integration"`
