FROM node:24

# Pin the package manager to match package.json "packageManager". With Node 24
# as the only node on the image PATH, the version is deterministic across
# interactive and non-interactive shells (no nvm/PATH-ordering quirks).
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
