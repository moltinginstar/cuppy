import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  build: {
    target: "es6", // Same as in tsconfig.json
  },
  plugins: [
    checker({
      typescript: true,
    }),
  ],
});
