import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { name as packageName } from "../package.json";

export default defineConfig({
  base: `/${packageName}/`,
  build: {
    target: "es6", // Same as in tsconfig.json
  },
  plugins: [
    checker({
      typescript: true,
    }),
  ],
});
