import { tooltipTheme } from "./tooltip";

const floatingLabelStyles = {
  top: 0,
  left: 0,
  zIndex: 2,
  position: "absolute",
  backgroundColor: "white",
  pointerEvents: "none",
  fontWeight: "normal",
  mx: 3,
  px: 1,
  my: 3,
  transformOrigin: "left top",
  lineHeight: "1em",
};

export const floatingLabelActiveStyles = {
  transform: "scale(0.85) translateY(-24px)",
  ...floatingLabelStyles,
};

/**
 * A los componentes `Input` y `Form` se les agrega una variant 'floating'
 * que simula un "floating label". Cuando el Input no tiene valores ni está focuseado,
 * el label está por encima suyo y tapa el placeholder.
 * Caso contrario, el label flota hacia arriba.
 */
const components = {
  Input: {
    variants: {
      floating: {
        field: {
          "&::placeholder": {
            color: "gray",
          },
        },
      },
    },
  },
  Form: {
    variants: {
      floating: {
        container: {
          label: floatingLabelStyles,
          _focusWithin: { label: floatingLabelActiveStyles },
          "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
            floatingLabelActiveStyles,
        },
      },
    },
  },
  Tooltip: tooltipTheme,
};

export default components;
