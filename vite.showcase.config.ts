import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://fanvue.github.io/fanv-ui/ (App.tsx)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/fanv-ui/",
  build: {
    outDir: "dist-showcase",
    emptyOutDir: true,
    sourcemap: false,
    target: "es2022",
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
});
