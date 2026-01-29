import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "dist", "e2e"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/components/**/*.{ts,tsx}", "src/utils/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}", "**/index.ts"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    reporters: ["default"],
    watch: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
