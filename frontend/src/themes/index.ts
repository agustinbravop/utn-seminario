// theme/index.js
import { Theme, extendTheme } from "@chakra-ui/react";
import colors from "./colors";
import components from "./components";

/**
 * Todos los componentes de Chakra UI heredan valores del theme por defecto.
 * Llamando a `extendTheme()`, se sobreescriben solo los valores indicados.
 * Esta manera de personalizar estilos globales es flexible y escalable.
 * Para modificar props, ver: https://chakra-ui.com/docs/styled-system/customize-theme
 */
export const theme: Partial<Theme> = extendTheme({
  colors,
  components,
});

export default theme;
