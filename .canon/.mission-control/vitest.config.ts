import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Anchor root to this config's directory so `include` resolves the same
    // regardless of the CWD vitest is launched from (server/ vs .mission-control/).
    root: import.meta.dirname,
    environment: "node",
    include: ["server/test/**/*.test.ts"],
    globals: false,
  },
});
