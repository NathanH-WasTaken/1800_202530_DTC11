// This Vite config file (vite.config.js) tells Rollup (production bundler)
// to treat multiple HTML files as entry points so each becomes its own built page.

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        main: resolve(__dirname, "main.html"),
        settings: resolve(__dirname, "settings.html"),
        mental: resolve(__dirname, "mental.html"),
        mentalPages: resolve(__dirname, "mentalPages.html"),
        physical: resolve(__dirname, "physical.html"),
        physicalPages: resolve(__dirname, "physicalPages.html"),
      },
    },
  },
});
