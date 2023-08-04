import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrentAdminProvider } from "./hooks/useCurrentAdmin";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./themes";
import { Suspense } from "react";
import { Routes } from "@generouted/react-router/lazy";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CurrentAdminProvider>
          <Suspense>
            <Routes />
          </Suspense>
        </CurrentAdminProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
