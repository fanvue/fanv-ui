import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

const STYLE_FILES = ["theme.css", "base.css"];

/**
 * Copies the design-token stylesheets into `dist/styles/`.
 *
 * These are consumed by eden via `@import "@fanvue/ui/styles/theme.css"`, which
 * postcss resolves against the package. The `build` npm script used to do this
 * with a trailing `cp`, so `vite build --watch` never produced them and every
 * rebuild left `dist/styles` missing — which breaks `pnpm start:localui`
 * (Turbopack then falls back to a path outside the project root and refuses to
 * compile). Doing it in the build itself keeps watch mode self-sufficient.
 */
const copyStyles = (): Plugin => ({
  name: "fanvue-ui-copy-styles",
  writeBundle() {
    const outDir = resolve(import.meta.dirname, "dist/styles");
    mkdirSync(outDir, { recursive: true });
    for (const file of STYLE_FILES) {
      copyFileSync(resolve(import.meta.dirname, "src/styles", file), resolve(outDir, file));
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["**/*.test.tsx", "**/*.stories.tsx"],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
    copyStyles(),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        charts: resolve(import.meta.dirname, "src/charts.ts"),
        "date-picker": resolve(import.meta.dirname, "src/date-picker.ts"),
      },
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "tailwindcss",
        "react-day-picker",
        "recharts",
        /^@radix-ui\//,
        "clsx",
        "tailwind-merge",
      ],
      output: [
        {
          format: "es",
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].mjs",
          banner: '"use client";',
        },
        {
          format: "cjs",
          dir: "dist/cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].cjs",
          exports: "named",
          banner: '"use client";',
        },
      ],
    },
    cssCodeSplit: false,
    // `vite build --watch` re-emits only what its incremental graph rebuilds, so
    // clearing the directory drops every artifact it does not rewrite — entry
    // points added since the watcher started, and dist/styles. eden then fails to
    // resolve them and the page 500s. Leaving the directory in place keeps a
    // watch rebuild additive; `pnpm build` still produces a complete dist.
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    target: "es2022",
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
});
