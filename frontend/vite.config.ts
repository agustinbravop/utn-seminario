import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import generouted from "@generouted/react-router/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.tsx",
    }),
    // File system based routing: https://github.com/oedotme/generouted/tree/main
    generouted(),
  ],
  resolve: { alias: { "@": "/src" } },
  server: {
    // Posible workaround para los problemas que tenemos de Hot Module Reload.
    // Es posible que no sea la solución correcta, y que solo sea un "placebo".
    watch: {
      usePolling: true,
    },
  },
});
