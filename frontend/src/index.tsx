import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrentAdminProvider } from "./hooks/useCurrentAdmin";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./themes";

const queryClient = new QueryClient();

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <CurrentAdminProvider>
        <App />
      </CurrentAdminProvider>
    </QueryClientProvider>
  </ChakraProvider>
);
