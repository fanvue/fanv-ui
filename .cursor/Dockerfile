FROM node:24.13.0

# Pinned to match .nvmrc / CI exactly. With this Node as the only node on the
# image PATH, the version is deterministic across interactive and
# non-interactive shells and git hooks (no nvm/PATH-ordering quirks).
# Pin the package manager to match package.json "packageManager".
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
