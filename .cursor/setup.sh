#!/usr/bin/env bash
set -euo pipefail

# Cloud agent environment bootstrap.
#
# Makes the .nvmrc-pinned Node authoritative before installing deps. The cloud
# VM ships an older node earlier on PATH (e.g. /exec-daemon/node, Node 22) that
# otherwise shadows nvm's Node 24 even after `nvm use` reports success, so we
# also drop symlinks in a high-priority bin dir and prepend the bin to PATH in
# ~/.bashrc so interactive agent shells inherit the right version.

NODE_VERSION="$(tr -d 'v[:space:]' < .nvmrc 2>/dev/null || true)"
NODE_VERSION="${NODE_VERSION:-24.13.0}"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm install "$NODE_VERSION"
  nvm alias default "$NODE_VERSION"
  nvm use "$NODE_VERSION"

  NODE_BIN="$(dirname "$(nvm which "$NODE_VERSION")")"
  for bin in node npm npx corepack; do
    [ -x "$NODE_BIN/$bin" ] || continue
    sudo ln -sf "$NODE_BIN/$bin" "/usr/local/bin/$bin" 2>/dev/null \
      || ln -sf "$NODE_BIN/$bin" "$HOME/.local/bin/$bin" 2>/dev/null \
      || true
  done

  if ! grep -q 'fanv-ui pinned Node' "$HOME/.bashrc" 2>/dev/null; then
    {
      echo ''
      echo '# fanv-ui pinned Node (keep Node 24 ahead of the VM default)'
      echo "export PATH=\"$NODE_BIN:\$PATH\""
    } >> "$HOME/.bashrc"
  fi

  export PATH="$NODE_BIN:$PATH"
fi

echo "Bootstrapping with node $(node -v)"

corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium
