import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "../main/resources/assets"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `bundle.js`,
        chunkFileNames: `bundle.js`,
        assetFileNames: `bundle.[ext]`,
      },
    },
  },
});
