import { defineStyleConfig } from "@chakra-ui/react";

/** Estilos base personalizados del componente <Tooltip/> de Chakra. */
const baseStyle = {
  bg: "gray.300",
  color: "black",
  fontSize: "1.0em",
};

export const tooltipTheme = defineStyleConfig({ baseStyle });
