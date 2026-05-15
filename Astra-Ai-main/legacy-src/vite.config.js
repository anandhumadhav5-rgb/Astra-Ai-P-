import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "markdown-vendor": ["react-markdown", "remark-gfm", "react-syntax-highlighter"],
          "ui-vendor": ["framer-motion", "lucide-react", "axios"]
        }
      }
    }
  }
});
