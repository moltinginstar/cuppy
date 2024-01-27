import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";
import camelCase from "camelcase";
import packageJson from "./package.json";

const packageName = packageJson.name;

export default defineConfig({
  build: {
    target: "es6", // Same as in tsconfig.json
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"],
      name: camelCase(packageName, { pascalCase: true }), // For UMD
      fileName: "index", // So npm workspaces can find index.d.ts without repeating the path in exports
    },
    sourcemap: false,
    chunkSizeWarningLimit: 2, // kB
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
  plugins: [
    dts({ rollupTypes: true }),
    checker({
      typescript: true,
    }),
  ],
});
