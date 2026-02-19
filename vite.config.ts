import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["**/*.test.tsx", "**/*.stories.tsx"],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
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
