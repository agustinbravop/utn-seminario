import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import generouted from "./src/router/index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // File system based routing: https://github.com/oedotme/generouted/tree/main
    generouted(),
  ],
  resolve: {
    alias: { "@": "/src" },
  },
});
