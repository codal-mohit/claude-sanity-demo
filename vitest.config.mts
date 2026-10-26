import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Placeholder Sanity config so modules load; tests never hit the network.
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "test-project",
      NEXT_PUBLIC_SANITY_DATASET: "test",
    },
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
