import { Plugin } from "vite";

import { Options, generate } from "./generate";
import path from "path";

export const defaultOptions: Options = {
  source: {
    routes: "./src/pages/**/[\\w[-]*.{jsx,tsx}",
    modals: "./src/pages/**/[+]*.{jsx,tsx}",
  },
  output: "./src/router.ts",
  format: true,
};

/* Modificación de @generouted que solo agrega la llamada a `path.normalize(...)` 
para evitar el problema de que no escaneaba los archivos en Windows. 
Esto se debe a que los paths en Windows se separan con `\` y no `/`.
Código original: https://github.com/oedotme/generouted/blob/main/plugins/react-router/src/plugin/index.ts
Una vez el proyecto @generouted solucione este bug, deberíamos poder quitar este código.
*/
export default function Generouted(options?: Partial<Options>): Plugin {
  const resolvedOptions = { ...defaultOptions, ...options };

  return {
    name: "generouted/my-router",
    enforce: "pre",
    configureServer(server) {
      const listener = (filePath: string) => {
        if (filePath.includes(path.normalize("/src/pages/"))) {
          generate(resolvedOptions);
        }
      };
      server.watcher.on("add", listener);
      server.watcher.on("change", listener);
      server.watcher.on("unlink", listener);
    },
    buildStart() {
      generate(resolvedOptions);
    },
  };
}
