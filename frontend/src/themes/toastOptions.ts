import { ToastProviderProps } from "@chakra-ui/react";

/**
 * Valores por defecto de los props al llamar a `toast()` del hook `useToast`.
 * Ref: https://chakra-ui.com/docs/components/toast/usage#configuring-toast-globally
 */
const toastOptions: ToastProviderProps = {
  defaultOptions: {
    isClosable: true,
    variant: "left-accent",
  },
};

export default toastOptions;
