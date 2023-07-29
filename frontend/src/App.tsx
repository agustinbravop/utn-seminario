import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrentAdminProvider } from "./hooks/useCurrentAdmin";
import { ChakraProvider } from "@chakra-ui/react";
import { Routes } from "@generouted/react-router";
import { theme } from "./themes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CurrentAdminProvider>
          <Routes />
        </CurrentAdminProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
