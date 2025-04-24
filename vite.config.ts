import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // Required for proper asset paths in production
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist", // Explicit build output directory for Netlify
    emptyOutDir: true, // Ensure clean builds
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
