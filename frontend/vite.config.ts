import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import eslint from "vite-plugin-eslint";
import { dependencies } from "./package.json";

// Lista de dependencias que no se quieren separar a un chunk distinto.
// Normalmente se debe a que son utilizadas en todas partes del código, y sería ineficiente tener un chunk que se solicite siempre.
const unsplittedVendors: (keyof typeof dependencies)[] = [
  "react",
  "react-router-dom",
  "react-dom",
  "@chakra-ui/icons",
  "@chakra-ui/react",
];

// Code-splitting en 'vite build' genera un chunk distinto para cada dependencia.
// Así, el browser solicita los chunks a medida que los necesita, y no descarga un solo archivo .js enorme.
// Cada "chunk" es un archivo .js minificado.
let chunks = {};
Object.keys(dependencies).forEach((key) => {
  if (!unsplittedVendors.includes(key as any)) {
    chunks[key] = [key];
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), viteTsconfigPaths(), eslint()],
  build: {
    outDir: "build",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: unsplittedVendors,
          ...chunks,
        },
      },
    },
  },
});
