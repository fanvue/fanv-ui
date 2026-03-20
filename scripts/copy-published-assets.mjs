import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * Static files that must sit next to built JS (import.meta.url, <img src>, etc.).
 * Add `{ from, to }` entries when new components ship runtime assets.
 */
const assetBundles = [
  {
    from: "src/components/Avatar/assets",
    to: ["dist/components/Avatar/assets", "dist/cjs/components/Avatar/assets"],
  },
];

function copyDirContents(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  for (const name of readdirSync(srcDir)) {
    const fromPath = join(srcDir, name);
    const toPath = join(destDir, name);
    cpSync(fromPath, toPath, { recursive: true });
  }
}

for (const { from, to } of assetBundles) {
  const srcDir = join(root, from);
  if (!existsSync(srcDir)) {
    continue;
  }
  for (const destRel of to) {
    copyDirContents(srcDir, join(root, destRel));
  }
}
