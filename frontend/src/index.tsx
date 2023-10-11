import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./themes";
import toastOptions from "./themes/toastOptions";
import {
  CurrentAdminProvider,
  CurrentJugadorProvider,
  BusquedaProvider,
} from "./hooks";

const queryClient = new QueryClient();

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <ChakraProvider theme={theme} toastOptions={toastOptions}>
    <QueryClientProvider client={queryClient}>
      <CurrentAdminProvider>
        <CurrentJugadorProvider>
          <BusquedaProvider>
            <App />
          </BusquedaProvider>
        </CurrentJugadorProvider>
      </CurrentAdminProvider>
    </QueryClientProvider>
  </ChakraProvider>
);
