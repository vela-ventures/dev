/// <reference types="vitest" />

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    nodePolyfills({
      include: ["assert", "buffer", "events", "http", "https", "stream", "util", "zlib"]
    }),
    tailwindcss()
  ],
  optimizeDeps: {
    include: ["@liquity/providers", "@liquity/lib-ethers", "@liquity/lib-base", "@liquity/lib-react"]
  },
  build: {
    commonjsOptions: {
      include: ["**.cjs", "**.js"]
    }
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/setupTests.ts",
    testTimeout: 10000
  },
  server: {
    cors: false
  }
});
