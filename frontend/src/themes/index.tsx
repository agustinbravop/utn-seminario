// theme/index.js
import { Theme, extendTheme } from "@chakra-ui/react";

export const theme: Partial<Theme> = extendTheme({
  components: {
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
            _focusWithin: {
              label: {
                transform: "scale(0.85) translateY(-24px)",
                fontWeight: "normal",
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                transform: "scale(0.85) translateY(-24px)",
                fontWeight: "normal",
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
              fontWeight: "normal",
            },
          },
        },
      },
    },
  },
});

export default extendTheme(theme);
