import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import generouted from "@generouted/react-router/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.tsx",
    }),
    // File system based routing: https://github.com/oedotme/generouted
    generouted({ format: true }),
  ],
  resolve: { alias: { "@": "/src" } },
});
