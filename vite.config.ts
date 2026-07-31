import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

const STYLE_FILES = ["theme.css", "base.css"];

/**
 * Copies the design-token stylesheets into `dist/styles/`.
 *
 * eden imports these via `@import "@fanvue/ui/styles/theme.css"`, which postcss
 * resolves against the package. Emitting them from the build rather than a
 * trailing `cp` in the npm script keeps `vite build --watch` self-sufficient;
 * without them `start:localui` fails to compile.
 */
const copyStyles = (): Plugin => ({
  name: "fanvue-ui-copy-styles",
  // `closeBundle`, not `writeBundle`: the latter fires once per output and we
  // declare two (es into `dist`, cjs into `dist/cjs`), so it would copy twice.
  closeBundle() {
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
    // Off so a watch rebuild never leaves `dist` empty mid-flight: vite clears it
    // at `renderStart` and only refills at the end, and `start:localui` 500s in
    // that window. Builds then never delete, so `build` does `rm -rf dist`.
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
