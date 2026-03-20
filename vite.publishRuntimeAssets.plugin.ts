import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Plugin } from "vite";

/**
 * Source dirs (relative to project root) whose files must sit next to built JS
 * (e.g. import.meta.url, &lt;img src&gt;). Each `to` path is relative to root.
 */
const assetBundles: ReadonlyArray<{ from: string; to: readonly string[] }> = [
  {
    from: "src/components/Avatar/assets",
    to: ["dist/components/Avatar/assets", "dist/cjs/components/Avatar/assets"],
  },
];

function copyDirContents(srcDir: string, destDir: string) {
  mkdirSync(destDir, { recursive: true });
  for (const name of readdirSync(srcDir)) {
    const fromPath = join(srcDir, name);
    const toPath = join(destDir, name);
    cpSync(fromPath, toPath, { recursive: true });
  }
}

export function publishRuntimeAssetsPlugin(root: string): Plugin {
  return {
    name: "publish-runtime-assets",
    apply: "build",
    closeBundle() {
      for (const { from, to } of assetBundles) {
        const srcDir = resolve(root, from);
        if (!existsSync(srcDir)) {
          continue;
        }
        for (const destRel of to) {
          copyDirContents(srcDir, resolve(root, destRel));
        }
      }
    },
  };
}
