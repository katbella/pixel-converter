import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import electron from "vite-plugin-electron";
import react from "@vitejs/plugin-react";
import renderer from "vite-plugin-electron-renderer";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    electron([
      {
        entry: "electron/main.ts",
        vite: {
          build: {
            outDir: "dist-electron",
            sourcemap: true,
            minify: false,
            lib: {
              entry: "electron/main.ts",
              formats: ["es"],
              fileName: () => "main.mjs",
            },
            rollupOptions: {
              external: ["sharp", "electron", "path", "fs"],
              output: {
                format: "es",
                entryFileNames: "[name].mjs",
                chunkFileNames: "[name].mjs",
              },
            },
          },
          define: {
            __dirname: "import.meta.url",
          },
        },
      },
      {
        entry: "electron/preload.ts",
        vite: {
          build: {
            outDir: "dist-electron",
            sourcemap: true,
            minify: false,
            rollupOptions: {
              external: ["electron"],
              output: {
                format: "es",
                entryFileNames: "[name].mjs",
              },
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      external: ["electron", "sharp"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
