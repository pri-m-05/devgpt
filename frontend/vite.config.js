// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ANY request starting with /api → forward directly to http://localhost:5000
      "/api": "http://localhost:5000"
    }
  }
});
