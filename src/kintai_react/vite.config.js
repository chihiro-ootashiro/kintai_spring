import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "../main/resources/static"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/bundle.js`,
        chunkFileNames: `assets/bundle.js`,
        assetFileNames: `assets/bundle.[ext]`,
      },
    },
  },
});
