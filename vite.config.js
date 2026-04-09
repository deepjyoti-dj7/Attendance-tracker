import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Attendance-tracker/", // Change this to your GitHub repo name
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-redux", "@reduxjs/toolkit"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
